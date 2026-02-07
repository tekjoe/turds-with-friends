interface PodiumUser {
  id: string;
  name: string;
  avatar?: string;
  streak: number;
  points: number;
  rank: 1 | 2 | 3;
}

interface PodiumProps {
  users: PodiumUser[];
}

const rankConfig = {
  1: {
    label: "Gold",
    labelBg: "bg-yellow-400 text-yellow-900",
    border: "border-2 border-primary",
    avatarBorder: "border-yellow-400",
    shadow: "shadow-xl shadow-primary/10",
    size: "p-8",
    avatarSize: "w-28 h-28",
    textSize: "text-xl",
    pointsSize: "text-3xl",
    icon: "emoji_events",
  },
  2: {
    label: "Silver",
    labelBg: "bg-slate-300 text-slate-800",
    border: "border border-slate-200 dark:border-slate-800",
    avatarBorder: "border-slate-200",
    shadow: "",
    size: "p-6 mt-4 md:mt-6",
    avatarSize: "w-20 h-20",
    textSize: "text-lg",
    pointsSize: "text-2xl",
    icon: null,
  },
  3: {
    label: "Bronze",
    labelBg: "bg-orange-400 text-orange-950",
    border: "border border-slate-200 dark:border-slate-800",
    avatarBorder: "border-orange-200",
    shadow: "",
    size: "p-6 mt-4 md:mt-6",
    avatarSize: "w-20 h-20",
    textSize: "text-lg",
    pointsSize: "text-2xl",
    icon: null,
  },
};

export function Podium({ users }: PodiumProps) {
  // Sort users to display in order: 2nd, 1st, 3rd
  const sortedUsers = [...users].sort((a, b) => {
    const order = { 2: 0, 1: 1, 3: 2 };
    return order[a.rank] - order[b.rank];
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
      {sortedUsers.map((user) => {
        const config = rankConfig[user.rank];
        return (
          <div
            key={user.id}
            className={`bg-white dark:bg-slate-900 ${config.size} rounded-xl ${config.border} text-center relative ${config.shadow} w-full ${
              user.rank === 1 ? "order-2 md:order-2" : user.rank === 2 ? "order-1 md:order-1" : "order-3"
            }`}
          >
            {/* Rank Badge */}
            <div
              className={`absolute -top-4 left-1/2 -translate-x-1/2 ${config.labelBg} px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1`}
            >
              {config.icon && (
                <span className="material-symbols-rounded text-sm">{config.icon}</span>
              )}
              {config.label}
            </div>

            {/* Avatar */}
            <div
              className={`${config.avatarSize} rounded-full mx-auto mb-4 border-4 ${config.avatarBorder} bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500`}
            >
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.slice(0, 2).toUpperCase()
              )}
            </div>

            {/* Name */}
            <h3 className={`font-bold ${config.textSize}`}>{user.name}</h3>

            {/* Streak */}
            <div className="flex items-center justify-center gap-1 text-orange-500 font-semibold mb-2">
              <span className="material-symbols-rounded text-sm">local_fire_department</span>
              {user.streak} Day Streak
            </div>

            {/* Points */}
            <div className={`${config.pointsSize} font-black text-primary`}>
              {user.points.toLocaleString()}{" "}
              <span className="text-xs uppercase font-bold text-slate-400">pts</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
