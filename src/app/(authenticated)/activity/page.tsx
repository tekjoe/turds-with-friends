import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { ActivityClient, type PendingRequest } from "@/components/activity/ActivityClient";

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch pending friend requests where current user is the addressee
  const { data: rawRequests } = await supabase
    .from("friendships")
    .select("id, created_at, requester_id")
    .eq("addressee_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  let pendingRequests: PendingRequest[] = [];

  if (rawRequests && rawRequests.length > 0) {
    const requesterIds = rawRequests.map((r) => r.requester_id);

    const admin = createAdminClient();
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", requesterIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    pendingRequests = rawRequests.map((r) => {
      const profile = profileMap.get(r.requester_id);
      return {
        id: r.id,
        requester: {
          display_name: profile?.display_name ?? null,
          username: profile?.username ?? null,
          avatar_url: profile?.avatar_url ?? null,
        },
        created_at: r.created_at,
      };
    });
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="flex gap-0 min-h-[calc(100vh-5rem)]">
        <Sidebar />
        <div className="flex-1 overflow-y-auto max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
          <ActivityClient pendingRequests={pendingRequests} />
        </div>
      </div>
    </div>
  );
}
