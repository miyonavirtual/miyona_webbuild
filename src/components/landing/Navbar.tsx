"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        {/* Logo Area */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 group flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <Heart className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <span className="font-heading text-2xl font-light tracking-[0.15em] text-foreground uppercase">
            Luvoia
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden gap-12 lg:flex">
          <Link 
             href="/pricing" 
             className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-primary hover:tracking-[0.25em]"
           >
             Membership
           </Link>
           <Link 
             href="/#experience" 
             className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-primary hover:tracking-[0.25em]"
           >
             Experience
           </Link>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-8 ml-auto">
          <Link href="/login" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary sm:block">
            Sign In
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
