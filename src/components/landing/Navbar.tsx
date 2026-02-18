"use strict";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Area */}
        <Link href="/" className="group flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 absolute" />
          </div>
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Miyona.ai
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden gap-8 md:flex">
          {["Features", "Pricing", "About"].map((item) => (
             <Link 
               key={item} 
               href={`#${item.toLowerCase()}`} 
               className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary relative group"
             >
               {item}
               <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary/50 transition-all group-hover:w-full rounded-full" />
             </Link>
          ))}
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-primary hover:bg-pink-50" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" className="rounded-full bg-gradient-to-r from-pink-400 to-rose-400 px-6 font-bold text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all" asChild>
            <Link href="/signup">
              Get Started <Heart className="ml-2 h-3 w-3 fill-white" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
