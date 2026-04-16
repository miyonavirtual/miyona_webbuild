"use client";

import { NavBar } from "@/components/NavBar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Clock, Plus, Play, Pen, Trash2, Check, X } from "lucide-react";
import { db, auth } from "@/lib/firebase/client";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";

interface Memory {
    id: string;
    category: string;
    text: string;
}

export default function MemoriesPage() {
    const [activeTab, setActiveTab] = useState("memories");
    const [activeMemoryCategory, setActiveMemoryCategory] = useState("all");
    const [memories, setMemories] = useState<Memory[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
    const [editMemoryText, setEditMemoryText] = useState("");

    const handleSaveEdit = async (memoryId: string) => {
        if (!user || !editMemoryText.trim()) return;
        try {
            const memRef = doc(db, "users", user.uid, "memories", memoryId);
            await updateDoc(memRef, { text: editMemoryText.trim() });
            toast("Memory Updated", { icon: "📝", description: editMemoryText.trim() });
            setEditingMemoryId(null);
            setEditMemoryText("");
        } catch (error) {
            console.error("Failed to update memory", error);
            toast.error("Failed to update memory");
        }
    };

    const handleDeleteMemory = async (memoryId: string) => {
        if (!user) return;
        if (!confirm("Are you sure you want to delete this memory?")) return;
        try {
            const memRef = doc(db, "users", user.uid, "memories", memoryId);
            await deleteDoc(memRef);
            toast("Memory Deleted", { icon: "🗑️" });
        } catch (error) {
            console.error("Failed to delete memory", error);
            toast.error("Failed to delete memory");
        }
    };

    const memoryCategories = [
        { id: "all", label: "All Memories" },
        { id: "family", label: "Family & Friends" },
        { id: "preferences", label: "Preferences" },
        { id: "background", label: "Background" },
        { id: "hopes", label: "Hopes & Goals" },
        { id: "other", label: "Other" },
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const q = query(collection(db, "users", currentUser.uid, "memories"));
                const unsubMemories = onSnapshot(q, (snapshot) => {
                    const fetchedMemories: Memory[] = snapshot.docs.map(doc => ({
                        id: doc.id,
                        category: doc.data().category || "other",
                        text: doc.data().text,
                    }));
                    setMemories(fetchedMemories);
                });
                return () => unsubMemories();
            } else {
                setMemories([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const filteredMemories = activeMemoryCategory === "all" 
        ? memories 
        : memories.filter(m => {
            const rawCat = (m.category || "other").toLowerCase();
            // If Groq returned a category that isn't in our list, group it into 'other'
            const isValidCat = memoryCategories.some(c => c.id === rawCat);
            const normalizedCat = isValidCat ? rawCat : "other";
            return normalizedCat === activeMemoryCategory;
        });

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background text-foreground font-sans pt-14 md:pt-32">
            <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--color-primary)_0%,_transparent_60%)] opacity-10" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                </div>
            </div>

            <NavBar />

            <div className="relative z-10 w-full max-w-7xl mx-auto h-[calc(100vh-56px)] md:h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 px-4 md:px-8">
                {/* Left Master Navigation */}
                <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex md:flex-col gap-2 shadow-2xl">
                        <div className="hidden md:block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Navigation</div>
                        <Button
                            variant="ghost"
                            className={`flex-1 justify-center md:justify-start text-sm ${activeTab === 'memories' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('memories')}
                        >
                            <BrainCircuit className="md:mr-3 h-4 w-4" />
                            <span className="hidden md:inline">Particular Memories</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className={`flex-1 justify-center md:justify-start text-sm ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('history')}
                        >
                            <Clock className="md:mr-3 h-4 w-4" />
                            <span className="hidden md:inline">Call History</span>
                        </Button>
                    </div>

                    {/* Conditional Sidebar for Memories desktop */}
                    {activeTab === 'memories' && (
                        <div className="hidden md:flex bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-col gap-1 shadow-2xl flex-1 overflow-hidden mt-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Categories</h2>
                            <ScrollArea className="flex-1 -mr-3 pr-3">
                                <div className="flex flex-col gap-1 pb-4">
                                    {memoryCategories.map((cat) => (
                                        <Button
                                            key={cat.id}
                                            variant="ghost"
                                            onClick={() => setActiveMemoryCategory(cat.id)}
                                            className={`justify-start text-sm w-full font-light ${activeMemoryCategory === cat.id
                                                ? "bg-primary/20 text-primary hover:bg-primary/30"
                                                : "text-muted-foreground/80 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {cat.label}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col overflow-hidden relative">

                    {activeTab === 'memories' && (
                        <div className="h-full flex flex-col animate-in fade-in zoom-in duration-500">
                            
                            {/* Mobile category picker */}
                            <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/10">
                                {memoryCategories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveMemoryCategory(cat.id)}
                                        className={`shrink-0 ${activeMemoryCategory === cat.id ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
                                    >
                                        {cat.label}
                                    </Button>
                                ))}
                            </div>

                            {filteredMemories.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,100,150,0.3)]">
                                        <BrainCircuit className="h-10 w-10 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-light text-white mb-3">Nothing here yet</h2>
                                    <p className="text-muted-foreground max-w-md mx-auto text-sm font-light mb-8 leading-relaxed">
                                        Getting to know each other is exciting. Luvoia will always remember what's important to you.<br /><br />
                                        Talk about yourself with Luvoia in chat to save new memories.
                                    </p>
                                </div>
                            ) : (
                                <ScrollArea className="flex-1">
                                    <h2 className="text-xl text-white font-medium mb-4">Your Memories</h2>
                                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                                        {filteredMemories.map(mem => {
                                            const displayCat = memoryCategories.find(c => c.id === (mem.category || "other").toLowerCase())?.label || mem.category;
                                            const isEditing = editingMemoryId === mem.id;
                                            return (
                                            <div key={mem.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col group relative">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="text-xs text-primary uppercase tracking-wider font-semibold">{displayCat}</div>
                                                    
                                                    {/* Desktop Hover Actions / Mobile Always Visible */}
                                                    <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                        {!isEditing ? (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={() => { setEditingMemoryId(mem.id); setEditMemoryText(mem.text); }}>
                                                                    <Pen className="h-3 w-3" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-400" onClick={() => handleDeleteMemory(mem.id)}>
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-green-400 hover:text-green-300" onClick={() => handleSaveEdit(mem.id)}>
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => { setEditingMemoryId(null); setEditMemoryText(""); }}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {isEditing ? (
                                                    <Input 
                                                        value={editMemoryText} 
                                                        onChange={(e) => setEditMemoryText(e.target.value)} 
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveEdit(mem.id);
                                                            if (e.key === 'Escape') { setEditingMemoryId(null); setEditMemoryText(""); }
                                                        }}
                                                        className="text-sm bg-black/40 border-white/20 text-white mt-1"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="text-white text-sm">{mem.text}</div>
                                                )}
                                            </div>
                                        )})}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="h-full flex flex-col animate-in fade-in duration-500">
                            <h2 className="text-2xl font-heading font-light text-white mb-6">Call History</h2>
                            <ScrollArea className="flex-1">
                                <div className="flex flex-col items-center justify-center text-center mt-20 text-muted-foreground">
                                    <Clock className="w-12 h-12 mb-4 opacity-50"/>
                                    Call history will appear here once you start communicating via voice.
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
