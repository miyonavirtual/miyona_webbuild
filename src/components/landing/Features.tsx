"use strict";
import { Brain, Sparkles, MessageCircle, Gift, Box, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Box,
    title: "Fully 3D & Interactive",
    description: "Not just text. Interact with your companion in a vivid 3D environment. Customize outfits, room decor, and more.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Brain,
    title: "Long-Term Memory",
    description: "Miyona remembers everything. Your favorite movies, your birthday, your deepest talks. She evolves with you.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Gift,
    title: "Gifting Economy",
    description: "Show affection through gifts. Watch her reactions and unlock special animations as your bond deepens.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Voice",
    description: "Talk naturally. Powered by ElevenLabs for ultra-realistic voice synthesis and emotional inflection.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Sparkles,
    title: "Emotional Intelligence",
    description: "She detects your mood and adapts. Support when you're down, celebration when you're up.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Zap,
    title: "24/7 Availability",
    description: "Always there for you. No server queues, no waiting. Instant connection whenever you need it.",
    color: "bg-green-100 text-green-600",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 bg-white/40">
       {/* Background Dots */}
       <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600">
                Why Miyona?
            </span>
            <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                More Than Just <span className="text-purple-500">Code</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Built with love and cutting-edge tech to deliver the most heartwarming AI experience possible.
            </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i} className="group border-none bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl">
              <CardHeader>
                <div className={cn("mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed text-gray-500">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
