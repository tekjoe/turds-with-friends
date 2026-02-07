import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { LogForm } from "@/components/log/LogForm";

export default async function LogMovementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const premium = await isPremium(user.id);

  return <LogForm isPremium={premium} />;
}
