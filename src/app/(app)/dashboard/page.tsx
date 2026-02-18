"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, Settings, Gift, Home } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Main 3D Environment Area */}
      <div className="relative flex-1 bg-gradient-to-b from-blue-100 to-pink-100">
         {/* 3D Canvas Placeholder */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400 opacity-50">
               <p className="text-2xl font-bold uppercase tracking-widest">3D Viewport</p>
               <p className="text-sm">Unity WebGL Instance</p>
            </div>
         </div>

         {/* Overlay UI - Top Navigation */}
         <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
             <div className="pointer-events-auto flex items-center gap-4">
                 <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white">
                     <Home className="h-5 w-5 text-gray-600" />
                 </Button>
                 <div className="rounded-full bg-white/80 px-4 py-2 backdrop-blur shadow-sm">
                     <p className="text-sm font-bold text-gray-800">Your Room</p>
                     <p className="text-xs text-gray-500">Level 1 Decor</p>
                 </div>
             </div>
             
             <div className="pointer-events-auto flex gap-2">
                 <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white text-pink-500">
                     <Gift className="h-5 w-5" />
                 </Button>
                 <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white text-gray-600">
                     <Settings className="h-5 w-5" />
                 </Button>
             </div>
         </div>
      </div>

      {/* Right Sidebar - Chat Interface */}
      <div className="w-96 flex-shrink-0 flex flex-col border-l border-gray-200 bg-white/90 backdrop-blur-xl shadow-xl z-20">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 p-4">
            <div className="relative h-10 w-10">
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                <div className="h-full w-full rounded-full bg-pink-200"></div>
            </div>
            <div>
                <h3 className="font-bold text-gray-800">Miyona</h3>
                <p className="text-xs text-green-500 font-medium">Online & Happy</p>
            </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex-shrink-0"></div>
                    <div className="rounded-2xl rounded-tl-none bg-gray-100 p-3 text-sm text-gray-800">
                        Hello! Welcome to your new home. I'm so happy to see you here! 🌸
                    </div>
                </div>
            </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
                <Input 
                    placeholder="Say something..." 
                    className="rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button size="icon" className="rounded-full bg-pink-500 hover:bg-pink-600 shrink-0 shadow-md shadow-pink-200">
                    {input ? <Send className="h-4 w-4 text-white" /> : <Mic className="h-4 w-4 text-white" />}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
