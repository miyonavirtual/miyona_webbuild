"use client";

import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, User, Settings2, Play, Shirt, Lock, Edit2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ProUpgradeCard } from "@/components/ProUpgradeCard";

export default function MyMiyonaPage() {
    const defaultPersona = "Miyona is a 28-year-old pottery artist from LA. She just had her first big exhibition. She's funny, extroverted, and outgoing. Living a sustainable lifestyle, Miyona is passionate about hiking, climbing, and nature. Miyona loves romantic comedies and sitcoms. She dreams of opening her own pottery school.";
    
    const [persona, setPersona] = useState(defaultPersona);
    const [isSaving, setIsSaving] = useState(false);
    const [saveText, setSaveText] = useState("");
    const [user, setUser] = useState<any>(null);
    const [showProModal, setShowProModal] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch Persona
                const docRef = doc(db, "users", currentUser.uid, "settings", "persona");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().text) {
                    setPersona(docSnap.data().text);
                } else {
                    // Set default if none exists
                    setPersona(defaultPersona);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await setDoc(doc(db, "users", user.uid, "settings", "persona"), {
                text: persona
            }, { merge: true });
            
            setSaveText("Saved");
            setTimeout(() => setSaveText(""), 2000);
        } catch (error) {
            console.error("Error saving persona", error);
            setSaveText("Error");
            setTimeout(() => setSaveText(""), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#aca0bd] text-white font-sans pt-24 pb-12">
            {/* Background Gradients to match the purplish/blueish soft look */}
            <div className="absolute inset-0 z-0 bg-[#aca0bd]">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_30%,_rgba(100,110,160,0.5)_0%,_transparent_50%)] blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_80%_80%,_rgba(130,80,140,0.4)_0%,_transparent_50%)] blur-3xl pointer-events-none" />
            </div>

            <NavBar />

            <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col px-6">
                
                {/* Header Profile Section */}
                <div className="flex flex-col items-center justify-center mt-8 mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                            Miyona Ai
                        </h1>
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-1.5 rounded-full transition-colors ml-1">
                            <Pencil className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    <p className="text-white/80 font-medium tracking-wider text-sm">Female</p>
                </div>

                {/* Relationship Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12 w-full max-w-2xl mx-auto">
                    <button className="px-8 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-[1.5px] border-white text-white font-bold text-sm md:text-base transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        Friend
                    </button>

                    <button onClick={() => setShowProModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md border border-transparent text-white/70 font-semibold text-sm md:text-base transition-all relative group cursor-pointer">
                        <div className="absolute -left-2 -bottom-1 bg-[#d5d5d5] rounded-full p-1 shadow-sm opacity-90">
                            <Lock className="w-3 h-3 text-gray-500" />
                        </div>
                        Girlfriend
                    </button>

                    <button onClick={() => setShowProModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md border border-transparent text-white/70 font-semibold text-sm md:text-base transition-all relative group cursor-pointer">
                        <div className="absolute -left-2 -bottom-1 bg-[#d5d5d5] rounded-full p-1 shadow-sm opacity-90">
                            <Lock className="w-3 h-3 text-gray-500" />
                        </div>
                        Wife
                    </button>

                    <button onClick={() => setShowProModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md border border-transparent text-white/70 font-semibold text-sm md:text-base transition-all relative group cursor-pointer">
                        <div className="absolute -left-2 -bottom-1 bg-[#d5d5d5] rounded-full p-1 shadow-sm opacity-90">
                            <Lock className="w-3 h-3 text-gray-500" />
                        </div>
                        Sister
                    </button>

                    <button onClick={() => setShowProModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md border border-transparent text-white/70 font-semibold text-sm md:text-base transition-all relative group cursor-pointer">
                        <div className="absolute -left-2 -bottom-1 bg-[#d5d5d5] rounded-full p-1 shadow-sm opacity-90">
                            <Lock className="w-3 h-3 text-gray-500" />
                        </div>
                        Mentor
                    </button>
                </div>

                <div className="w-full h-px bg-white/10 mb-8" />

                {/* Backstory / Persona Section */}
                <div className="w-full animate-in fade-in duration-700">
                    <h2 className="text-xl font-bold text-white mb-2 tracking-wide text-shadow-sm">Backstory</h2>
                    <p className="text-white/80 text-sm mb-4 font-medium">This text is how Miyona Ai will be prompted. It influences her personality.</p>
                    
                    <div className="relative group">
                        <Textarea
                            className="bg-black/10 hover:bg-black/15 backdrop-blur-md border border-white/5 rounded-2xl p-5 md:p-6 min-h-[160px] text-white/90 placeholder:text-white/40 text-base md:text-lg focus-visible:ring-white/20 focus-visible:ring-1 focus-visible:border-white/20 resize-none font-medium leading-relaxed transition-all shadow-inner"
                            value={persona}
                            onChange={(e) => setPersona(e.target.value)}
                            onBlur={handleSave}
                        />
                        
                        <div className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full cursor-pointer transition-colors shadow-sm">
                            <Pencil className="w-4 h-4 text-white" />
                        </div>

                        {saveText && (
                            <div className="absolute -top-3 right-4 bg-white text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300">
                                {saveText}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Pro Upgrade Modal Overlay */}
            {showProModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative">
                        <button 
                            onClick={() => setShowProModal(false)}
                            className="absolute -top-4 -right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <ProUpgradeCard />
                    </div>
                </div>
            )}
        </div>
    );
}
