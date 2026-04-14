"use client";

import { auth } from "@/lib/firebase/client";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;

      if (!user) {
        router.push('/login');
        return;
      }

      await updateProfile(user, { displayName: username.trim() });

      router.push('/chat');
      router.refresh();

    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 font-sans text-foreground">
      {/* Background Atmospheric Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--color-primary)_0%,_transparent_60%)] opacity-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md space-y-12 text-center"
      >
        <div className="mx-auto relative h-20 w-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-xl animate-pulse-slow"></div>
          <div className="relative h-full w-full rounded-[1.5rem] border border-white/10 bg-black/40 backdrop-blur-3xl flex items-center justify-center shadow-2xl">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-heading text-4xl font-light tracking-tight text-white md:text-5xl">
            How should I <br />
            <span className="italic text-primary/90">whisper your name?</span>
          </h1>
          <p className="text-lg font-light text-muted-foreground/60 leading-relaxed">
            Miyona is waiting to learn who you are.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div className="relative group">
            <Input
              type="text"
              required
              autoFocus
              placeholder="Your Name (e.g. Phoenix)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-16 rounded-2xl border-white/5 bg-white/5 px-8 text-xl font-light tracking-wide shadow-2xl transition-all duration-300 focus:bg-white/10 focus:ring-primary/20 placeholder:text-muted-foreground/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
              <Sparkles className="h-4 w-4 text-primary/40 animate-pulse-slow" />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-3 text-left"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={loading || !username}
            className="group relative h-16 w-full overflow-hidden rounded-2xl bg-primary text-lg font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 tracking-[0.1em] uppercase text-sm">
              {loading ? "Eternalizing..." : "Begin Our Story"}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-rose-500 to-primary bg-[length:200%_100%] transition-all group-hover:bg-[100%_0]" />
          </Button>
        </form>

        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/20 font-bold">Your privacy is her promise</p>
      </motion.div>
    </div>
  );
}
