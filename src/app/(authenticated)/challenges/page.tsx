import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { ChallengeList } from "@/components/challenges/ChallengeList";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Premium check kept for future reference - redirects removed as part of US-001
  await isPremium(user.id);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Friend Challenges
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Compete with friends and see who reigns supreme.
          </p>
        </header>
        <ChallengeList currentUserId={user.id} />
      </div>
    </div>
  );
}
