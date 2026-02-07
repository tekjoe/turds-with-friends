"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const features = [
  { name: "Poop Map", description: "Pin every throne on an interactive map", icon: "map" },
  { name: "Advanced Analytics", description: "Monthly trends & time-of-day patterns", icon: "analytics" },
  { name: "Export Data", description: "Download your logs as CSV or PDF", icon: "download" },
  { name: "Friend Challenges", description: "Create & compete in custom challenges", icon: "emoji_events" },
  { name: "AI Insights", description: "Personalized digestive health tips", icon: "psychology" },
];

const plans = [
  {
    id: "monthly" as const,
    name: "Monthly",
    price: "$4.99",
    period: "/mo",
    note: "Cancel anytime",
  },
  {
    id: "annual" as const,
    name: "Annual",
    price: "$39.99",
    period: "/yr",
    note: "Save 33%",
    popular: true,
  },
];

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 lg:pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold mb-4">
            <Icon name="workspace_premium" className="text-lg" />
            PRO
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-4">
            Upgrade Your Throne
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg mx-auto">
            Unlock premium features to take your digestive tracking to the next level.
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-12">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  BEST VALUE
                </span>
              )}
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {plan.name}
              </p>
              <p className="text-3xl font-bold font-display">
                {plan.price}
                <span className="text-base font-normal text-slate-400">
                  {plan.period}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">{plan.note}</p>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
          <h2 className="text-xl font-bold font-display mb-6">
            Everything in Pro
          </h2>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon
                    name={feature.icon}
                    className="text-xl text-primary"
                  />
                </div>
                <div>
                  <p className="font-bold">{feature.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Icon name="workspace_premium" className="text-2xl" />
              Upgrade to Pro &mdash;{" "}
              {selectedPlan === "monthly" ? "$4.99/mo" : "$39.99/yr"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
