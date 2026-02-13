"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

interface InviteCardProps {
  className?: string;
}

export function InviteCard({ className = "" }: InviteCardProps) {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((res) => res.json())
      .then((data) => {
        setInviteCode(data.inviteCode);
        setReferralCount(data.referralCount || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bowelbuddies.app";
  const inviteLink = inviteCode ? `${appUrl}/?ref=${inviteCode}` : "";

  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!inviteLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Bowel Buddies!",
          text: "Track your gut health and compete with friends. We both get 100 bonus XP!",
          url: inviteLink,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    );
  }

  // Milestones for the progress bar
  const milestones = [3, 5, 10];
  const nextMilestone = milestones.find((m) => referralCount < m) || milestones[milestones.length - 1];
  const progressPercent = Math.min((referralCount / nextMilestone) * 100, 100);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="group_add" className="text-2xl" />
          <h3 className="text-lg font-bold">Invite Friends, Earn XP</h3>
        </div>
        <p className="text-sm text-white/80">
          Share your invite code. You both get <strong>100 XP</strong> when they sign up!
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Invite code display */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
            Your Invite Code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono font-bold text-lg tracking-widest text-center text-slate-800 dark:text-slate-100">
              {inviteCode || "---"}
            </div>
            <button
              onClick={handleCopy}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy invite link"
            >
              <Icon
                name={copied ? "check" : "content_copy"}
                className={`text-xl ${copied ? "text-green-500" : "text-slate-500"}`}
              />
            </button>
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <Icon name="share" className="text-xl" />
          Share Invite Link
        </button>

        {/* Referral progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-100">{referralCount}</strong> friends invited
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {referralCount < nextMilestone
                ? `${nextMilestone - referralCount} more for next reward`
                : "Keep going!"}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-primary to-primary-light h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
