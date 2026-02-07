"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChallengeCard } from "./ChallengeCard";
import { CreateChallengeForm } from "./CreateChallengeForm";
import { Icon } from "@/components/ui/Icon";

interface Participant {
  id: string;
  user_id: string;
  status: "invited" | "accepted" | "declined";
  progress: number;
  userName: string;
  avatarUrl: string | null;
}

interface ChallengeData {
  id: string;
  title: string;
  challenge_type: "most_logs" | "longest_streak" | "most_weight_lost";
  start_date: string;
  end_date: string;
  status: "pending" | "active" | "completed";
  creatorName: string;
  creator_id: string;
  participants: Participant[];
}

interface ChallengeListProps {
  currentUserId: string;
}

export function ChallengeList({ currentUserId }: ChallengeListProps) {
  const router = useRouter();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    const res = await fetch("/api/challenges");
    if (res.ok) {
      const data = await res.json();
      setChallenges(data.challenges);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleRespond = async (
    challengeId: string,
    status: "accepted" | "declined"
  ) => {
    await fetch(`/api/challenges/${challengeId}/respond`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchChallenges();
  };

  const handleCreated = () => {
    setShowCreate(false);
    fetchChallenges();
    router.refresh();
  };

  const invitations = challenges.filter((c) =>
    c.participants.some(
      (p) => p.user_id === currentUserId && p.status === "invited"
    )
  );

  const active = challenges.filter(
    (c) =>
      c.status === "active" &&
      !invitations.some((inv) => inv.id === c.id)
  );

  const completed = challenges.filter((c) => c.status === "completed");

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div />
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Icon name="add" className="text-lg" />
          Create Challenge
        </button>
      </div>

      {showCreate && (
        <CreateChallengeForm
          onCreated={handleCreated}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {/* Invitations */}
      {invitations.length > 0 && (
        <section>
          <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
            <Icon name="mail" className="text-amber-500" />
            Invitations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {invitations.map((c) => (
              <ChallengeCard
                key={c.id}
                id={c.id}
                title={c.title}
                challengeType={c.challenge_type}
                startDate={c.start_date}
                endDate={c.end_date}
                status={c.status}
                creatorName={c.creatorName}
                participants={c.participants}
                currentUserId={currentUserId}
                onRespond={handleRespond}
              />
            ))}
          </div>
        </section>
      )}

      {/* Active */}
      {active.length > 0 && (
        <section>
          <h2 className="text-lg font-bold font-display mb-4">
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {active.map((c) => (
              <ChallengeCard
                key={c.id}
                id={c.id}
                title={c.title}
                challengeType={c.challenge_type}
                startDate={c.start_date}
                endDate={c.end_date}
                status={c.status}
                creatorName={c.creatorName}
                participants={c.participants}
                currentUserId={currentUserId}
                onRespond={handleRespond}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-bold font-display mb-4">Past Challenges</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completed.map((c) => (
              <ChallengeCard
                key={c.id}
                id={c.id}
                title={c.title}
                challengeType={c.challenge_type}
                startDate={c.start_date}
                endDate={c.end_date}
                status={c.status}
                creatorName={c.creatorName}
                participants={c.participants}
                currentUserId={currentUserId}
                onRespond={handleRespond}
              />
            ))}
          </div>
        </section>
      )}

      {challenges.length === 0 && !showCreate && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="emoji_events" className="text-4xl text-primary" />
            </div>
            <h2 className="text-xl font-bold font-display">No Challenges Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Create a challenge and invite your friends to compete!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
