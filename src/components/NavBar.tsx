"use client";

import { Button } from "@/components/ui/button";
import { Settings, Phone, MessageSquare, Gem, Sparkles, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/client";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { SettingsModal } from "@/components/SettingsModal";
import { ProUpgradeCard } from "@/components/ProUpgradeCard";
import { WalletModal } from "@/components/WalletModal";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavBarProps {
    rightContent?: React.ReactNode;
}

export function NavBar({ rightContent }: NavBarProps) {
    const [username, setUsername] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [gems, setGems] = useState(0);
    const [coins, setCoins] = useState(0);
    const pathname = usePathname();

    const fetchUsername = () => {
        const user = auth.currentUser;
        if (user?.displayName) {
            setUsername(user.displayName);
        }
    };

    useEffect(() => {
        // Listen for auth state so we get the name once Firebase resolves
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user?.displayName) {
                setUsername(user.displayName);
            }
            if (user) {
                const walletRef = doc(db, "users", user.uid, "wallet", "balances");
                onSnapshot(walletRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setGems(docSnap.data().gems || 0);
                        setCoins(docSnap.data().coins || 0);
                    } else {
                        // init empty values to be matched by wallet
                        setDoc(walletRef, { gems: 17, coins: 2000 }, { merge: true });
                        setGems(17);
                        setCoins(2000);
                    }
                });
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const isChat = pathname === "/chat" || pathname === "/playground";
    const isMemories = pathname === "/memories";
    const isMyMiyona = pathname === "/mymiyona";

    return (
        <>
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none z-20">
                <div className="pointer-events-auto flex items-center gap-6">
                    <div className="rounded-2xl bg-background/90 dark:bg-zinc-950/90 backdrop-blur-xl border-2 border-primary/10 shadow-sm px-6 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Sanctuary</p>
                        <p className="font-heading text-base font-bold text-foreground">{username ? `Welcome ${username}` : "Your Room"}</p>
                    </div>
                </div>

                {/* Center Navigation Tabs */}
                <div className="pointer-events-auto flex items-center gap-2 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-xl border-2 border-primary/10 shadow-sm p-1.5 rounded-full absolute left-1/2 -translate-x-1/2 top-8">
                    <Link href="/chat">
                        <Button
                            variant="ghost"
                            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${isChat
                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                }`}
                        >
                            <MessageSquare className={`h-4 w-4 mr-2 ${isChat ? "text-primary-foreground" : "text-primary/70"}`} />
                            Chat
                        </Button>
                    </Link>
                    <Link href="/memories">
                        <Button
                            variant="ghost"
                            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${isMemories
                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                }`}
                        >
                            <BrainCircuit className={`h-4 w-4 mr-2 ${isMemories ? "text-primary-foreground" : "text-primary/70"}`} />
                            Memories
                        </Button>
                    </Link>
                    <Link href="/mymiyona">
                        <Button
                            variant="ghost"
                            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${isMyMiyona
                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                }`}
                        >
                            <Sparkles className={`h-4 w-4 mr-2 ${isMyMiyona ? "text-primary-foreground" : "text-primary/70"}`} />
                            My Luvoia
                        </Button>
                    </Link>
                </div>

                <div className="pointer-events-auto flex gap-3 relative">
                    {/* Inject page-specific right content like Camera Controls */}
                    {rightContent}

                    <div 
                        className="bg-background/90 dark:bg-zinc-950/90 backdrop-blur-xl border-2 border-primary/10 shadow-sm rounded-full px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-all text-primary"
                        onClick={() => setIsWalletOpen(true)}
                    >
                        <div className="flex items-center gap-1.5 border-r border-primary/20 pr-3">
                            <Gem className="h-5 w-5 fill-emerald-400 text-emerald-500" />
                            <span className="font-bold text-[14px]">{gems}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border border-yellow-200 shadow-sm"></div>
                            <span className="font-bold text-[14px] text-foreground">{coins}</span>
                        </div>
                    </div>

                    <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

                    <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} className="h-11 w-11 rounded-full bg-background/90 dark:bg-zinc-950/90 backdrop-blur-xl border-2 border-primary/10 shadow-sm hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onProfileUpdate={fetchUsername}
            />

            {/* Fixed Dashboard Pro Pop-up / Widget (Bottom Left) */}
            <div className="fixed bottom-8 left-6 z-50 pointer-events-auto">
                <ProUpgradeCard className="transform scale-90 origin-bottom-left hover:scale-95 transition-all w-[240px]" />
            </div>
        </>
    );
}
