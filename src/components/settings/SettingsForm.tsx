"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import { Sidebar } from "@/components/ui/Sidebar";

interface PrivacySettings {
  show_weight?: boolean;
  show_logs_to_friends?: boolean;
  show_on_leaderboard?: boolean;
  share_poop_locations?: boolean;
}

interface SettingsFormProps {
  profile: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    xp_total: number;
    privacy_settings: PrivacySettings | null;
  };
  email: string;
  isPremium?: boolean;
}


function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border border-slate-300 shadow-sm transition-transform mt-0.5 ${
          checked ? "translate-x-7 ml-0.5" : "translate-x-0 ml-1"
        }`}
      />
    </button>
  );
}

function getLevelInfo(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const titles = [
    "Stool Novice",
    "Stool Apprentice",
    "Bristol Trainee",
    "Bristol Adept",
    "Bristol Expert",
    "Bristol Master",
    "Throne Guardian",
    "Throne Champion",
    "Gut Sage",
    "Legendary Dumper",
  ];
  const title = titles[Math.min(level - 1, titles.length - 1)];
  return { level, title };
}

export function SettingsForm({ profile, email, isPremium = false }: SettingsFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username ?? "");
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    friendRequests: true,
    leaderboardUpdates: false,
    weeklySummary: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { level, title } = getLevelInfo(profile.xp_total);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: username || null,
          display_name: displayName || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Settings saved successfully!" });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to delete account");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete account",
      });
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-0 min-h-[calc(100vh-5rem)]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-12 pb-24 lg:pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold font-display tracking-tight mb-2">
              Account Settings
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Customize your digital throne experience and manage your persona.
            </p>
          </div>

          {/* Go Pro Banner - Only for non-premium users */}
          {!isPremium && (
            <div className="mb-6 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Icon name="workspace_premium" className="text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight text-amber-900 dark:text-amber-100">
                    Unlock Premium Features
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300/80">
                    Get analytics, challenges, and the global poop map!
                  </p>
                </div>
              </div>
              <Link
                href="/upgrade"
                className="whitespace-nowrap px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Go Pro
              </Link>
            </div>
          )}

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full border-4 border-primary p-1 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Profile avatar"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Icon name="person" className="text-6xl text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 bg-primary text-white w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
                  <Icon name="edit" className="text-sm" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold font-display">Your Throne Persona</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Level {level} &bull; {title}
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {/* Username & Display Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="e.g. StoolKing42"
                    />
                    {username && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Icon name="verified" className="text-primary" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Sir Logs-a-Lot"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="flex items-center gap-3 w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4">
                  <Icon name="mail" className="text-slate-400" />
                  <span className="flex-1 font-medium truncate">{email}</span>
                  <div className="flex items-center gap-1 bg-primary/20 text-slate-800 dark:text-primary px-3 py-1 rounded-full text-xs font-bold">
                    <span className="font-extrabold">Connected</span>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-6">
                  <h3 className="text-xl font-bold font-display flex items-center gap-2">
                    <Icon name="notifications_active" className="text-primary" />
                    Notification Settings
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage how and when you want to be alerted.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold">Daily Tracking Reminders</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Get a friendly nudge to log your daily movement.
                      </span>
                    </div>
                    <Toggle
                      checked={notifications.dailyReminders}
                      onChange={(val) =>
                        setNotifications((n) => ({ ...n, dailyReminders: val }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold">New Friend Requests</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Notifications when fellow Bristol Masters want to connect.
                      </span>
                    </div>
                    <Toggle
                      checked={notifications.friendRequests}
                      onChange={(val) =>
                        setNotifications((n) => ({ ...n, friendRequests: val }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold">Leaderboard Updates</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Alerts when your ranking changes on the global stats.
                      </span>
                    </div>
                    <Toggle
                      checked={notifications.leaderboardUpdates}
                      onChange={(val) =>
                        setNotifications((n) => ({ ...n, leaderboardUpdates: val }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold">Weekly Health Summary</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        A detailed breakdown of your Bristol stats every Sunday.
                      </span>
                    </div>
                    <Toggle
                      checked={notifications.weeklySummary}
                      onChange={(val) =>
                        setNotifications((n) => ({ ...n, weeklySummary: val }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-4 rounded-xl text-center text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-4">
                    Are you sure? This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="px-6 py-2 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 font-bold hover:text-red-600 transition-colors text-sm uppercase tracking-wide cursor-pointer"
                >
                  Delete Account
                </button>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-10 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
