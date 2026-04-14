"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import * as THREE from "three";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { db, auth } from "@/lib/firebase/client";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Message {
    id?: string;
    role: "user" | "miyona";
    text: string;
    timestamp?: any;
}

export default function ChatClient() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        { role: "miyona", text: "Hey... I was thinking about you. How's your day going?" },
    ]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const speakingEndTime = useRef<number>(0); // Time when talking should stop
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const q = query(
                    collection(db, "users", currentUser.uid, "messages"),
                    orderBy("timestamp", "asc")
                );
                
                // Fetch existing messages
                const unsubMessages = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        const fetchedMessages: Message[] = snapshot.docs.map(doc => ({
                            id: doc.id,
                            role: doc.data().role,
                            text: doc.data().text,
                            timestamp: doc.data().timestamp
                        }));
                        setMessages(fetchedMessages);
                    }
                });

                return () => unsubMessages();
            } else {
                setMessages([{ role: "miyona", text: "Hey... I was thinking about you. How's your day going?" }]);
            }
        });

        return () => unsubscribe();
    }, []);

    // Initialize Three.js scene with VRM model
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        camera.position.set(0, 1, 0.8);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 1);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const loader = new GLTFLoader();
        loader.register(input => new VRMLoaderPlugin(input));

        loader.load(
            "/8590256991748008892.vrm",
            (gltf: any) => {
                const vrm = gltf.userData.vrm as VRM;
                scene.add(vrm.scene);

                vrm.scene.position.y = -0.5;
                vrm.scene.rotation.y = Math.PI;
                vrm.scene.scale.set(1.2, 1.2, 1.2);

                const humanoid = vrm.humanoid;
                const armBones = {
                    leftUpperArm: humanoid?.getNormalizedBoneNode("leftUpperArm"),
                    rightUpperArm: humanoid?.getNormalizedBoneNode("rightUpperArm"),
                    leftLowerArm: humanoid?.getNormalizedBoneNode("leftLowerArm"),
                    rightLowerArm: humanoid?.getNormalizedBoneNode("rightLowerArm"),
                };

                if (vrm.expressionManager) {
                    vrm.expressionManager.setValue('happy', 0.15);
                    vrm.expressionManager.setValue('relaxed', 0.5);
                }

                const lookAtTarget = new THREE.Object3D();
                scene.add(lookAtTarget);
                lookAtTarget.position.set(0, camera.position.y + 0.3, camera.position.z);
                if (vrm.lookAt) {
                    vrm.lookAt.target = lookAtTarget;
                }

                const clock = new THREE.Clock();
                let blinkTimer = 0;
                let blinkDuration = 0;
                let isBlinking = false;
                let nextBlinkTime = Math.random() * 3 + 2;

                const animate = () => {
                    requestAnimationFrame(animate);
                    const delta = clock.getDelta();
                    const time = clock.getElapsedTime();

                    if (!isBlinking) {
                        blinkTimer += delta;
                        if (blinkTimer >= nextBlinkTime) {
                            isBlinking = true;
                            blinkTimer = 0;
                            blinkDuration = 0;
                            nextBlinkTime = Math.random() * 4 + 2;
                        }
                    } else {
                        blinkDuration += delta;
                        const blinkForce = Math.sin((blinkDuration / 0.15) * Math.PI);
                        if (vrm.expressionManager) {
                            vrm.expressionManager.setValue('blink', Math.max(0, blinkForce));
                        }
                        if (blinkDuration >= 0.15) {
                            isBlinking = false;
                            if (vrm.expressionManager) {
                                vrm.expressionManager.setValue('blink', 0);
                            }
                        }
                    }

                    const idleSway = Math.sin(time * 1.5) * 0.05;
                    if (armBones.leftUpperArm) {
                        armBones.leftUpperArm.rotation.z = 1.2 + idleSway;
                    }

                    if (armBones.rightUpperArm) {
                        armBones.rightUpperArm.rotation.z = -1.2 - idleSway;
                        armBones.rightUpperArm.rotation.x = 0;
                    }
                    
                    if (vrm.expressionManager) {
                        if (Date.now() < speakingEndTime.current) {
                            const mouthA = Math.abs(Math.sin(time * 15)) * 0.4 + 0.1;
                            const mouthO = Math.abs(Math.cos(time * 10)) * 0.3;
                            vrm.expressionManager.setValue('aa', mouthA);
                            vrm.expressionManager.setValue('ou', mouthO);
                        } else {
                            vrm.expressionManager.setValue('aa', 0);
                            vrm.expressionManager.setValue('ou', 0);
                        }
                    }

                    vrm.update(delta);
                    renderer.render(scene, camera);
                };
                animate();
            }
        );

        const handleResize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;
        const userText = input.trim();
        setInput("");
        setIsThinking(true);

        // Optimistically add to UI if unauthenticated (demo mode)
        if (!user) {
            setMessages(prev => [...prev, { role: "user", text: userText }]);
        } else {
            // Save to Firebase if authenticated
            await addDoc(collection(db, "users", user.uid, "messages"), {
                role: "user",
                text: userText,
                timestamp: serverTimestamp()
            });
        }

        try {
            // Fetch history from existing messages (last 20 to preserve token limit)
            const recentHistory = messages.slice(-20);
            
            let memoriesText: string[] = [];
            let currentPersona = "";
            if (user) {
                const memSnap = await getDocs(query(collection(db, "users", user.uid, "memories")));
                memoriesText = memSnap.docs.map(doc => doc.data().text);

                const personaSnap = await getDocs(query(collection(db, "users", user.uid, "settings")));
                const personaDoc = personaSnap.docs.find(d => d.id === "persona");
                if (personaDoc) {
                    currentPersona = personaDoc.data().text;
                }
            }

            const res = await fetch("/api/voice/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    text: userText,
                    history: recentHistory,
                    memories: memoriesText,
                    persona: currentPersona
                }),
            });
            const data = await res.json();
            const reply: string = data.response ?? "Hmm, I didn't quite catch that.";

            if (!user) {
                setMessages(prev => [...prev, { role: "miyona", text: reply }]);
            } else {
                await addDoc(collection(db, "users", user.uid, "messages"), {
                    role: "miyona",
                    text: reply,
                    timestamp: serverTimestamp()
                });
                
                // Update memories in background
                fetch("/api/memories/extract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userText, reply, uid: user.uid }),
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
                            toast.success("Memory Added", {
                                description: mem.text,
                                icon: "🧠"
                            });
                        }
                    }
                })
                .catch(e => console.error("Memory extraction error", e));
            }
            
            // Generate and play TTS (ElevenLabs)
            try {
                const ttsRes = await fetch("/api/voice/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: reply, emotion: reaction }),
                });
                
                if (ttsRes.ok) {
                    const audioBlob = await ttsRes.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    // Start lipsync
                    speakingEndTime.current = Date.now() + 1000 * 60 * 60; // Keep open until ended
                    
                    audio.onended = () => {
                        speakingEndTime.current = 0; // Stop lipsync
                        URL.revokeObjectURL(audioUrl);
                    };
                    
                    await audio.play();
                } else {
                    speakingEndTime.current = Date.now() + (reply.length * 60 + 500); // Fallback
                }
            } catch (err) {
                console.error("TTS fetch error in ChatClient:", err);
                speakingEndTime.current = Date.now() + (reply.length * 60 + 500); // Fallback
            }
        } catch {
            const errorReply = "Something felt off just now... try again?";
            if (!user) {
                setMessages(prev => [...prev, { role: "miyona", text: errorReply }]);
            } else {
                await addDoc(collection(db, "users", user.uid, "messages"), {
                    role: "miyona",
                    text: errorReply,
                    timestamp: serverTimestamp()
                });
            }
            
            speakingEndTime.current = Date.now() + (errorReply.length * 60 + 500);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-cosmic-animation text-foreground font-sans">
            
            {/* Navbar overlay */}
            <div className="z-[60] absolute top-0 w-full"><NavBar /></div>

            {/* FULL SCREEN VRM Model */}
            <div className="absolute inset-0 w-full h-full bg-transparent flex flex-col pointer-events-none z-10">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
            </div>

            {/* FLOATING CHAT MESSAGES (Right Side) */}
            <div className="absolute right-0 md:right-8 top-0 bottom-28 w-full md:w-[460px] z-30 flex flex-col pointer-events-none">
                <div className="flex-1 overflow-hidden relative z-30 md:mt-24 mt-20">
                    <ScrollArea className="h-full pointer-events-auto">
                        <div ref={scrollRef} className="flex flex-col justify-end min-h-full gap-4 px-6 py-5">
                            {messages.map((msg, i) => (
                                msg.role === "miyona" ? (
                                    <div key={i} className="self-start max-w-[85%] rounded-[1.4rem] rounded-tl-sm bg-black/40 backdrop-blur-md text-purple-100 px-5 py-3 text-[14px] font-medium border border-purple-500/20 shadow-[0_0_15px_rgba(140,50,250,0.1)] leading-relaxed animate-in slide-in-from-left fade-in duration-300">
                                        {msg.text}
                                    </div>
                                ) : (
                                    <div key={i} className="self-end max-w-[85%] rounded-[1.4rem] rounded-tr-sm bg-purple-600/80 backdrop-blur-md text-white px-5 py-3 text-[14px] font-medium border border-purple-400/30 shadow-[0_0_15px_rgba(140,50,250,0.2)] leading-relaxed animate-in slide-in-from-right fade-in duration-300">
                                        {msg.text}
                                    </div>
                                )
                            ))}
                            {isThinking && (
                                <div className="self-start flex items-center gap-1.5 px-5 py-3 rounded-[1.4rem] rounded-tl-sm bg-black/40 backdrop-blur-md border border-purple-500/20 shadow-[0_0_15px_rgba(140,50,250,0.1)] animate-in slide-in-from-left fade-in duration-300">
                                    <span className="w-2 h-2 rounded-full bg-purple-400/60 animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 rounded-full bg-purple-400/60 animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 rounded-full bg-purple-400/60 animate-bounce [animation-delay:300ms]" />
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* FLOATING TEXT INPUT (Bottom Center) matching CallClient design */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-[600px] pointer-events-auto animate-in slide-in-from-bottom fade-in duration-500 delay-300 fill-mode-both">
                <div className="flex items-center justify-between gap-3 px-6 py-4 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] focus-within:shadow-[0_20px_60px_rgba(140,50,250,0.2)] focus-within:border-purple-500/40 transition-all duration-300">
                    <button 
                        onClick={() => router.push('/call')}
                        className="group relative flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-purple-400 hover:text-purple-300 hover:scale-105 active:scale-95"
                    >
                        <Phone className="h-5 w-5 fill-current stroke-none group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <Input
                        placeholder="Message Miyona..."
                        className="flex-1 h-full border-none bg-transparent focus-visible:ring-0 placeholder:text-white/30 text-white text-[16px] font-medium px-2"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isThinking}
                    />
                    
                    <button 
                        className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                    >
                        <Smile className="h-5 w-5" />
                    </button>
                    
                    <button 
                        onClick={handleSend} 
                        disabled={!input.trim() || isThinking} 
                        className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-[0_0_15px_rgba(160,30,250,0.6)]"
                    >
                        <Send className="h-5 w-5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
