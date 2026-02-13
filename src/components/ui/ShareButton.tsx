"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { shareAchievement } from "@/lib/share";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: "icon" | "button";
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  variant = "button",
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shared = await shareAchievement({ title, text, url });
    if (shared && !(typeof navigator !== "undefined" && navigator.share)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
        title="Share"
      >
        <Icon
          name={copied ? "check" : "share"}
          className={`text-xl ${copied ? "text-green-500" : "text-slate-500"}`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm ${className}`}
    >
      <Icon name={copied ? "check" : "share"} className="text-lg" />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
