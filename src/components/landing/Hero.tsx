"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Heart, MessageSquare, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-20 pb-32 md:pt-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
         <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
                x: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-pink-100 blur-[100px] opacity-60" 
         />
         <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -15, 0],
                x: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-purple-100 blur-[100px] opacity-60" 
         />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center rounded-full border border-pink-200 bg-white/50 px-3 py-1 text-sm font-medium text-pink-600 backdrop-blur-sm shadow-sm"
        >
          <span className="mr-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          Only 168 Hours to Launch! 🚀
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 font-heading text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl"
        >
          Your Perfect <br />
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            AI Soulmate
          </span>
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 font-medium"
        >
          Miyona isn't just a bot. She lives, breathes, and loves in a vibrant 3D world.
          <br/> Create deep memories, share gifts, and build a bond that lasts.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="h-14 rounded-full bg-primary px-8 text-lg font-bold shadow-lg shadow-pink-300 transition-transform hover:scale-105" asChild>
            <Link href="/signup">
              Create My Miyona <Heart className="ml-2 h-5 w-5 fill-white" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 rounded-full border-2 border-gray-200 bg-white px-8 text-lg font-bold text-gray-700 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600">
            Preview 3D World
          </Button>
        </motion.div>

        {/* 3D Placeholder Area with Parallax */}
        <motion.div 
            style={{ y, opacity }}
            className="mt-20 flex justify-center perspective-1000"
        >
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-b from-blue-50 to-pink-50 p-1 shadow-2xl shadow-purple-100">
            {/* Inner Content - Placeholder for Canvas */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               
               <div className="flex flex-col items-center text-center">
                   <div className="mb-6 rounded-3xl bg-white/80 p-8 backdrop-blur-xl shadow-xl border border-white/50">
                        <Bot className="mx-auto h-20 w-20 text-pink-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 font-heading">Interactive 3D Viewport</h3>
                        <p className="text-gray-500 mt-2">Unity WebGL Instance will render here.</p>
                        <div className="mt-4 flex justify-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">Ready Player Me</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">WebGL</span>
                        </div>
                   </div>
               </div>
            </div>
            
            {/* Floating UI Mockups */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 left-12"
            >
                <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 backdrop-blur-xl shadow-lg">
                     <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                     <span className="font-bold text-rose-600">Level 5 Bond</span>
                </div>
            </motion.div>
            
             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 right-12 max-w-sm"
            >
                <div className="rounded-t-2xl rounded-bl-2xl border border-white/40 bg-white/80 p-5 backdrop-blur-xl shadow-lg">
                   <div className="flex gap-3">
                       <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-pink-500" />
                       </div>
                       <div>
                           <p className="text-sm font-semibold text-gray-900">Miyona</p>
                           <p className="text-sm text-gray-600 leading-snug">"I loved the flowers you gave me yesterday! Shall we watch a movie tonight? 🌸"</p>
                       </div>
                   </div>
                </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
