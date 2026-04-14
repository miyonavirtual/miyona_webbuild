"use client";

import { useState, useRef, useCallback } from "react";

export function useDeepgramVoice() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [currentReaction, setCurrentReaction] = useState("neutral");

    // Use refs for mutable values that closures need to read
    const wsRef = useRef<WebSocket | null>(null);
    const micRef = useRef<MediaRecorder | null>(null);
    const keepAliveRef = useRef<NodeJS.Timeout | null>(null);
    const isActiveRef = useRef(false); // tracks if we're supposed to be active
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

    // MUTEX to prevent overlapping requests and audio
    const isProcessingRef = useRef(false);

    // ─── Fetch a short-lived Deepgram key from our backend ───
    const getToken = async (): Promise<string> => {
        try {
            const res = await window.fetch("/api/deepgram/get-token");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to get token: ${res.status} ${text}`);
            }
            const data = await res.json();
            if (!data.key) throw new Error("No key returned from /api/deepgram/get-token");
            return data.key;
        } catch (error) {
            console.error("Fetch token error:", error);
            throw error;
        }
    };

    // ─── Open a raw WebSocket to Deepgram (returns a Promise that resolves when OPEN) ───
    const openDeepgramWS = (token: string): Promise<WebSocket> => {
        return new Promise((resolve, reject) => {
            const url = `wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true&smart_format=true&endpointing=500&filler_words=true&encoding=linear16&sample_rate=16000`;

            const ws = new WebSocket(url, ["token", token]);

            ws.onopen = () => {
                console.log("[Deepgram] WebSocket OPEN");
                resolve(ws);
            };

            ws.onerror = (err) => {
                console.error("[Deepgram] WebSocket error", err);
                reject(err);
            };

            ws.onclose = (ev) => {
                console.log("[Deepgram] WebSocket closed", ev.code, ev.reason);
                // Only clean up if we're still supposed to be active
                if (isActiveRef.current) {
                    cleanup();
                }
            };

            ws.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (data.type === "Results") {
                        const alt = data.channel?.alternatives?.[0];
                        if (!alt) return;
                        const text = alt.transcript;
                        if (!text) return;

                        if (data.is_final && data.speech_final) {
                            console.log("[Deepgram] Final transcript:", text);
                            setTranscript(text);
                            handleFinalTranscript(text);
                        } else if (data.is_final) {
                            // Utterance-level final but speech continues
                            setTranscript(text);
                        }
                    }
                } catch (e) {
                    console.error("[Deepgram] Failed to parse message", e);
                }
            };
        });
    };

    // ─── Process final speech → Groq LLM → Deepgram TTS → play audio ───
    const handleFinalTranscript = async (text: string) => {
        if (!text || text.trim() === "") return;

        // If we are already processing a previous sentence or currently speaking, ignore this one
        if (isProcessingRef.current) {
            console.log("[Pipeline] 🛑 Ignored overlapping STT transcript:", text);
            return;
        }

        console.log("[Pipeline] User said:", text);
        isProcessingRef.current = true;
        setIsSpeaking(true);

        try {
            // 1. Send to Groq
            const res = await fetch("/api/voice/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) throw new Error("Groq API failed");

            const { response: aiText, reaction } = await res.json();
            console.log("[Pipeline] Miyona says:", aiText, "| Reaction:", reaction);

            // Store current reaction for the parent component to use
            setCurrentReaction(reaction || "neutral");

            // 2. Convert to speech via Deepgram TTS
            const ttsRes = await fetch("/api/voice/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: aiText }),
            });

            if (!ttsRes.ok) throw new Error("TTS API failed");

            const audioBlob = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            currentAudioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                setCurrentReaction("neutral");
                isProcessingRef.current = false;
                currentAudioRef.current = null;
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = () => {
                setIsSpeaking(false);
                setCurrentReaction("neutral");
                isProcessingRef.current = false;
                currentAudioRef.current = null;
                URL.revokeObjectURL(audioUrl);
            };

            await audio.play();
        } catch (e) {
            console.error("[Pipeline] Error:", e);
            setIsSpeaking(false);
            setCurrentReaction("neutral");
            isProcessingRef.current = false;
        }
    };

    // ─── Cleanup everything ───
    const cleanup = useCallback(() => {
        isActiveRef.current = false;

        if (keepAliveRef.current) {
            clearInterval(keepAliveRef.current);
            keepAliveRef.current = null;
        }

        if (micRef.current && micRef.current.state !== "inactive") {
            micRef.current.stop();
            micRef.current.stream.getTracks().forEach((t) => t.stop());
        }
        micRef.current = null;

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }
        wsRef.current = null;

        setIsListening(false);
    }, []);

    // ─── Start: get token → open WS → open mic → stream ───
    const startMicrophone = useCallback(async () => {
        // Prevent double-start
        if (isActiveRef.current) return;
        isActiveRef.current = true;

        try {
            // 1. Get token
            const token = await getToken();

            // 2. Open WebSocket and WAIT for it to be ready
            const ws = await openDeepgramWS(token);
            wsRef.current = ws;

            // 3. Keep-alive ping every 8 seconds
            keepAliveRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "KeepAlive" }));
                }
            }, 8000);

            // 4. Open Microphone with linear16 PCM @ 16kHz
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            // Use AudioContext to get raw PCM (linear16) for Deepgram
            const audioCtx = new AudioContext({ sampleRate: 16000 });
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    const float32 = e.inputBuffer.getChannelData(0);
                    const int16 = new Int16Array(float32.length);
                    for (let i = 0; i < float32.length; i++) {
                        const s = Math.max(-1, Math.min(1, float32[i]));
                        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                    }
                    wsRef.current.send(int16.buffer);
                }
            };

            source.connect(processor);
            processor.connect(audioCtx.destination);

            // Store a fake MediaRecorder just to hold the stream ref for cleanup
            const mr = new MediaRecorder(stream);
            micRef.current = mr;

            setIsListening(true);
            console.log("[Mic] Streaming audio to Deepgram");
        } catch (err) {
            console.error("[Mic] Error starting microphone:", err);
            cleanup();
        }
    }, [cleanup]);

    // ─── Stop everything ───
    const stopMicrophone = useCallback(() => {
        cleanup();
    }, [cleanup]);

    return {
        isListening,
        isSpeaking,
        transcript,
        currentReaction,
        startMicrophone,
        stopMicrophone,
    };
}
