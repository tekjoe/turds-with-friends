"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface RedeemCodeProps {
  initialCode?: string;
  className?: string;
}

export function RedeemCode({ initialCode = "", className = "" }: RedeemCodeProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleRedeem = async () => {
    if (!code.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/referrals/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Referral redeemed! You earned 100 XP!");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to redeem code");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center ${className}`}>
        <Icon name="celebration" className="text-4xl text-green-500 mb-2" />
        <p className="font-bold text-green-700 dark:text-green-300">{message}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 ${className}`}>
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
        Have an invite code?
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Enter a friend&apos;s code and you&apos;ll both get 100 XP!
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          maxLength={8}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans text-slate-800 dark:text-slate-100"
        />
        <button
          onClick={handleRedeem}
          disabled={!code.trim() || status === "loading"}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "..." : "Redeem"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500 mt-2">{message}</p>
      )}
    </div>
  );
}
