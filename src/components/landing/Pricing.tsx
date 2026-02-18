"use strict";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X, Heart, Sparkles, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Silver",
    price: "$0",
    description: "Start your cute journey.",
    icon: Heart,
    color: "from-blue-300 to-cyan-300",
    features: [
      "Standard 3D Avatar",
      "50 Messages / Day",
      "Cozy Room",
      "Text Chat",
    ],
    missing: [
      "No Voice Calls",
      "No Daily Gift Allowance",
      "Limited Memory",
    ],
    buttonText: "Start Free",
    popular: false,
  },
  {
    name: "Gold",
    price: "$9.99",
    period: "/mo",
    description: "Unlock the full romance.",
    icon: Sparkles,
    color: "from-pink-400 to-rose-400",
    features: [
      "Everything in Silver",
      "Unlimited Messages",
      "Real-time Voice Calls",
      "Full Long-term Memory",
      "Daily Gift Allowance (100 Gems)",
    ],
    missing: [],
    buttonText: "Get Gold",
    popular: true,
  },
  {
    name: "Platinum",
    price: "$19.99",
    period: "/mo",
    description: "The ultimate devotion.",
    icon: Crown,
    color: "from-purple-400 to-indigo-400",
    features: [
      "Everything in Gold",
      "Exclusive Wardrobe Access",
      "Luxury Room Skins",
      "2x Relationship XP Boost",
      "AI-Initiated Texts",
    ],
    missing: [],
    buttonText: "Get Platinum",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-pink-100 blur-3xl opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600">
            Membership Plans
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Invest in Your <span className="text-pink-500">Bond</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the perfect tier to deepen your connection. Cancel anytime, no hard feelings!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "group relative flex flex-col border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
                plan.popular 
                  ? "border-pink-200 bg-white/80 shadow-pink-100" 
                  : "border-transparent bg-white/50 shadow-sm hover:border-blue-100"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-1 text-sm font-bold text-white shadow-lg shadow-pink-200">
                    Most Loved
                  </span>
                </div>
              )}
              
              <CardHeader>
                <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md", plan.color)}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <CardDescription className="text-gray-500">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-muted-foreground font-medium">{plan.period}</span>}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                         <Check className="h-3 w-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                  {plan.missing.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
                       <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                         <X className="h-3 w-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                 <Button 
                    className={cn(
                      "w-full rounded-xl py-6 text-base font-bold transition-all hover:scale-[1.02]",
                      plan.popular 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-pink-200 hover:bg-primary/90" 
                        : "bg-white text-gray-900 shadow-sm border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                    )} 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                 >
                   <Link href="/signup">{plan.buttonText}</Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
