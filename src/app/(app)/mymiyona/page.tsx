"use client";

import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, User, Settings2, Play, Shirt } from "lucide-react";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function MyMiyonaPage() {
    const [persona, setPersona] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveText, setSaveText] = useState("Save Persona");
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ days: 0, status: "New", timeTalked: "0m" });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch Persona
                const docRef = doc(db, "users", currentUser.uid, "settings", "persona");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().text) {
                    setPersona(docSnap.data().text);
                }

                // Fetch Stats dynamically from Messages
                try {
                    const msgsRef = collection(db, "users", currentUser.uid, "messages");
                    const msgsSnap = await getDocs(msgsRef);
                    const msgCount = msgsSnap.size;

                    let daysCount = 0;
                    const firstMsgQuery = query(msgsRef, orderBy("timestamp", "asc"), limit(1));
                    const firstMsgSnap = await getDocs(firstMsgQuery);
                    
                    if (!firstMsgSnap.empty) {
                        const ts = firstMsgSnap.docs[0].data().timestamp;
                        if (ts) {
                            const firstDate = ts.toDate();
                            const diffTime = Date.now() - firstDate.getTime();
                            daysCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        }
                    }

                    let statusLevel = "New";
                    if (msgCount > 500) statusLevel = "Inseparable";
                    else if (msgCount > 150) statusLevel = "Close";
                    else if (msgCount > 40) statusLevel = "Friend";
                    else if (msgCount > 10) statusLevel = "Familiar";

                    // Estimate time talked: assuming ~1 min taken per message exchange
                    const totalMinutes = msgCount; 
                    const timeString = totalMinutes < 60 
                        ? `${totalMinutes}m` 
                        : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

                    setStats({ days: daysCount, status: statusLevel, timeTalked: timeString });
                } catch (e) {
                    console.error("Error fetching relationship stats:", e);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setSaveText("Saving...");
        try {
            await setDoc(doc(db, "users", user.uid, "settings", "persona"), {
                text: persona
            }, { merge: true });
            
            setSaveText("Saved!");
            setTimeout(() => setSaveText("Save Persona"), 2000);
        } catch (error) {
            console.error("Error saving persona", error);
            setSaveText("Error!");
            setTimeout(() => setSaveText("Save Persona"), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background text-foreground font-sans pt-24 md:pt-32">
            <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--color-primary)_0%,_transparent_60%)] opacity-10" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                </div>
            </div>

            <NavBar />

            <div className="relative z-10 w-full max-w-4xl mx-auto h-[calc(100vh-140px)] flex gap-6 px-4 md:px-8">
                <div className="flex-1 bg-black/5 dark:bg-black/20 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col overflow-hidden relative">

                    <div className="h-full flex flex-col animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-heading font-light text-foreground flex items-center gap-3 mb-6">
                            <Sparkles className="h-6 w-6 text-primary" /> My Miyona
                        </h2>

                        <ScrollArea className="flex-1 right-[-4px] pr-4">
                            <div className="space-y-6 md:space-y-8 pb-8">
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center"><User className="w-4 h-4 mr-2" /> Relationship Stats</h3>
                                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                                        <div className="bg-black/5 dark:bg-black/30 rounded-xl p-3 md:p-5 border border-border">
                                            <div className="text-xl md:text-3xl font-light text-foreground mb-1">{stats.days}</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Days Together</div>
                                        </div>
                                        <div className="bg-black/5 dark:bg-black/30 rounded-xl p-3 md:p-5 border border-border">
                                            <div className="text-xl md:text-3xl font-light text-primary mb-1 pl-1">{stats.status}</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Status</div>
                                        </div>
                                        <div className="bg-black/5 dark:bg-black/30 rounded-xl p-3 md:p-5 border border-border">
                                            <div className="text-xl md:text-3xl font-light text-foreground mb-1">{stats.timeTalked}</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Time Talked</div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center"><Settings2 className="w-4 h-4 mr-2" /> Persona & Role</h3>
                                    <div className="bg-black/5 dark:bg-black/30 rounded-xl p-4 md:p-5 border border-border">
                                        <label className="text-sm text-foreground/80 mb-2 block font-light">How should Miyona act towards you?</label>
                                        <Textarea
                                            placeholder="e.g., Act as my supportive AI girlfriend..."
                                            className="bg-black/5 dark:bg-white/5 border-border h-32 resize-none focus-visible:ring-primary/50 text-foreground font-light text-sm"
                                            value={persona}
                                            onChange={e => setPersona(e.target.value)}
                                        />
                                        <div className="flex justify-end mt-4">
                                            <Button 
                                                size="sm" 
                                                onClick={handleSave} 
                                                disabled={isSaving} 
                                                className={`text-primary-foreground transition-all duration-300 ${saveText === "Saved!" ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"}`}
                                            >
                                                {saveText}
                                            </Button>
                                        </div>
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center"><Play className="w-4 h-4 mr-2" /> Voice Settings</h3>
                                        <div className="bg-black/5 dark:bg-black/30 rounded-xl p-4 md:p-5 border border-border flex flex-col items-center justify-center py-8 opacity-75">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-3">
                                                <Settings2 className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs md:text-sm text-muted-foreground">Voice selection coming soon</p>
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center"><Shirt className="w-4 h-4 mr-2" /> Wardrobe</h3>
                                        <div className="bg-black/5 dark:bg-black/30 rounded-xl p-4 md:p-5 border border-border flex flex-col items-center justify-center py-8 opacity-75">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-3">
                                                <Shirt className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs md:text-sm text-muted-foreground">Outfits coming soon</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
