import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PrivacySettingsForm } from "@/components/settings/PrivacySettingsForm";

interface PrivacySettings {
  show_weight?: boolean;
  show_logs_to_friends?: boolean;
  show_on_leaderboard?: boolean;
  share_poop_locations?: boolean;
}

export default async function PrivacySettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("privacy_settings")
    .eq("id", user.id)
    .single();

  const privacySettings = profile?.privacy_settings as PrivacySettings | null;

  return (
    <div className="min-h-screen bg-background pt-20">
      <PrivacySettingsForm settings={privacySettings} />
    </div>
  );
}
