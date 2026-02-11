import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Premium check disabled - all users have access
  // const premium = await isPremium(user.id);

  const admin = createAdminClient();

  // Get challenges where user is creator or participant
  const { data: participantRows } = await admin
    .from("challenge_participants")
    .select("challenge_id")
    .eq("user_id", user.id);

  const participantChallengeIds = (participantRows ?? []).map(
    (r) => r.challenge_id
  );

  const { data: createdChallenges } = await admin
    .from("challenges")
    .select("*")
    .eq("creator_id", user.id);

  const createdIds = (createdChallenges ?? []).map((c) => c.id);
  const allIds = [...new Set([...createdIds, ...participantChallengeIds])];

  if (allIds.length === 0) {
    return NextResponse.json({ challenges: [] });
  }

  const { data: challenges } = await admin
    .from("challenges")
    .select("*")
    .in("id", allIds)
    .order("created_at", { ascending: false });

  // Get all participants for these challenges
  const { data: participants } = await admin
    .from("challenge_participants")
    .select("*")
    .in("challenge_id", allIds);

  // Get profiles for participants
  const userIds = [
    ...new Set([
      ...(challenges ?? []).map((c) => c.creator_id),
      ...(participants ?? []).map((p) => p.user_id),
    ]),
  ];

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      {
        name: p.display_name ?? p.username ?? "Anonymous",
        avatar: p.avatar_url,
      },
    ])
  );

  // Compute progress for each participant
  const enrichedChallenges = await Promise.all(
    (challenges ?? []).map(async (challenge) => {
      const challengeParticipants = (participants ?? []).filter(
        (p) => p.challenge_id === challenge.id
      );

      const enrichedParticipants = await Promise.all(
        challengeParticipants.map(async (p) => {
          let progress = 0;

          if (p.status === "accepted") {
            if (challenge.challenge_type === "most_logs") {
              const { count } = await admin
                .from("movement_logs")
                .select("*", { count: "exact", head: true })
                .eq("user_id", p.user_id)
                .gte("logged_at", challenge.start_date)
                .lte("logged_at", challenge.end_date + "T23:59:59Z");
              progress = count ?? 0;
            } else if (challenge.challenge_type === "most_weight_lost") {
              const { data: logs } = await admin
                .from("movement_logs")
                .select("pre_weight, post_weight")
                .eq("user_id", p.user_id)
                .gte("logged_at", challenge.start_date)
                .lte("logged_at", challenge.end_date + "T23:59:59Z");
              progress = (logs ?? [])
                .filter((l) => l.pre_weight && l.post_weight)
                .reduce(
                  (sum, l) =>
                    sum + ((l.pre_weight ?? 0) - (l.post_weight ?? 0)),
                  0
                );
              progress = Math.round(progress * 10) / 10;
            } else if (challenge.challenge_type === "longest_streak") {
              const { data: logs } = await admin
                .from("movement_logs")
                .select("logged_at")
                .eq("user_id", p.user_id)
                .gte("logged_at", challenge.start_date)
                .lte("logged_at", challenge.end_date + "T23:59:59Z")
                .order("logged_at", { ascending: true });

              // Calculate longest consecutive day streak
              const days = new Set(
                (logs ?? []).map((l) =>
                  new Date(l.logged_at).toISOString().split("T")[0]
                )
              );
              const sortedDays = [...days].sort();
              let maxStreak = 0;
              let currentStreak = 0;
              let prevDate: Date | null = null;

              for (const day of sortedDays) {
                const date = new Date(day);
                if (
                  prevDate &&
                  date.getTime() - prevDate.getTime() === 86400000
                ) {
                  currentStreak++;
                } else {
                  currentStreak = 1;
                }
                maxStreak = Math.max(maxStreak, currentStreak);
                prevDate = date;
              }
              progress = maxStreak;
            }
          }

          const profile = profileMap.get(p.user_id);
          return {
            ...p,
            progress,
            userName: profile?.name ?? "Anonymous",
            avatarUrl: profile?.avatar ?? null,
          };
        })
      );

      const creatorProfile = profileMap.get(challenge.creator_id);
      return {
        ...challenge,
        creatorName: creatorProfile?.name ?? "Anonymous",
        participants: enrichedParticipants,
      };
    })
  );

  return NextResponse.json({ challenges: enrichedChallenges });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Premium check disabled - all users have access
  // const premium = await isPremium(user.id);

  const body = await request.json();
  const { title, challenge_type, start_date, end_date, friend_ids } = body as {
    title: string;
    challenge_type: "most_logs" | "longest_streak" | "most_weight_lost";
    start_date: string;
    end_date: string;
    friend_ids: string[];
  };

  if (!title || !challenge_type || !start_date || !end_date) {
    return NextResponse.json(
      { error: "title, challenge_type, start_date, and end_date are required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Create the challenge
  const { data: challenge, error: challengeError } = await admin
    .from("challenges")
    .insert({
      creator_id: user.id,
      title,
      challenge_type,
      start_date,
      end_date,
      status: "active",
    })
    .select()
    .single();

  if (challengeError || !challenge) {
    return NextResponse.json(
      { error: challengeError?.message ?? "Failed to create challenge" },
      { status: 500 }
    );
  }

  // Add creator as accepted participant
  const participantInserts = [
    {
      challenge_id: challenge.id,
      user_id: user.id,
      status: "accepted" as const,
    },
    ...(friend_ids ?? []).map((fid: string) => ({
      challenge_id: challenge.id,
      user_id: fid,
      status: "invited" as const,
    })),
  ];

  await admin.from("challenge_participants").insert(participantInserts);

  return NextResponse.json({ challenge });
}
