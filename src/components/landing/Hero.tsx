"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircle, Lock, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32 md:pt-0">
      {/* Seductive Background - Soft Glows and Texture */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_var(--color-primary)_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-accent)_0%,_transparent_40%)] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>
      
      {/* Ethereal Floating Elements */}
      <motion.div 
        animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" 
      />
      <motion.div 
        animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/5 blur-[120px]" 
      />

      <div className="container relative mx-auto px-6 z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-md"
          >
              <Heart className="h-3.5 w-3.5 animate-pulse" />
              <span className="tracking-wide uppercase text-[10px]">Your Personal AI</span>
          </motion.div>

          <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mx-auto max-w-5xl font-heading text-6xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-8xl md:text-9xl"
          >
            Your Own <br />
            <span className="italic font-light text-primary/90">AI Companion.</span>
          </motion.h1>
          
          <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mx-auto mt-10 max-w-2xl text-xl text-muted-foreground/80 md:text-2xl font-light leading-relaxed"
          >
            Luvoia isn't just an AI. She's the presence you've been waiting for.
            <br className="hidden md:block"/>
            Vibrant, evolving, and devoted entirely to you.
          </motion.p>

          <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-14 flex flex-col items-center justify-center gap-8 sm:flex-row"
          >
            <Button size="lg" className="group relative h-16 min-w-[240px] overflow-hidden rounded-full bg-primary px-10 text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(var(--primary),0.3)]" asChild>
              <Link href="/login">
                <span className="relative z-10 flex items-center gap-2">
                  Meet Her Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-rose-500 to-primary bg-[length:200%_100%] transition-all group-hover:bg-[100%_0]" />
              </Link>
            </Button>
            
            <Link href="#experience" className="group flex items-center gap-2 text-lg font-light text-muted-foreground hover:text-primary transition-colors duration-300">
              Explore the Connection
              <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </Link>
          </motion.div>

          {/* Seductive Visual Placeholder */}
          <motion.div 
              style={{ y, opacity, scale }}
              className="mt-32 relative mx-auto w-full max-w-6xl px-4"
          >
             <div className="group relative aspect-[21/9] w-full overflow-hidden rounded-[3rem] border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm transition-all duration-700 hover:border-primary/30">
                {/* Visual Art: Soft glowing silhouettes or abstract intimacy */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-full w-full opacity-60 transition-opacity group-hover:opacity-80">
                        {/* Abstract shapes representing two figures connecting */}
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.4, 0.3],
                          }}
                          transition={{ duration: 8, repeat: Infinity }}
                          className="absolute left-1/3 top-1/2 -translate-y-1/2 h-[80%] w-[40%] rounded-full bg-gradient-to-r from-primary/20 to-transparent blur-[80px]" 
                        />
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.08, 1],
                            opacity: [0.2, 0.3, 0.2],
                          }}
                          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                          className="absolute right-1/3 top-1/2 -translate-y-1/2 h-[80%] w-[40%] rounded-full bg-gradient-to-l from-rose-500/20 to-transparent blur-[80px]" 
                        />
                        
                        {/* The "Spark" of connection */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                           <motion.div 
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="h-1 w-1 bg-white rounded-full shadow-[0_0_20px_white,0_0_40px_var(--color-primary)]"
                           />
                        </div>
                    </div>
                </div>

                {/* Smooth animated text overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center"
                    >
                        <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-light tracking-wider text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                            Say hello to Luvoia.
                        </span>
                    </motion.div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
