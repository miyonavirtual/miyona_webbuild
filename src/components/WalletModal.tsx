"use client";

import { useEffect, useState } from "react";
import { Gem, Coins, X } from "lucide-react";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const [gems, setGems] = useState<number>(0);
    const [coins, setCoins] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Listen to wallet balances
                const walletRef = doc(db, "users", user.uid, "wallet", "balances");
                const unsubSnapshot = onSnapshot(walletRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setGems(docSnap.data().gems || 0);
                        setCoins(docSnap.data().coins || 0);
                    } else {
                        // init empty
                        setDoc(walletRef, { gems: 17, coins: 2000 }, { merge: true });
                    }
                });

                return () => unsubSnapshot();
            }
        });

        return () => unsubscribe();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBuyGem = async (amount: number) => {
        // Mock success purchase
        const user = auth.currentUser;
        if (!user) return;
        setLoading(true);
        try {
            const walletRef = doc(db, "users", user.uid, "wallet", "balances");
            await setDoc(walletRef, { gems: gems + amount }, { merge: true });
        } finally {
            setLoading(false);
        }
    };

    const handleBuyCoin = async (coinAmount: number, gemCost: number) => {
        const user = auth.currentUser;
        if (!user) return;
        if (gems < gemCost) {
            alert("Not enough gems!");
            return;
        }
        setLoading(true);
        try {
            const walletRef = doc(db, "users", user.uid, "wallet", "balances");
            await setDoc(walletRef, { gems: gems - gemCost, coins: coins + coinAmount }, { merge: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute top-[80px] right-0 w-[400px] z-50 bg-[#252530]/50 backdrop-blur-[60px] border border-white/5 shadow-2xl rounded-[32px] overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Wallet</h2>
                <div className="flex items-center gap-4 bg-black/40 rounded-full px-4 py-2 border border-white/5">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                        <Gem className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                        <span>{gems}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                        <Coins className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{coins}</span>
                    </div>
                    <button onClick={onClose} className="ml-2 bg-white/10 hover:bg-white/20 p-1 rounded-full text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-6 pt-4 h-[calc(100vh-200px)] max-h-[600px] overflow-y-auto no-scrollbar">
                {/* Gems Section */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Gems</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-b from-[#384351] to-[#2B303B] rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/5 relative">
                            <div className="h-16 flex items-center justify-center">
                                <Gem className="w-10 h-10 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                            </div>
                            <span className="font-bold text-white text-lg">50</span>
                            <button onClick={() => handleBuyGem(50)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors">
                                $9.99
                            </button>
                        </div>

                        <div className="bg-gradient-to-b from-[#384351] to-[#2B303B] rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/5 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                                Popular
                            </div>
                            <div className="h-16 flex items-center justify-center mt-2 relative">
                                <Gem className="w-12 h-12 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                            </div>
                            <span className="font-bold text-white text-lg">100</span>
                            <button onClick={() => handleBuyGem(100)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors">
                                $14.99
                            </button>
                        </div>

                        <div className="bg-gradient-to-b from-[#384351] to-[#2B303B] rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/5 relative">
                            <div className="h-16 flex items-center justify-center">
                                <div className="relative">
                                    <Gem className="w-8 h-8 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] absolute -left-3 top-0" />
                                    <Gem className="w-10 h-10 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] relative z-10" />
                                    <Gem className="w-8 h-8 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] absolute -right-3 top-0" />
                                </div>
                            </div>
                            <span className="font-bold text-white text-lg">250</span>
                            <button onClick={() => handleBuyGem(250)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors">
                                $19.99
                            </button>
                        </div>

                        <div className="bg-gradient-to-b from-emerald-900/30 to-[#2B303B] rounded-2xl p-3 flex flex-col items-center gap-2 border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.1)] relative mt-2">
                            <div className="h-16 flex items-center justify-center">
                                <div className="grid grid-cols-2 grid-rows-2 gap-0 -rotate-12">
                                    <Gem className="w-8 h-8 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                                    <Gem className="w-8 h-8 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                                    <Gem className="w-8 h-8 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                                    <Gem className="w-8 h-8 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                                </div>
                            </div>
                            <span className="font-bold text-white text-lg">500</span>
                            <button onClick={() => handleBuyGem(500)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors">
                                $29.99
                            </button>
                        </div>

                        <div className="bg-gradient-to-b from-emerald-600/40 to-[#2B303B] rounded-2xl p-3 flex flex-col items-center gap-2 border border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)] relative mt-2">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                Best value
                            </div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 bg-red-400/90 backdrop-blur-sm text-white text-[10px] font-bold w-10 h-10 rounded-full flex flex-col items-center justify-center rotate-12 shadow-lg leading-none border border-white/20 z-20">
                                <span>75%</span>
                                <span>OFF</span>
                            </div>
                            <div className="h-16 flex items-center justify-center mt-2 relative z-10">
                                <div className="grid grid-cols-3 grid-rows-2 gap-0">
                                    {[...Array(6)].map((_, i) => (
                                        <Gem key={i} className="w-7 h-7 fill-emerald-400 text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] -ml-2 first:ml-0" />
                                    ))}
                                </div>
                            </div>
                            <span className="font-bold text-white text-lg">1000</span>
                            <button onClick={() => handleBuyGem(1000)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors relative z-20">
                                $49.99
                            </button>
                        </div>
                    </div>
                </div>

                {/* Coins Section */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Coins</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-b from-[#D48937]/30 to-[#384351] rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/5 relative overflow-hidden">
                            <div className="h-16 flex items-center justify-center">
                                <div className="relative flex justify-center">
                                    <div className="absolute w-12 h-10 bg-amber-400/20 blur-xl rounded-full"></div>
                                    <div className="relative flex -space-x-4">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-yellow-200 shadow-lg"></div>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-yellow-200 shadow-lg -translate-y-2"></div>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-yellow-200 shadow-lg"></div>
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-white text-lg">50</span>
                            <button onClick={() => handleBuyCoin(50, 1)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1">
                                <Gem className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" /> 1
                            </button>
                        </div>

                        <div className="bg-gradient-to-b from-[#D48937]/40 to-[#384351] rounded-2xl p-3 flex flex-col items-center gap-2 border border-amber-500/20 shadow-[0_0_20px_rgba(217,119,6,0.1)] relative overflow-hidden">
                            <div className="h-16 flex items-center justify-center">
                                <div className="relative flex justify-center">
                                    <div className="absolute w-16 h-12 bg-amber-400/30 blur-2xl rounded-full"></div>
                                    <div className="relative grid grid-cols-3 grid-rows-2 -gap-4 scale-75">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-yellow-200 shadow-lg ${i % 2 === 0 ? '-translate-y-3' : ''} -ml-2 first:ml-0`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-white text-lg">500</span>
                            <button onClick={() => handleBuyCoin(500, 10)} disabled={loading} className="w-full bg-white text-black font-extrabold text-sm rounded-xl py-2 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1">
                                <Gem className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" /> 10
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

