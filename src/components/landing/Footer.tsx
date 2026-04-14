"use client";
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-6 md:items-start">
              <Link href="/" className="font-heading text-3xl font-light tracking-widest text-foreground uppercase">
                  Miyona
              </Link>
              <p className="text-center text-sm font-light leading-relaxed text-muted-foreground/60 md:text-left max-w-xs">
                  Where intimacy meets technology, and technology fades into the background.
              </p>
          </div>
          
          <div className="grid grid-cols-2 gap-16 sm:grid-cols-3">
              <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Discover</span>
                  <Link href="/pricing" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">Membership</Link>
                  <Link href="#experience" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">Experience</Link>
              </div>
              <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Legals</span>
                  <Link href="#" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">Privacy</Link>
                  <Link href="#" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">Terms</Link>
              </div>
              <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Social</span>
                  <Link href="#" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">Twitter</Link>
                  <Link href="#" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">Discord</Link>
              </div>
          </div>
        </div>
        
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40">
              © 2026 Miyona.ai. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground/40">
              Crafted for Connection <Heart className="h-2.5 w-2.5 fill-primary/20 text-primary/40" />
            </p>
        </div>
      </div>
    </footer>
  );
}
