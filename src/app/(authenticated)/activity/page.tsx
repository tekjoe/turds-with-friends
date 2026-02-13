import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  ActivityClient,
  type PendingRequest,
  type CommentNotification,
} from "@/components/activity/ActivityClient";

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();

  // Fetch pending friend requests + notifications in parallel
  const [{ data: rawRequests }, { data: rawNotifications }] =
    await Promise.all([
      supabase
        .from("friendships")
        .select("id, created_at, requester_id")
        .eq("addressee_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      admin
        .from("notifications")
        .select("id, actor_id, type, reference_id, message, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  // Build pending requests
  let pendingRequests: PendingRequest[] = [];

  if (rawRequests && rawRequests.length > 0) {
    const requesterIds = rawRequests.map((r) => r.requester_id);

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

  // Build comment notifications
  let commentNotifications: CommentNotification[] = [];

  const commentNotifs = (rawNotifications ?? []).filter(
    (n) => n.type === "comment"
  );

  if (commentNotifs.length > 0) {
    const actorIds = [...new Set(commentNotifs.map((n) => n.actor_id))];
    const { data: actorProfiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", actorIds);

    const actorMap = new Map(
      (actorProfiles ?? []).map((p) => [p.id, p])
    );

    commentNotifications = commentNotifs.map((n) => {
      const actor = actorMap.get(n.actor_id);
      return {
        id: n.id,
        message: n.message,
        referenceId: n.reference_id,
        read: n.read,
        created_at: n.created_at,
        actor: {
          display_name: actor?.display_name ?? null,
          username: actor?.username ?? null,
          avatar_url: actor?.avatar_url ?? null,
        },
      };
    });
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="flex gap-0 min-h-[calc(100vh-5rem)]">
        <Sidebar />
        <div className="flex-1 overflow-y-auto max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
          <ActivityClient
            pendingRequests={pendingRequests}
            commentNotifications={commentNotifications}
          />
        </div>
      </div>
    </div>
  );
}
