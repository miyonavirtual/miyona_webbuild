"use client";

import { useState } from "react";
import { Sparkles, CreditCard, CheckCircle2, ChevronRight, Zap, ArrowLeft, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "intro" | "plans" | "payment";

export function ProUpgradeCard({ className = "" }: { className?: string }) {
    const [step, setStep] = useState<Step>("intro");
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

    const plans = [
        { id: 1, name: "1 Month", price: "$19.99" },
        { id: 2, name: "3 Months", price: "$44.99" },
        { id: 3, name: "12 Months", price: "$5.83/mo", desc: "Annually billed" },
    ];

    return (
        <div className={`p-5 rounded-3xl bg-purple-950/30 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(100,20,180,0.15)] flex flex-col gap-4 w-[280px] text-white overflow-hidden transition-all duration-500 ${className}`}>
            
            {step === "intro" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="font-bold text-[15px] tracking-tight">Unlock Luvoia Pro</h3>
                    </div>
                    
                    <div className="space-y-3 mt-1">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-medium text-white/80 leading-snug">Infinite Voice Calls</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-medium text-white/80 leading-snug">Exclusive Outfits & Avatars</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-medium text-white/80 leading-snug">Daily Coin Bonuses</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-medium text-white/80 leading-snug">Ultra-Fast Llama-3 Reasoning</p>
                        </div>
                    </div>

                    <Button 
                        onClick={() => setStep("plans")}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(140,50,250,0.3)] rounded-xl h-10 mt-1 transition-all group"
                    >
                        Start Pro <Zap className="w-4 h-4 ml-1.5 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            )}

            {step === "plans" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[15px] flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" /> Select Plan
                        </h3>
                        <button onClick={() => setStep("intro")} className="text-[11px] text-purple-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center"><ArrowLeft className="w-3 h-3 mr-1" /> Back</button>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        {plans.map(plan => (
                            <button 
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`flex flex-col text-left px-4 py-3 rounded-2xl border transition-all duration-300 ${selectedPlan === plan.id ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(140,50,250,0.2)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                            >
                                <div className="flex justify-between w-full items-center">
                                    <span className="font-semibold text-[13px]">{plan.name}</span>
                                    <span className="font-bold text-[14px] text-purple-300">{plan.price}</span>
                                </div>
                                {plan.desc && <span className="text-[10px] text-purple-200/50 mt-1 uppercase tracking-wider">{plan.desc}</span>}
                            </button>
                        ))}
                    </div>

                    <Button 
                        onClick={() => setStep("payment")}
                        disabled={!selectedPlan}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(140,50,250,0.3)] rounded-xl h-10 mt-1 transition-all disabled:opacity-50 disabled:hover:bg-purple-600 group"
                    >
                        Checkout <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            )}

            {step === "payment" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[15px] flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-400" /> Payment
                        </h3>
                        <button onClick={() => setStep("plans")} className="text-[11px] text-purple-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center"><ArrowLeft className="w-3 h-3 mr-1" /> Back</button>
                    </div>
                    
                    <div className="space-y-3">
                        <Input placeholder="Card Number" className="bg-black/40 border-white/10 text-[13px] h-9 focus-visible:ring-purple-500" />
                        <div className="flex gap-2">
                            <Input placeholder="MM/YY" className="bg-black/40 border-white/10 text-[13px] h-9 focus-visible:ring-purple-500 w-1/2" />
                            <Input placeholder="CVC" className="bg-black/40 border-white/10 text-[13px] h-9 focus-visible:ring-purple-500 w-1/2" />
                        </div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(140,50,250,0.3)] rounded-xl h-10 mt-2 transition-all">
                        Pay & Subscribe <CheckCircle2 className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}
