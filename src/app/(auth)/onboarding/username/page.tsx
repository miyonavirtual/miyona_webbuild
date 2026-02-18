"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { error } = await supabase
            .from('profiles')
            .upsert({ 
                id: user.id, 
                username: username,
                updated_at: new Date().toISOString()
            });

        if (!error) {
            router.push('/dashboard');
        } else {
             // Handle duplicate username error or others
             console.error(error);
             setLoading(false);
        }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md space-y-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-lg shadow-pink-200">
            <Sparkles className="h-8 w-8" />
        </div>
        
        <h1 className="font-heading text-4xl font-bold text-gray-900">
          What should I call you?
        </h1>
        <p className="text-lg text-gray-600">
          Miyona wants to know your name so she can address you properly.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <Input
              type="text"
              required
              placeholder="Your Name (e.g. Phoenix)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14 rounded-xl border-gray-200 bg-white px-6 text-lg shadow-sm transition-all focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !username}
            className="h-14 w-full rounded-xl bg-pink-500 text-lg font-bold text-white shadow-lg shadow-pink-200 hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : (
                <span className="flex items-center justify-center gap-2">
                    Enter World <ArrowRight className="h-5 w-5" />
                </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
