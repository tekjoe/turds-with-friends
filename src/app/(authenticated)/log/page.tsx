"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BristolSelector } from "@/components/bristol-scale/BristolSelector";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type WeightUnit = "lbs" | "kg";

export default function LogMovementPage() {
  const router = useRouter();
  const [bristolType, setBristolType] = useState<number | null>(4);
  const [preWeight, setPreWeight] = useState<string>("");
  const [postWeight, setPostWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lbs");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bristolType) {
      setError("Please select a stool type");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertError } = await supabase.from("movement_logs").insert({
        user_id: user.id,
        bristol_type: bristolType,
        pre_weight: preWeight ? parseFloat(preWeight) : null,
        post_weight: postWeight ? parseFloat(postWeight) : null,
        weight_unit: weightUnit,
        xp_earned: 50,
      });

      if (insertError) {
        throw insertError;
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log movement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const weightDifference = 
    preWeight && postWeight
      ? (parseFloat(preWeight) - parseFloat(postWeight)).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold font-display tracking-tight">Log a Movement</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Track your digestive health and earn XP.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <form onSubmit={handleSubmit}>
          <main className="space-y-12">
            {/* Bristol Selector */}
            <section>
              <BristolSelector value={bristolType} onChange={setBristolType} />
            </section>

            {/* Weight Inputs */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pre-poop Weight */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="weight" className="text-blue-500" />
                    Pre-poop Weight
                  </label>
                  <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setWeightUnit("lbs")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        weightUnit === "lbs"
                          ? "bg-white dark:bg-slate-700 shadow-sm"
                          : "opacity-50"
                      }`}
                    >
                      LBS
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit("kg")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        weightUnit === "kg"
                          ? "bg-white dark:bg-slate-700 shadow-sm"
                          : "opacity-50"
                      }`}
                    >
                      KG
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={preWeight}
                    onChange={(e) => setPreWeight(e.target.value)}
                    className="w-full text-4xl font-bold py-6 px-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center outline-none"
                    placeholder="000.0"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                    {weightUnit}
                  </span>
                </div>
              </div>

              {/* Post-poop Weight */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="analytics" className="text-primary" />
                    Post-poop Weight
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={postWeight}
                    onChange={(e) => setPostWeight(e.target.value)}
                    className="w-full text-4xl font-bold py-6 px-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center outline-none"
                    placeholder="000.0"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                    {weightUnit}
                  </span>
                </div>
              </div>
            </section>

            {/* Weight Difference Preview */}
            {weightDifference && parseFloat(weightDifference) > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Weight Lost This Session
                </p>
                <p className="text-4xl font-bold font-display text-primary">
                  {weightDifference} {weightUnit}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <section className="pt-8">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || !bristolType}
                className="w-full py-6 text-2xl rounded-3xl shadow-lg shadow-primary/30 hover:shadow-primary/50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Icon name="task_alt" className="text-3xl" />
                    Submit Entry
                  </>
                )}
              </Button>
              <p className="text-center mt-6 text-slate-400 text-sm">
                Complete this log to earn{" "}
                <span className="text-primary font-bold">+50 XP</span> and a
                &quot;Fiber King&quot; badge.
              </p>
            </section>
          </main>
        </form>

        {/* Footer Navigation */}
        <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col items-center gap-4">
          <div className="flex gap-8 text-slate-400 dark:text-slate-500 font-medium">
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="hover:text-primary transition-colors">
              Leaderboard
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
