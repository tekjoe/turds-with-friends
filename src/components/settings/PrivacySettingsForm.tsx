"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import { Sidebar } from "@/components/ui/Sidebar";
import { Toggle } from "@/components/ui/Toggle";

interface PrivacySettings {
  show_weight?: boolean;
  show_logs_to_friends?: boolean;
  show_on_leaderboard?: boolean;
  share_poop_locations?: boolean;
}

interface PrivacySettingsFormProps {
  settings: PrivacySettings | null;
}

export function PrivacySettingsForm({ settings }: PrivacySettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize state from props
  const [publicProfile, setPublicProfile] = useState(
    settings?.show_on_leaderboard !== false
  );
  const [shareLocations, setShareLocations] = useState(
    settings?.share_poop_locations === true
  );

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

      // We need to fetch the current settings first to merge, or we can just update specific fields if the DB supports partial updates on JSONB columns deep merge.
      // But typically for JSONB updates in Supabase/Postgres, standard UPDATE replaces the whole object unless we use jsonb_set or similar.
      // However, here we are updating the full `privacy_settings` object structure usually.
      // Let's first fetch the current profile to respect other settings we aren't editing here (like show_weight).
      
      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("privacy_settings")
        .eq("id", user.id)
        .single();
        
      if (fetchError) throw fetchError;

      const currentSettings = currentProfile?.privacy_settings as PrivacySettings || {};

      const { error } = await supabase
        .from("profiles")
        .update({
          privacy_settings: {
            ...currentSettings,
            show_on_leaderboard: publicProfile,
            share_poop_locations: shareLocations,
          },
        })
        .eq("id", user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Privacy settings saved!" });
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

  return (
    <div className="flex gap-0 min-h-[calc(100vh-5rem)]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-12 pb-24 lg:pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold font-display tracking-tight mb-2">
              Privacy Settings
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Control what you share with the world and your friends.
            </p>
          </div>

          <div className="space-y-6">
            {/* Public Profile Banner */}
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-full bg-primary flex items-center justify-center text-white">
                  <Icon name="visibility" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">Public Profile</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your Bristol logs are currently visible to friends and on leaderboards.
                  </p>
                </div>
              </div>
              <Toggle checked={publicProfile} onChange={setPublicProfile} />
            </div>

            {/* Share Poop Locations Banner */}
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <Icon name="location_on" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">Share Poop Locations</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Let friends see your pins on their Poop Map.
                  </p>
                </div>
              </div>
              <Toggle checked={shareLocations} onChange={setShareLocations} />
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

            {/* Footer Actions */}
            <div className="flex justify-end pt-4">
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
      </main>
    </div>
  );
}
