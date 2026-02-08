"use client";

import { useState } from "react";
import { signInWithOAuth } from "@/lib/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithOAuth("google");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="font-display bg-[#FDFBF7] dark:bg-[#1A1614] min-h-screen relative flex flex-col">
      {/* Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(#22C55E 0.5px, transparent 0.5px), radial-gradient(#22C55E 0.5px, #FDFBF7 0.5px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />

      <div className="relative z-10 flex h-full grow flex-col pt-20">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-[420px] flex flex-col items-center">
            {/* Login Card */}
            <div className="w-full bg-white dark:bg-[#1A1614] border border-[#cfe7d7] dark:border-[#22C55E]/20 rounded-2xl shadow-xl p-10 flex flex-col gap-10">
              <div className="flex flex-col items-center">
                {/* Toilet Icon */}
                <div className="size-28 bg-[#22C55E]/20 rounded-full flex items-center justify-center mb-6 overflow-hidden border-2 border-[#22C55E] shadow-sm">
                  <svg className="size-16 text-[#22C55E]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V8C17 8.55228 16.5523 9 16 9H8C7.44772 9 7 8.55228 7 8V3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d="M17 13C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13V9H17V13Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d="M8 18V20C8 21.1046 8.89543 22 10 22H14C15.1046 22 16 21.1046 16 20V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d="M12 11V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <circle cx="9" cy="5.5" fill="currentColor" r="0.75" />
                  </svg>
                </div>
                <h1 className="text-[#0d1b12] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center">
                  Welcome Back to the Bowl!
                </h1>
                <p className="text-[#4c9a66] dark:text-[#a0c4ae] text-base mt-2 text-center">
                  Ready to log your latest masterpiece?
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-[#cfe7d7] dark:border-[#22C55E]/30 h-16 bg-white dark:bg-[#1a2e21] text-[#0d1b12] dark:text-white text-lg font-bold hover:bg-[#FDFBF7] dark:hover:bg-[#233a2a] hover:border-[#22C55E]/50 transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-[#22C55E] rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Sign in with Google
                </button>

                <p className="text-center text-[#4c9a66] dark:text-[#a0c4ae] text-sm font-medium">
                  New to the bowl?
                  <button 
                    onClick={handleGoogleSignIn}
                    className="text-[#22C55E] font-bold hover:underline ml-1"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-12 text-center px-6">
              <p className="text-xs text-[#4c9a66] dark:text-[#a0c4ae] leading-relaxed italic opacity-80">
                &quot;Your health is in the hands of your... hands.&quot; <br />
                Based on the Bristol Stool Scale. Stay healthy, track daily.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-10 border-t border-[#22C55E]/10 flex justify-center items-center text-[#4c9a66] dark:text-[#a0c4ae] text-xs">
          © {new Date().getFullYear()} Bowel Buddies. All Rights Reserved. Potty on!
        </footer>
      </div>
    </div>
  );
}
