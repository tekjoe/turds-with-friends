"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

function validateUsername(value: string): string | null {
  if (value.length < MIN_LENGTH) {
    return `Must be at least ${MIN_LENGTH} characters`;
  }
  if (value.length > MAX_LENGTH) {
    return `Must be ${MAX_LENGTH} characters or fewer`;
  }
  if (!USERNAME_REGEX.test(value)) {
    return "Only letters, numbers, and underscores allowed";
  }
  return null;
}

export function OnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationError = username.length > 0 ? validateUsername(username) : null;
  const isValid = username.length >= MIN_LENGTH && !validationError;

  const checkAvailability = useCallback(
    async (value: string): Promise<boolean> => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", value)
        .maybeSingle();
      return !data;
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const localError = validateUsername(username);
    if (localError) {
      setError(localError);
      return;
    }

    setIsChecking(true);
    const available = await checkAvailability(username);
    setIsChecking(false);

    if (!available) {
      setError("This username is already taken");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: updateError, data: profileData } = await supabase
        .from("profiles")
        .upsert({ id: user.id, username })
        .select()
        .single();

      console.log("Onboarding profile update:", { success: !updateError, profileData, error: updateError });

      if (updateError) throw updateError;

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isChecking || isSubmitting;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="waving_hand" className="text-3xl text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-center">
            Choose Your Username
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
            Pick a unique username for your profile. You can change it later in settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                maxLength={MAX_LENGTH}
                className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="e.g. StoolKing42"
                autoFocus
              />
              {isValid && !error && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Icon name="check_circle" className="text-primary" />
                </span>
              )}
            </div>
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isBusy}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            {isBusy ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>

      {/* Pro Plan Promo */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
              <Icon name="workspace_premium" className="text-xl" />
            </div>
            <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">
              Go Pro & Track Like a Legend
            </h3>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              "Unlock advanced analytics & charts",
              "See the global poop map",
              "Join exclusive challenges",
              "Custom themes & app icons"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200/80">
                <Icon name="check" className="text-amber-500" />
                {item}
              </li>
            ))}
          </ul>

          <a 
            href="/upgrade" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-center rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            View Pro Plans
          </a>
        </div>
      </div>
    </div>
  );
}
