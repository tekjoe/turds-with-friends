interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  initials: string;
  avatar?: string;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

export function LeaderboardTable({ users }: LeaderboardTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden w-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        <div className="w-12 text-center">Rank</div>
        <div className="flex-1 ml-4">User</div>
        <div className="w-32 text-center">Streak</div>
        <div className="w-32 text-right">Points</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 flex items-center transition-colors ${
              user.isCurrentUser
                ? "bg-primary/10 border-l-4 border-primary"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            {/* Rank */}
            <div
              className={`w-12 text-center font-bold ${
                user.isCurrentUser ? "text-primary" : "text-slate-500"
              }`}
            >
              {user.rank}
            </div>

            {/* User */}
            <div className="flex-1 flex items-center ml-4 gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-500">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.initials
                )}
              </div>
              <span className={`font-semibold ${user.isCurrentUser ? "font-bold" : ""}`}>
                {user.isCurrentUser ? `You (${user.name})` : user.name}
              </span>
            </div>

            {/* Streak */}
            <div className="w-32 flex items-center justify-center gap-1 text-orange-500">
              <span className="material-symbols-rounded text-sm">local_fire_department</span>
              {user.streak}
            </div>

            {/* Points */}
            <div
              className={`w-32 text-right font-black ${
                user.isCurrentUser ? "text-primary" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {user.points.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      <div className="p-4 text-center">
        <button className="text-primary font-bold hover:underline">Show More</button>
      </div>
    </div>
  );
}
