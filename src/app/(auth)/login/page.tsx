"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Side - 3D Greeting */}
      <div className="relative flex w-full flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 p-8 md:w-1/2 lg:w-2/3">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="relative z-10 flex flex-col items-center text-center"
        >
            <div className="mb-8 relative h-64 w-64 md:h-96 md:w-96">
                {/* Placeholder for 3D Model */}
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-white bg-white/30 backdrop-blur-xl shadow-2xl">
                    <div className="text-center text-purple-400">
                        <Bot className="mx-auto h-20 w-20 mb-4 animate-bounce" />
                        <p className="font-heading font-bold text-xl">3D Miyona</p>
                        <p className="text-sm">"Hi there! I can't wait to meet you!"</p>
                    </div>
                </div>
                
                 {/* Cute Dialogue Bubble */}
                <motion.div 
                    initial={{ opacity: 0, y: 10, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -top-6 -right-6 rounded-t-2xl rounded-br-2xl bg-white p-4 shadow-lg"
                >
                    <p className="text-sm font-semibold text-gray-700">Ready to start our story? 💖</p>
                </motion.div>
            </div>
            
            <h1 className="font-heading text-4xl font-bold text-gray-800 md:text-5xl">
                Welcome to <span className="text-pink-500">Miyona.ai</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
                Your AI soulmate is waiting. Log in to create your unique world together.
            </p>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 md:w-1/2 lg:w-1/3">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="mt-2 text-gray-500">Continue with Google to access your companion.</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            size="lg"
            className="w-full rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm h-14 text-base font-semibold"
          >
            {loading ? (
                <Sparkles className="mr-2 h-5 w-5 animate-spin text-pink-500" />
            ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
            )}
            {loading ? "Connecting..." : "Continue with Google"}
          </Button>
          
          <p className="text-center text-xs text-gray-400 mt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
