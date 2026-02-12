import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

interface PrivacySettings {
  show_weight?: boolean;
  show_logs_to_friends?: boolean;
  show_on_leaderboard?: boolean;
  share_poop_locations?: boolean;
}

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, xp_total, privacy_settings")
    .eq("id", user.id)
    .single();

  const privacySettings = profile?.privacy_settings as PrivacySettings | null;

  const isPremiumUser = await isPremium(user.id);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <NotificationSettings />
        <SettingsForm
          profile={{
            username: profile?.username ?? null,
            display_name: profile?.display_name ?? null,
            avatar_url: profile?.avatar_url ?? null,
            xp_total: profile?.xp_total ?? 0,
            privacy_settings: privacySettings,
          }}
          email={user.email ?? ""}
          isPremium={isPremiumUser}
        />
      </div>
    </div>
  );
}
