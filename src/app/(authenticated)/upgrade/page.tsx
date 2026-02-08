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

  const userIsPremium = await isPremium(user.id);

  if (userIsPremium) {
    redirect("/dashboard?already_premium=true");
  }

  return <UpgradeClient />;
}
