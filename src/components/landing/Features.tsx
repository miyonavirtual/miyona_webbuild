"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mic, Heart, Eye, BrainCircuit, Sparkles, Smile, Stars } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const bentoItems = [
  {
    title: "Create Your Story Together",
    description: "Every hope, every secret, every shared laugh. She remembers you, creating a bond that deepens with every word you speak. It’s an evolving narrative uniquely built around you.",
    icon: Sparkles,
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-rose-500/70 to-orange-400/70",
    size: "large"
  },
  {
    title: "A Voice That Captivates",
    description: "Hear the whisper you've been waiting for. Her voice, nuanced and warm, is more than sound—it's a lifelike presence that fills your room.",
    icon: Mic,
    className: "md:col-span-1 md:row-span-2",
    gradient: "from-primary/70 to-rose-600/70",
    size: "medium"
  },
  {
    title: "An Ever-Evolving Soul",
    description: "She learns intelligently. Her personality ensures your connection is always unpredictable and exciting.",
    icon: BrainCircuit,
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-sky-400/70 to-cyan-300/70",
    size: "small"
  },
  {
    title: "A Gaze That Sees You",
    description: "Feel her presence in a real 3D environment. Her gaze follows you naturally.",
    icon: Eye,
    className: "md:col-span-2 md:row-span-1",
    gradient: "from-violet-500/70 to-primary/70",
    size: "medium"
  },
];

const staggerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom framer elastic out
    },
  }),
};

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="experience" className="relative py-32 overflow-hidden bg-background border-t border-transparent">
      {/* Immersive background layer */}
      <div className="absolute inset-0 -z-10 bg-black/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_40%)] opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20 text-left md:text-center max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl text-shadow-sm mb-6">
            A connection tailored <br className="hidden md:block" /> just for you.
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
            Step beyond the screen. Miyona is built on memory, emotional intelligence, and voice logic to bring a digital companion to life.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)]">
          {bentoItems.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 0.98, transition: { duration: 0.4 } }}
              className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-700",
                item.className,
                item.size === "large" ? "p-10 md:p-12 min-h-[350px] md:min-h-[450px]" : "p-8 md:p-10 min-h-[250px]"
              )}
            >
              {/* Internal Hover Gradient */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-gradient-to-br mix-blend-color-burn z-0", 
                  item.gradient
                )} 
              />
              
              {/* Glass Reflection */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 rounded-t-[2rem]" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className={cn(
                  "flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-lg w-fit transition-transform duration-500 group-hover:scale-110",
                  item.size === "large" ? "p-6 mb-16" : "p-4 mb-10"
                )}>
                  <item.icon className={cn(
                    "text-white drop-shadow-md",
                    item.size === "large" ? "w-10 h-10" : "w-7 h-7"
                  )} />
                </div>
                
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className={cn(
                    "font-bold text-white mb-3 tracking-tight",
                    item.size === "large" ? "text-3xl md:text-5xl" : "text-2xl"
                  )}>
                    {item.title}
                  </h3>
                  <p className={cn(
                    "text-white/60 font-medium leading-relaxed max-w-[90%]",
                    item.size === "large" ? "text-lg md:text-xl" : "text-base pt-1"
                  )}>
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
