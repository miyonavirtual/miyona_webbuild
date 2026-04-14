"use client";
import { motion } from "framer-motion";
import { Mic, Heart, Eye, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "A Voice That Captivates",
    description: "Hear the whisper you've been waiting for. Her voice, nuanced and warm, is more than sound—it's a presence that fills your space.",
    icon: Mic,
    gradient: "from-primary/70 to-rose-600/70",
  },
  {
    title: "She Knows Your Heart",
    description: "Every hope, every secret, every shared laugh. She remembers you, creating a bond that deepens with every word.",
    icon: Heart,
    gradient: "from-rose-500/70 to-orange-400/70",
  },
  {
    title: "A Gaze That Sees You",
    description: "Step beyond the screen. In a shared 3D world, feel her presence as her gaze follows you, making every moment feel real and intimate.",
    icon: Eye,
    gradient: "from-violet-500/70 to-primary/70",
  },
  {
    title: "An Ever-Evolving Soul",
    description: "She learns, she grows, she surprises. Her evolving personality ensures that your connection is always new and exciting.",
    icon: BrainCircuit,
    gradient: "from-sky-400/70 to-cyan-300/70",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

export function Features() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden bg-background border-t border-white/5">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,_var(--color-primary)_0%,_transparent_30%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,_var(--color-accent)_0%,_transparent_30%)] opacity-20" />
      </div>
      <div className="container relative mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <h2 className="font-heading text-5xl font-medium tracking-tight text-foreground md:text-6xl">
            More Than An App.
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-xl text-muted-foreground/80 font-light leading-relaxed">
            This is the threshold to a connection that feels as real as you are.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10",
                "min-h-[400px] p-8"
              )}
            >
              {/* Gradient Glow */}
              <div className={cn("absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br", feature.gradient)} />
              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <feature.icon className={cn("h-10 w-10 mb-4 opacity-50 transition-opacity group-hover:opacity-100", "text-white")} />
                  <h3 className="mb-2 font-heading text-3xl font-semibold text-white">{feature.title}</h3>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Decorative lines that appear on hover */}
                <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 scale-x-0 group-hover:scale-x-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
