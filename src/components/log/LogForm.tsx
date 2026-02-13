"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BristolSelector } from "@/components/bristol-scale/BristolSelector";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

type WeightUnit = "lbs" | "kg";

interface LogFormProps {
  isPremium: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LogForm({ isPremium: _isPremium }: LogFormProps) {
  const router = useRouter();
  const [bristolType, setBristolType] = useState<number | null>(4);
  const [preWeight, setPreWeight] = useState<string>("");
  const [postWeight, setPostWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lbs");
  const [trackLocation, setTrackLocation] = useState(false);
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
      // Create movement log via API
      const response = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bristol_type: bristolType,
          pre_weight: preWeight,
          post_weight: postWeight,
          weight_unit: weightUnit,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create log");
      }

      const { data: logData } = await response.json();

      // Save location if tracking enabled
      if (trackLocation && logData) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
              })
          );

          await fetch("/api/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              movement_log_id: logData.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
        } catch {
          // Location capture failed silently - don't block the log
        }
      }

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
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Log a Movement
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Track your digestive health and earn XP.
          </p>
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
                    min="0"
                    value={preWeight}
                    onChange={(e) => setPreWeight(e.target.value)}
                    className="w-full text-4xl font-bold py-6 px-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
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
                    min="0"
                    value={postWeight}
                    onChange={(e) => setPostWeight(e.target.value)}
                    className="w-full text-4xl font-bold py-6 px-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                    placeholder="000.0"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                    {weightUnit}
                  </span>
                </div>
              </div>
            </section>

            {/* Location Toggle */}
            <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Icon
                      name="location_on"
                      className="text-xl text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  <div>
                    <p className="font-bold flex items-center gap-2">
                      Track Location <PremiumBadge />
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Pin this throne on your Poop Map
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackLocation(!trackLocation)}
                  className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                    trackLocation
                      ? "bg-amber-500"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      trackLocation ? "translate-x-5" : ""
                    }`}
                  />
                </button>
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
            <Link
              href="/dashboard"
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-primary transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
