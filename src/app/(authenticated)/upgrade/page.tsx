import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isPremium } from "@/lib/premium";
import { UpgradeClient } from "@/components/upgrade/UpgradeClient";

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Premium check kept for future reference - redirect removed as part of US-001
  await isPremium(user.id);

  return <UpgradeClient />;
}
