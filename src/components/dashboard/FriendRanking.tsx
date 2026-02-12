import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface Friend {
  id: string;
  rank: number;
  name: string;
  initials: string;
  points: string;
  color: string;
  avatarUrl?: string | null;
  isCurrentUser?: boolean;
}

interface FriendRankingProps {
  friends: Friend[];
}

export function FriendRanking({ friends }: FriendRankingProps) {
  return (
    <div className="bg-card p-5 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-card-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-display font-semibold">Friend Ranking</h2>
        <Link href="/leaderboard" className="text-primary text-xs font-medium hover:underline">
          View All
        </Link>
      </div>
      <div>
        {friends.map((friend, index) => (
          <div
            key={friend.id}
            className={`flex items-center gap-3 py-2.5 ${
              index < friends.length - 1 ? "border-b border-border-light" : ""
            }`}
          >
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${
                friend.isCurrentUser
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {friend.rank}
            </div>
            {friend.avatarUrl ? (
              <Image
                src={friend.avatarUrl}
                alt={friend.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: friend.color }}
              >
                {friend.initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${friend.isCurrentUser ? "text-primary" : ""}`}>
                {friend.isCurrentUser ? `You (${friend.name})` : friend.name}
              </p>
              <p className="text-xs text-muted-foreground">{friend.points}</p>
            </div>
            {friend.rank === 1 && (
              <Icon name="emoji_events" className="text-lg text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
