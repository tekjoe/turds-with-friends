"use client";

import { useState } from "react";
import Link from "next/link";
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

      <div className="relative z-10 flex h-full grow flex-col">
        {/* Header */}
        <div className="px-4 md:px-40 flex justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#22C55E]/10 px-4 md:px-10 py-3">
              <Link href="/" className="flex items-center gap-4 text-[#0d1b12] dark:text-white">
                <div className="size-8 text-[#22C55E]">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_543)">
                      <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
                      <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd" />
                    </g>
                    <defs>
                      <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48" /></clipPath>
                    </defs>
                  </svg>
                </div>
                <h2 className="text-[#0d1b12] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  Turds with Friends
                </h2>
              </Link>
              <button 
                onClick={handleGoogleSignIn}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#22C55E] text-[#0d1b12] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#22C55E]/90 transition-colors"
              >
                <span className="truncate">Join the Movement</span>
              </button>
            </header>
          </div>
        </div>

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
          © {new Date().getFullYear()} Turds with Friends. All Rights Reserved. Potty on!
        </footer>
      </div>
    </div>
  );
}
