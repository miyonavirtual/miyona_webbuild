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
            
            speakingEndTime.current = Date.now() + (reply.length * 60 + 500);
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
        <div className="relative h-screen w-full overflow-hidden bg-cosmic-animation text-foreground font-sans flex flex-col md:flex-row">
            
            {/* Navbar overlay */}
            <div className="z-50 absolute top-0 w-full"><NavBar /></div>

            {/* LEFT / TOP SIDE: VRM Model */}
            <div className="relative w-full h-[50vh] md:h-full md:flex-1 bg-transparent flex flex-col">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
            </div>

            {/* RIGHT / BOTTOM SIDE: Chat panel (Responsive) */}
            <div className="relative w-full h-[50vh] md:w-[460px] md:h-full z-30 flex flex-col md:shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-md md:bg-white/5 md:dark:bg-black/20 md:border-l md:border-primary/15 overflow-hidden">

                <div className="md:hidden absolute -top-10 inset-x-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                <div className="px-6 py-4 flex items-center justify-between border-b border-primary/10 bg-primary/5 shrink-0 md:mt-24">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-lg">🌸</div>
                        <div>
                            <p className="font-bold text-[15px] text-foreground tracking-tight">Miyona</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse" />
                                <span className="text-[12px] text-muted-foreground/70 font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-transparent">
                    <ScrollArea className="h-full">
                        <div ref={scrollRef} className="flex flex-col gap-4 px-5 py-5 pb-2">
                            {messages.map((msg, i) => (
                                msg.role === "miyona" ? (
                                    <div key={i} className="self-start max-w-[85%] rounded-[1.4rem] rounded-tl-sm bg-secondary text-secondary-foreground px-5 py-3 text-[14px] font-medium border border-primary/10 shadow-sm leading-relaxed">
                                        {msg.text}
                                    </div>
                                ) : (
                                    <div key={i} className="self-end max-w-[85%] rounded-[1.4rem] rounded-tr-sm bg-primary text-primary-foreground px-5 py-3 text-[14px] font-medium shadow-sm leading-relaxed">
                                        {msg.text}
                                    </div>
                                )
                            ))}
                            {isThinking && (
                                <div className="self-start flex items-center gap-1.5 px-5 py-3 rounded-[1.4rem] rounded-tl-sm bg-secondary border border-primary/10">
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="px-4 py-3 pb-8 md:pb-6 border-t border-primary/10 bg-transparent border-t border-white/10 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-secondary/50 dark:bg-zinc-900 border border-primary/20 focus-within:border-primary/40 transition-colors">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.push('/call')}
                            className="h-9 w-9 shrink-0 rounded-full text-primary hover:bg-primary/10"
                        >
                            <Phone className="h-4 w-4 fill-primary stroke-none" />
                        </Button>
                        <Input
                            placeholder="Message Miyona..."
                            className="flex-1 h-9 border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/40 text-[14px] font-medium px-1"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isThinking}
                        />
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0">
                            <Smile className="h-4 w-4" />
                        </Button>
                        <Button size="icon" onClick={handleSend} disabled={!input.trim() || isThinking} className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 disabled:opacity-40">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
