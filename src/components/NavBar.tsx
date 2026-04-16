"use client";

import { Button } from "@/components/ui/button";
import { Settings, MessageSquare, Gem, Sparkles, BrainCircuit, Menu, X } from "lucide-react";
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [gems, setGems] = useState(0);
    const [coins, setCoins] = useState(0);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const fetchUsername = () => {
        const user = auth.currentUser;
        if (user?.displayName) setUsername(user.displayName);
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user?.displayName) setUsername(user.displayName);
            if (user) {
                const walletRef = doc(db, "users", user.uid, "wallet", "balances");
                onSnapshot(walletRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setGems(docSnap.data().gems || 0);
                        setCoins(docSnap.data().coins || 0);
                    } else {
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
    const isMyLuvoia = pathname === "/mymiyona";

    const navLinks = [
        { href: "/chat",      label: "Chat",       icon: MessageSquare, active: isChat },
        { href: "/memories",  label: "Memories",   icon: BrainCircuit,  active: isMemories },
        { href: "/mymiyona",  label: "My Luvoia",  icon: Sparkles,      active: isMyLuvoia },
    ];

    return (
        <>
            {/* ────────────────── DESKTOP NAV ────────────────── */}
            <div className="hidden md:flex absolute top-0 left-0 right-0 p-8 justify-between items-start pointer-events-none z-20">
                {/* Left: welcome pill */}
                <div className="pointer-events-auto">
                    <div className="rounded-2xl bg-background/90 dark:bg-zinc-950/90 backdrop-blur-xl border-2 border-primary/10 shadow-sm px-6 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Sanctuary</p>
                        <p className="font-heading text-base font-bold text-foreground">
                            {username ? `Welcome ${username}` : "Your Room"}
                        </p>
                    </div>
                </div>

                {/* Center: nav tabs */}
                <div className="pointer-events-auto flex items-center gap-2 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-xl border-2 border-primary/10 shadow-sm p-1.5 rounded-full absolute left-1/2 -translate-x-1/2 top-8">
                    {navLinks.map(({ href, label, icon: Icon, active }) => (
                        <Link key={href} href={href}>
                            <Button
                                variant="ghost"
                                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                                    active
                                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                }`}
                            >
                                <Icon className={`h-4 w-4 mr-2 ${active ? "text-primary-foreground" : "text-primary/70"}`} />
                                {label}
                            </Button>
                        </Link>
                    ))}
                </div>

                {/* Right: wallet + settings */}
                <div className="pointer-events-auto flex gap-3">
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
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border border-yellow-200 shadow-sm" />
                            <span className="font-bold text-[14px] text-foreground">{coins}</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSettingsOpen(true)}
                        className="h-11 w-11 rounded-full bg-background/90 dark:bg-zinc-950/90 backdrop-blur-xl border-2 border-primary/10 shadow-sm hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* ────────────────── MOBILE NAV ────────────────── */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-20 pointer-events-none">
                {/* Top bar */}
                <div className="pointer-events-auto flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-xl border-b border-white/5">
                    {/* Brand */}
                    <span className="font-heading text-xl font-bold text-white tracking-widest uppercase">
                        Luvoia
                    </span>

                    {/* Right: coins + hamburger */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsWalletOpen(true)}
                            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 active:scale-95 transition-transform"
                        >
                            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border border-yellow-200 shadow-sm shrink-0" />
                            <span className="font-bold text-[13px] text-white">{coins}</span>
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(v => !v)}
                            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white active:scale-95 transition-transform"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Slide-down menu */}
                {isMobileMenuOpen && (
                    <div className="pointer-events-auto mx-3 mt-2 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                        {navLinks.map(({ href, label, icon: Icon, active }) => (
                            <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                                <div className={`flex items-center gap-3 px-5 py-4 transition-colors ${
                                    active ? "bg-primary/15 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}>
                                    <Icon className={`h-5 w-5 shrink-0 ${active ? "text-primary" : "text-white/30"}`} />
                                    <span className="font-semibold text-[15px]">{label}</span>
                                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                                </div>
                            </Link>
                        ))}
                        <div className="h-px bg-white/5 mx-4" />
                        <button
                            onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-5 py-4 text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <Settings className="h-5 w-5 text-white/30 shrink-0" />
                            <span className="font-semibold text-[15px]">Settings</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onProfileUpdate={fetchUsername} />

            {/* Pro upgrade card — desktop only */}
            <div className="hidden md:block fixed bottom-8 left-6 z-50 pointer-events-auto">
                <ProUpgradeCard className="transform scale-90 origin-bottom-left hover:scale-95 transition-all w-[240px]" />
            </div>
        </>
    );
}
