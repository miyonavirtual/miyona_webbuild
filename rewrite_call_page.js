const fs = require("fs");
const content = `"use client";

import { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { useRouter } from "next/navigation";

export default function CallPage() {
    const router = useRouter();
    const [isCalling, setIsCalling] = useState(true);

    const { isListening, isSpeaking, currentReaction, startMicrophone, stopMicrophone } = useDeepgramVoice();

    const isProcessing = isSpeaking;
    const isMuted = !isListening;

    const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext({
        loaderUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.loader.js",
        dataUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.data.unityweb",
        frameworkUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.framework.js.unityweb",
        codeUrl: "/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.wasm.unityweb",
    });

    const lastReactionRef = useRef<string>("neutral");

    useEffect(() => {
        if (!isLoaded) return;
        if (isSpeaking) {
            try { sendMessage("WebGLBridge", "StartSpeaking", ""); } catch (e) { }
        } else {
            try { sendMessage("WebGLBridge", "StopSpeaking", ""); } catch (e) { }
        }
    }, [isSpeaking, isLoaded, sendMessage]);

    useEffect(() => {
        if (!isLoaded || !isSpeaking) return;
        if (currentReaction && currentReaction !== "neutral" && currentReaction !== lastReactionRef.current) {
            try { sendMessage("WebGLBridge", "PlayReaction", currentReaction); } catch (e) { }
            lastReactionRef.current = currentReaction;
        }
        if (!isSpeaking) {
            lastReactionRef.current = "neutral";
        }
    }, [currentReaction, isSpeaking, isLoaded, sendMessage]);

    const [isConnecting, setIsConnecting] = useState(false);

    const toggleMute = async () => {
        if (isConnecting) return;

        if (isListening) {
            stopMicrophone();
        } else {
            setIsConnecting(true);
            try {
                await startMicrophone();
            } catch (err) {
                console.error("Failed to start mic:", err);
            } finally {
                setIsConnecting(false);
            }
        }
    };

    const endCall = () => {
        stopMicrophone();
        setIsCalling(false);
        router.push("/chat");
    };

    const loadingPercentage = Math.round(loadingProgression * 100);

    return (
        <div className="relative h-screen w-full bg-black text-white overflow-hidden m-0 p-0">
            {/* Immersive Main Area - fully flushed to edges */}
            <div className="absolute inset-0 flex flex-col items-center justify-center m-0 p-0">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-500">
                            <div className="w-12 h-12 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            
                            <div className="text-center space-y-3 w-full">
                                <p className="text-lg font-light tracking-tight text-white/90">Connecting to Miyona...</p>
                                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all duration-300 ease-out"
                                        style={{ width: \`\${loadingPercentage}%\` }}
                                    ></div>
                                </div>
                                <p className="text-[11px] uppercase tracking-widest text-white/40">{\`\${loadingPercentage}%\`} Loaded</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Unity Canvas Background */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto">
                    <Unity
                        unityProvider={unityProvider}
                        style={{ width: "100%", height: "100%", visibility: isLoaded ? "visible" : "hidden", display: "block" }}
                    />
                </div>
            </div>

            {/* Immersive Call Controls */}
            {isCalling && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-10 py-5 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all">

                    {/* Centered Status Indicator on top of controls */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <span className={\`w-1.5 h-1.5 rounded-full \${isProcessing ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse\`}></span>
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-white/80">
                            {isProcessing ? "Processing" : "00:00"}
                        </span>
                    </div>

                    {/* Mute/Unmute Button */}
                    <button
                        onClick={toggleMute}
                        disabled={isProcessing || isConnecting}
                        className={\`group relative flex items-center justify-center h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 \${
                            isMuted 
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/5' 
                            : 'bg-white text-black hover:bg-white/90 ring-4 ring-white/10'
                        }\`}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {(isProcessing || isConnecting) ? (
                            <Loader2 className="h-6 w-6 animate-spin opacity-50" />
                        ) : isMuted ? (
                            <MicOff className="h-6 w-6" />
                        ) : (
                            <Mic className="h-6 w-6" />
                        )}
                        {!isMuted && (
                            <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse pointer-events-none"></span>
                        )}
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={endCall}
                        disabled={isProcessing}
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
\`;

fs.writeFileSync("src/app/(app)/call/page.tsx", content);
console.log("File written successfully!");
