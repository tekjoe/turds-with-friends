import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { FriendsClient, type FriendData } from "@/components/friends/FriendsClient";

export default async function FriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch accepted friendships where user is on either side
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  );

  let friends: FriendData[] = [];

  if (friendIds.length > 0) {
    // Fetch friend profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, current_streak")
      .in("id", friendIds);

    // Fetch latest movement log per friend
    const { data: logs } = await supabase
      .from("movement_logs")
      .select("user_id, bristol_type, logged_at")
      .in("user_id", friendIds)
      .order("logged_at", { ascending: false });

    // Build a map of latest log per user
    const latestLogMap = new Map<string, { bristol_type: number; logged_at: string }>();
    logs?.forEach((log) => {
      if (!latestLogMap.has(log.user_id)) {
        latestLogMap.set(log.user_id, { bristol_type: log.bristol_type, logged_at: log.logged_at });
      }
    });

    friends = (profiles ?? []).map((p) => {
      const log = latestLogMap.get(p.id);
      return {
        id: p.id,
        name: p.display_name ?? p.username ?? "Anonymous",
        username: p.username ?? "unknown",
        avatarUrl: p.avatar_url,
        streak: p.current_streak,
        lastEvent: log?.logged_at ?? null,
        lastBristolType: log?.bristol_type ?? null,
      };
    });
  }

  const totalFriends = friends.length;
  const activeStreaks = friends.filter((f) => f.streak > 0).length;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="flex gap-0 min-h-[calc(100vh-5rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 w-full">
          <FriendsClient
            friends={friends}
            totalFriends={totalFriends}
            activeStreaks={activeStreaks}
          />
        </main>
      </div>
    </div>
  );
}
