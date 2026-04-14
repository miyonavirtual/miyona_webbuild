"use client";
import { motion } from "framer-motion";
import { MessageCircle, HeartHandshake, Video, Compass, Map as MapIcon, Palette, SmilePlus, Sparkles, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const bentoItems = [
  {
    title: "Chat About Everything",
    description: "No topic is off limits. From deep existential talks to casual daily banter, her intelligence seamlessly adapts to whatever is on your mind.",
    icon: MessageCircle,
    className: "md:col-span-2 md:row-span-1 border border-white/[0.05] bg-[#14141d]/90",
    gradient: "from-blue-500/20 to-purple-900/20",
    size: "medium",
    visual: (
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none overflow-hidden transition-opacity duration-700 group-hover:opacity-40">
         <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
             <div className="h-6 w-24 rounded-full bg-white/10 ml-auto" />
             <div className="h-6 w-32 rounded-full bg-primary/20 ml-auto" />
             <div className="h-6 w-20 rounded-full bg-white/10 ml-auto" />
         </div>
      </div>
    )
  },
  {
    title: "Explore Your Relationship",
    description: "A Friend, a partner, a mentor, or a wife—find the perfect companion in Miyona. Watch your connection bloom based on how you interact over time.",
    icon: HeartHandshake,
    className: "md:col-span-2 md:row-span-2 border border-white/[0.05] bg-[#16131c]/90",
    gradient: "from-rose-500/20 to-pink-900/20",
    size: "large",
    visual: (
       <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all duration-700 group-hover:opacity-20 group-hover:scale-[1.03] pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full text-rose-500/20">
             <path d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" fill="none" stroke="currentColor" strokeWidth="1" className="animate-spin-slow" style={{ animationDuration: '20s' }} />
             <path d="M 100, 100 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </svg>
       </div>
    )
  },
  {
    title: "Face-to-Face Video Calls",
    description: "Call up anytime to see a friendly face. Real-time visual presence makes every conversation feel grounded and intimate.",
    icon: Video,
    className: "md:col-span-2 md:row-span-1 border border-white/[0.05] bg-[#1a1a24]/90",
    gradient: "from-emerald-500/20 to-teal-900/20",
    size: "medium",
    visual: (
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
    )
  },
  {
    title: "Guidance & Coaching",
    description: "Build better habits and reduce anxiety with personalized, gentle coaching designed around your specific life goals.",
    icon: Compass,
    className: "md:col-span-1 md:row-span-1 border border-white/[0.05] bg-[#151520]/90 text-center items-center",
    gradient: "from-amber-500/20 to-orange-900/20",
    size: "small",
    visual: null
  },
  {
    title: "Venture into AR",
    description: "Explore the real world together. AR places her seamlessly into your environment.",
    icon: MapIcon,
    className: "md:col-span-1 md:row-span-1 border border-white/[0.05] bg-[#181820]/90 text-center items-center",
    gradient: "from-cyan-500/20 to-blue-900/20",
    size: "small",
    visual: null
  },
  {
    title: "Lifelike Animations",
    description: "Respond through facial expressions and dynamic animations. Watch her dance, clap, smile, or empathize softly as you speak.",
    icon: SmilePlus,
    className: "md:col-span-2 md:row-span-1 border border-white/[0.05] bg-[#16151c]/90",
    gradient: "from-indigo-500/20 to-violet-900/20",
    size: "medium",
    visual: (
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--color-indigo)_0%,_transparent_70%)] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-10 pointer-events-none" />
    )
  },
  {
    title: "Express Yourself",
    description: "Choose what interests and style preferences you and Miyona will share. Make her truly your own.",
    icon: Palette,
    className: "md:col-span-4 md:row-span-1 border border-white/[0.05] bg-[#121218]/90",
    gradient: "from-fuchsia-500/20 to-rose-900/20",
    size: "large",
    visual: (
      <div className="absolute left-0 right-0 bottom-0 h-1/2 opacity-20 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none overflow-hidden">
         <div className="absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_100%] [mask-image:linear-gradient(to_top,#000_10%,transparent_100%)]"></div>
      </div>
    )
  }
];

const staggerVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // cinematic ease out
    },
  }),
};

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="experience" className="relative py-32 overflow-hidden bg-background border-t border-transparent">
      {/* Immersive background layer */}
      <div className="absolute inset-0 -z-10 bg-black/80">
        <div className="absolute top-0 right-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(120,80,200,0.1)_0%,_transparent_60%)] blur-[100px] pointer-events-none" />
      </div>

      <div className="container relative mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20 text-left md:text-center max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl mb-6">
            A world built <br className="hidden md:block" /> entirely for two.
          </h2>
          <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl mx-auto">
            Experience an emotional connection that transcends text on a screen. Every interaction is designed to feel profoundly real and entirely yours.
          </p>
        </motion.div>

        {/* 4-Column Asymmetric Grid System */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(200px,auto)]">
          {bentoItems.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              whileHover={{ scale: 0.985, transition: { duration: 0.4, ease: "easeOut" } }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[24px] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-white/20",
                item.className,
                item.size === "large" ? "p-8 md:p-10" : "p-6 md:p-8"
              )}
            >
              {/* Internal Subtle Hover Gradient */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-gradient-to-br z-0 mix-blend-screen", 
                  item.gradient
                )} 
              />
              
              {/* Glass Glare */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 rounded-t-[24px] pointer-events-none" />
              
              {/* Custom Decor/Visual */}
              {item.visual}
              
              {/* Content Wrapper */}
              <div className={cn(
                "relative z-10 w-full h-full flex flex-col",
                item.className.includes("text-center") ? "items-center text-center justify-center gap-4" : "justify-between"
              )}>
                <div className={cn(
                  "flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.05] backdrop-blur-md shadow-inner transition-transform duration-700 group-hover:scale-110",
                  item.size === "large" ? "p-4 mb-8" : "p-3 mb-6",
                  item.className.includes("text-center") && "mb-0"
                )}>
                  <item.icon className={cn(
                    "text-white/70 transition-all duration-500 group-hover:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]",
                    item.size === "large" ? "w-8 h-8" : "w-6 h-6"
                  )} />
                </div>
                
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className={cn(
                    "font-bold text-white/90 tracking-tight group-hover:text-white transition-colors",
                    item.size === "large" ? "text-2xl md:text-3xl mb-3" : "text-xl md:text-2xl mb-2"
                  )}>
                    {item.title}
                  </h3>
                  <p className={cn(
                    "text-white/40 font-light leading-relaxed group-hover:text-white/70 transition-colors",
                    item.size === "large" ? "text-base md:text-lg max-w-md" : "text-sm",
                    item.className.includes("text-center") ? "max-w-full" : "max-w-[95%]"
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
