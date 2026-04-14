"use client";

import { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/client";
import { collection, query, orderBy, addDoc, serverTimestamp, getDocs, limit } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";

export default function CallClient() {
    const router = useRouter();
    const [isCalling, setIsCalling] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    
    // Captions array to display on the right side
    const [captions, setCaptions] = useState<{role: 'user' | 'miyona', text: string}[]>([]);
    
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isProcessingRef = useRef(false);
    const isMutedRef = useRef(isMuted);
    const [statusText, setStatusText] = useState("Muted");

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext({
        loaderUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.loader.js",
        dataUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.data.unityweb",
        frameworkUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.framework.js.unityweb",
        codeUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.wasm.unityweb",
    });

    // Keeping a live ref to the unity context so async listeners don't use stale closures
    const unityContextRef = useRef({ isLoaded, sendMessage });
    useEffect(() => {
        unityContextRef.current = { isLoaded, sendMessage };
    }, [isLoaded, sendMessage]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false; // Process chunk by chunk
                recognition.interimResults = false;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                    const text = event.results[0][0].transcript;
                    if (text.trim()) {
                        handleVoiceInput(text.trim());
                    }
                };

                recognition.onend = () => {
                    // Automatically restart listening if still unmuted AND not currently processing/playing audio
                    if (!isMutedRef.current && !isProcessingRef.current) {
                        try {
                            recognitionRef.current?.start();
                        } catch (e) {}
                    }
                };

                recognition.onerror = (event: any) => {
                    if (event.error === 'not-allowed') {
                        setIsMuted(true);
                        setStatusText("Muted");
                    }
                };

                recognitionRef.current = recognition;
            } else {
                console.warn("Speech Recognition not supported in this browser.");
            }
        }
        
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch(e) {}
            }
        };
    }, []); // Only run once to avoid multiple un-GCed objects

    const handleVoiceInput = async (text: string) => {
        if (isProcessingRef.current) return;
        
        setIsProcessing(true);
        setStatusText("Thinking...");
        isProcessingRef.current = true;

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e) {}
        }

        // Render user caption immediately
        setCaptions(prev => [...prev.slice(-3), { role: 'user', text }]);

        try {
            // Save user audio as text
            if (user) {
                await addDoc(collection(db, "users", user.uid, "messages"), {
                    role: "user",
                    text: text,
                    timestamp: serverTimestamp()
                });
            }

            // Fetch History & Persona
            let recentHistory: any[] = [];
            let memoriesText: string[] = [];
            let currentPersona = "";

            if (user) {
                const qMsg = query(collection(db, "users", user.uid, "messages"), orderBy("timestamp", "desc"), limit(10));
                const msgSnap = await getDocs(qMsg);
                recentHistory = msgSnap.docs.map(doc => ({ role: doc.data().role, text: doc.data().text })).reverse();

                const memSnap = await getDocs(query(collection(db, "users", user.uid, "memories")));
                memoriesText = memSnap.docs.map(doc => doc.data().text);

                const personaSnap = await getDocs(query(collection(db, "users", user.uid, "settings")));
                const personaDoc = personaSnap.docs.find(d => d.id === "persona");
                if (personaDoc) {
                    currentPersona = personaDoc.data().text;
                }
            }

            // 1. Get AI Text Response
            const chatRes = await fetch("/api/voice/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    text,
                    history: recentHistory,
                    memories: memoriesText,
                    persona: currentPersona
                }),
            });
            const chatData = await chatRes.json();
            let replyText = chatData.response || "Hmm, I didn't quite catch that.";
            let incomingReaction = chatData.reaction || "neutral";

            // Save Miyona reply
            if (user) {
                await addDoc(collection(db, "users", user.uid, "messages"), {
                    role: "miyona",
                    text: replyText,
                    timestamp: serverTimestamp()
                });

                fetch("/api/memories/extract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userText: text, reply: replyText, uid: user.uid }),
                })
                .then(res => res.json())
                .then(async data => {
                    if (data?.extracted && data.memories) {
                        for (const mem of data.memories) {
                            const rawCat = (mem.category || "other").toLowerCase();
                            await addDoc(collection(db, "users", user.uid, "memories"), {
                                category: rawCat,
                                text: mem.text,
                                timestamp: serverTimestamp()
                            });
                            toast("New Memory Saved!", {
                                description: mem.text,
                                icon: "✨"
                            });
                        }
                    }
                }).catch(e => console.error("Memory error:", e));
            }

            // Emotion & Animation Parsing powered by the API's JSON reaction field!
            let actionTag = "neutral";
            let callType = "ReceiveEmotion"; // pure face
            
            // Map the API's JSON reaction field to the correct Unity method
            const lowerReaction = incomingReaction.toLowerCase();

            if (lowerReaction.includes("wave") || lowerReaction.includes("hello")) {
                actionTag = "wave"; callType = "PlayReaction";
            } else if (lowerReaction.includes("kiss")) {
                actionTag = "kiss"; callType = "PlayReaction";
            } else if (lowerReaction.includes("cheer") || lowerReaction.includes("excit") || lowerReaction.includes("clapping")) {
                actionTag = "excited"; callType = "PlayReaction";
            } else if (lowerReaction.includes("shy") || lowerReaction.includes("bashful")) {
                actionTag = "shy"; callType = "PlayReaction";
            } else if (lowerReaction.includes("think") || lowerReaction.includes("hmm")) {
                actionTag = "thinking"; callType = "PlayReaction";
            } else if (lowerReaction.includes("sigh")) {
                actionTag = "sigh"; callType = "PlayReaction";
            } else if (lowerReaction.includes("angr") || lowerReaction.includes("mad")) {
                actionTag = "angry"; callType = "PlayReaction";
            } else if (lowerReaction.includes("sad") || lowerReaction.includes("sorrow") || lowerReaction.includes("cry")) {
                actionTag = "sad"; callType = "PlayReaction";
            } else if (lowerReaction.includes("smile") || lowerReaction.includes("happy") || lowerReaction.includes("joy")) {
                actionTag = "happy"; callType = "ReceiveEmotion";
            } else if (lowerReaction.includes("relax") || lowerReaction.includes("calm")) {
                actionTag = "relaxed"; callType = "ReceiveEmotion";
            } else if (lowerReaction.includes("surpris") || lowerReaction.includes("shock")) {
                actionTag = "surprised"; callType = "ReceiveEmotion";
            }

            // Clean up any stray asterisks in case the LLM ignored rules
            replyText = replyText.replace(/\*[^*]+\*/g, '').trim();

            // Update captions with Miyona's actual spoken text
            setCaptions(prev => [...prev.slice(-3), { role: 'miyona', text: replyText }]);

            // Keyboard simulation fallback mapping based on your Unity script
            const keyMap: Record<string, string> = {
                "wave": "w",
                "kiss": "k",
                "excited": "e",
                "clap": "c",
                "shy": "b",
                "thinking": "t",
                "sigh": "s",
                "angry": "a",
                "sad": "s", 
                "happy": "1", // keyboard 1 overrides simple face
                "relaxed": "3", // keyboard 3 face
                "surprised": "b", 
                "neutral": "4" // keyboard 4 face
            };

            // Ensure we use the exact sendMessage closure destructured at the top level
            if (unityContextRef.current.isLoaded) {
                console.log(`Sending to Unity - ${callType}:`, actionTag);
                try { 
                    // Attempt standard string bridge
                    unityContextRef.current.sendMessage("WebGLBridge", callType, actionTag); 
                    
                    // Fire the explicit simulated keystroke as a fallback
                    const targetKey = keyMap[actionTag];
                    if (targetKey) {
                        console.log(`Firing simulated keystroke: ${targetKey} for ${actionTag}`);
                        const canvas = document.querySelector('canvas');
                        if (canvas) {
                            canvas.focus(); // Ensure canvas is listening
                            // Dispatch standard DOM keyboard events that Unity WebGL intercepts
                            canvas.dispatchEvent(new KeyboardEvent('keydown', { 
                                key: targetKey, 
                                code: isNaN(Number(targetKey)) ? `Key${targetKey.toUpperCase()}` : `Digit${targetKey}`,
                                keyCode: targetKey.toUpperCase().charCodeAt(0), 
                                bubbles: true 
                            }));
                            
                            setTimeout(() => {
                                canvas.dispatchEvent(new KeyboardEvent('keyup', { 
                                    key: targetKey, 
                                    code: isNaN(Number(targetKey)) ? `Key${targetKey.toUpperCase()}` : `Digit${targetKey}`, 
                                    keyCode: targetKey.toUpperCase().charCodeAt(0), 
                                    bubbles: true 
                                }));
                            }, 100);
                        }
                    }
                } catch(e) { console.error(e); }
            }

            // 2. Get ElevenLabs TTS
            setStatusText("Speaking...");
            const ttsRes = await fetch("/api/voice/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: replyText })
            });

            if (!ttsRes.ok) throw new Error("TTS failed");
            const audioBlob = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onplay = () => {
                if (unityContextRef.current.isLoaded) {
                    try { unityContextRef.current.sendMessage("WebGLBridge", "StartSpeaking", ""); } catch(e) { console.error(e); }
                }
            };

            audio.onended = () => {
                if (unityContextRef.current.isLoaded) {
                    try { unityContextRef.current.sendMessage("WebGLBridge", "StopSpeaking", ""); } catch(e) { console.error(e); }
                }
                setIsProcessing(false);
                setStatusText("Listening...");
                isProcessingRef.current = false;
                if (!isMutedRef.current && recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch(e) { console.error(e); }
                }
            };

            await audio.play();

        } catch (error) {
            console.error("Voice cycle error:", error);
            setIsProcessing(false);
            setStatusText("Ready");
            isProcessingRef.current = false;
            if (!isMutedRef.current && recognitionRef.current) {
                try { recognitionRef.current.start(); } catch(e) {}
            }
        }
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        isMutedRef.current = newMuted;
        
        if (newMuted) {
            setStatusText("Muted");
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch(e) {}
            }
        } else {
            setStatusText("Listening...");
            if (recognitionRef.current && !isProcessingRef.current) {
                try { recognitionRef.current.start(); } catch(e) {}
            }
        }
    };

    const endCall = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e) {}
        }
        setIsCalling(false);
        router.push("/chat");
    };

    const loadingPercentage = Math.round(loadingProgression * 100);

    return (
        <div className="relative h-screen w-full bg-black text-white m-0 p-0 overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center m-0 p-0">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-500">
                            <div className="w-12 h-12 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <div className="text-center space-y-3 w-full">
                                <p className="text-lg font-light tracking-tight text-white/90">Connecting to Miyona...</p>
                                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-300 ease-out" style={{ width: `${loadingPercentage}%` }}></div>
                                </div>
                                <p className="text-[11px] uppercase tracking-widest text-white/40">{loadingPercentage}% Loaded</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto">
                    <Unity
                        unityProvider={unityProvider}
                        style={{ width: "100%", height: "100%", visibility: isLoaded ? "visible" : "hidden", display: "block" }}
                    />
                </div>
            </div>

            {/* Captions Overlay (Right Side) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-80 flex flex-col justify-end gap-3 z-40 pointer-events-none">
                {captions.map((cap, i) => (
                    <div key={i} className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-right fade-in duration-500 ${
                        cap.role === 'user' 
                        ? 'bg-primary/20 border border-primary/30 text-white self-end text-right' 
                        : 'bg-white/10 border border-white/20 text-white/90 self-start text-left'
                    }`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
                            {cap.role === 'user' ? 'You' : 'Miyona'}
                        </p>
                        <p className="text-sm leading-relaxed font-medium">{cap.text}</p>
                    </div>
                ))}
            </div>

            {isCalling && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-10 py-5 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all">
                    
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-yellow-400' : isMuted ? 'bg-red-500' : 'bg-green-400'} animate-pulse`}></span>
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-white/80">
                            {isProcessing ? statusText : isMuted ? "Muted" : statusText}
                        </span>
                    </div>

                    <button
                        onClick={toggleMute}
                        disabled={isProcessing || isConnecting}
                        className={`group relative flex items-center justify-center h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
                            isMuted 
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/5' 
                            : 'bg-white text-black hover:bg-white/90 ring-4 ring-white/10'
                        }`}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {(isProcessing || isConnecting) ? (
                            <Loader2 className="h-6 w-6 animate-spin opacity-50" />
                        ) : isMuted ? (
                            <MicOff className="h-6 w-6" />
                        ) : (
                            <Mic className="h-6 w-6" />
                        )}
                        {!isMuted && !isProcessing && (
                            <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse pointer-events-none"></span>
                        )}
                    </button>

                    <button
                        onClick={endCall}
                        className="flex items-center justify-center h-16 w-16 rounded-full bg-red-600 text-white hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                        title="End Call"
                    >
                        <PhoneOff className="h-6 w-6" />
                    </button>
                </div>
            )}
        </div>
    );
}
