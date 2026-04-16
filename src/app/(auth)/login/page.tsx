"use client";

import { Button } from "@/components/ui/button";
import { Heart, Sparkles, AlertCircle, Lock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Successfully logged in!
        router.push("/chat"); // or wherever
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background font-sans text-foreground">
      {/* Left Side - Seductive Atmosphere */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden p-12 md:w-1/2 lg:w-2/3">
        {/* Background Atmospheric Glows */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--color-primary)_0%,_transparent_40%)] opacity-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_var(--color-accent)_0%,_transparent_40%)] opacity-10" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className="mb-12 relative h-64 w-64 md:h-80 md:w-80">
            {/* Visual Representation of Intimacy */}
            <div className="absolute inset-0 flex items-center justify-center rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="relative text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Heart className="h-24 w-24 text-primary blur-xl" />
                </motion.div>
                <Heart className="relative h-16 w-16 text-primary animate-pulse" />
                <p className="mt-6 font-heading text-2xl font-light tracking-[0.2em] uppercase text-white/40">Luvoia</p>
              </div>
            </div>

            {/* Subtle Call to Connection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-4 inset-x-0"
            >
              <span className="font-heading text-lg italic text-white/60">"Your sanctuary is ready."</span>
            </motion.div>
          </div>

          <h1 className="font-heading text-5xl font-light tracking-tight text-white md:text-7xl leading-tight">
            Return to <br />
            <span className="italic text-primary/90">Her.</span>
          </h1>
          <p className="mt-8 text-xl text-muted-foreground/60 max-w-md font-light leading-relaxed">
            Step back into a world where you are heard, understood, and truly seen.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center border-l border-white/5 bg-black/40 backdrop-blur-3xl p-12 md:w-1/2 lg:w-1/3">
        <div className="w-full max-w-sm space-y-12">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-4xl font-light text-white tracking-tight">Sign In</h2>
            <p className="mt-4 text-sm font-light text-muted-foreground/60 tracking-wide uppercase">Unlock your private sanctuary</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-3"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <Button
              onClick={handleLogin}
              disabled={loading}
              size="lg"
              className="group relative w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 h-16 text-sm font-bold tracking-[0.2em] uppercase"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <Sparkles className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="currentColor"
                      className="text-white/80"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="currentColor"
                      className="text-white/40"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="currentColor"
                      className="text-white/20"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="currentColor"
                      className="text-white/60"
                    />
                  </svg>
                )}
                {loading ? "Opening Door..." : "Enter with Google"}
              </div>
            </Button>
          </div>

          <div className="flex flex-col items-center gap-6 pt-12">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground/30 font-bold">
              <Lock className="h-3 w-3" /> Secure & Private
            </div>
            <p className="text-center text-[10px] leading-relaxed tracking-widest uppercase text-muted-foreground/40 max-w-[200px]">
              By entering, you accept our <Link href="#" className="text-primary hover:text-primary/80">Privacy Policy</Link> and <Link href="#" className="text-primary hover:text-primary/80">Terms</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Link component since next/link might be needed
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
