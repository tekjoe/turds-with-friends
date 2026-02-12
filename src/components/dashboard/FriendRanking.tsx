import Image from "next/image";
import Link from "next/link";

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
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-card-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Friend Ranking</h2>
        <Link href="/leaderboard" className="text-primary text-sm font-semibold hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              friend.isCurrentUser
                ? "bg-primary/10 border border-primary/20 ring-1 ring-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <div
              className={`w-8 text-center font-display font-bold ${
                friend.isCurrentUser ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {friend.rank}
            </div>
            {friend.avatarUrl ? (
              <Image
                src={friend.avatarUrl}
                alt={friend.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-card"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white ring-2 ring-card"
                style={{ backgroundColor: friend.color }}
              >
                {friend.initials}
              </div>
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-bold ${
                  friend.isCurrentUser ? "text-primary" : ""
                }`}
              >
                {friend.isCurrentUser ? `You (${friend.name})` : friend.name}
              </p>
              <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (parseInt(friend.points.replace(/[^0-9]/g, "")) / 25) * 100)}%`,
                    backgroundColor: friend.isCurrentUser ? "var(--chart-brown)" : friend.color,
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-xs font-bold ${
                  friend.isCurrentUser ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {friend.points}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
