"use strict";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white/80 py-12 backdrop-blur-xl">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-500">
                <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-heading font-bold text-gray-900">Miyona.ai</span>
        </div>
        
        <p className="flex items-center gap-1 text-sm text-gray-500 text-center md:text-left">
          Made with <Heart className="h-3 w-3 fill-rose-400 text-rose-400" /> by AlgoPhoenyx
        </p>
        
        <div className="flex gap-6">
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-pink-500 transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-pink-500 transition-colors">Terms</Link>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-pink-500 transition-colors">Twitter</Link>
        </div>
      </div>
    </footer>
  );
}
