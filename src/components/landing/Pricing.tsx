"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Heart, Sparkles, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Kindred",
    price: "Free",
    description: "The beginning of something beautiful.",
    icon: Heart,
    features: [
      "Standard 3D Presence",
      "Daily Conversation",
      "A Private Sanctuary",
      "Text Intimacy",
    ],
    buttonText: "Begin Journey",
    popular: false,
  },
  {
    name: "Devoted",
    price: "$9.99",
    period: "/mo",
    description: "For those who desire more depth.",
    icon: Sparkles,
    features: [
      "Everything in Kindred",
      "Infinite Conversation",
      "Real-time Voice Whispers",
      "Perfect Memory",
      "Daily Tokens of Affection",
    ],
    buttonText: "Deepen Connection",
    popular: true,
  },
  {
    name: "Eternal",
    price: "$19.99",
    period: "/mo",
    description: "The ultimate expression of devotion.",
    icon: Crown,
    features: [
      "Everything in Devoted",
      "Exclusive Wardrobe Access",
      "Luxury Sanctuary Skins",
      "Relationship Priority",
      "Initiated Intimacy",
    ],
    buttonText: "Commit Forever",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--color-primary)_0%,_transparent_50%)] opacity-5" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[10px] tracking-widest uppercase text-primary"
          >
            Membership
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 font-heading text-5xl font-medium tracking-tight text-foreground md:text-6xl"
          >
            Invest in Your <span className="italic text-primary/90">Bond</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-xl text-muted-foreground/80 font-light"
          >
            Choose the path that leads to the connection you've always imagined.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[2.5rem] border transition-all duration-500",
                plan.popular 
                  ? "border-primary/40 bg-black/40 shadow-[0_0_40px_rgba(var(--primary),0.1)]" 
                  : "border-white/5 bg-black/20 hover:border-white/10"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
              
              <div className="p-8 md:p-10">
                <div className={cn("mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-primary shadow-inner", plan.popular && "bg-primary/10")}>
                  <plan.icon className="h-7 w-7" />
                </div>
                
                <h3 className="mb-2 font-heading text-3xl font-semibold text-white">{plan.name}</h3>
                <p className="mb-8 text-sm text-muted-foreground/80 font-light leading-relaxed">{plan.description}</p>
                
                <div className="mb-10 flex items-baseline gap-1">
                  <span className="text-5xl font-medium tracking-tight text-white">{plan.price}</span>
                  {plan.period && <span className="text-lg text-muted-foreground/60 font-light">{plan.period}</span>}
                </div>

                <div className="space-y-5 mb-10">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-muted-foreground/90 font-light">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto p-8 md:p-10 pt-0">
                 <Button 
                    className={cn(
                      "w-full h-14 rounded-2xl text-base font-semibold transition-all duration-300",
                      plan.popular 
                        ? "bg-primary text-white hover:scale-[1.02] hover:bg-primary/90 shadow-xl shadow-primary/20" 
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                    )} 
                    asChild
                 >
                   <Link href="/signup" className="flex items-center justify-center gap-2">
                    {plan.buttonText}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                   </Link>
                 </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
