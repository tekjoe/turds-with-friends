import { Icon } from "@/components/ui/Icon";

interface Friend {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  isOnline: boolean;
  status?: string;
  lastSeen?: string;
}

interface FriendsListProps {
  friends: Friend[];
}

export function FriendsList({ friends }: FriendsListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Friends List</h3>
        <button className="text-xs font-bold text-primary">View All</button>
      </div>
      <div className="space-y-5">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full border-2 border-slate-100 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                  {friend.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    friend.initials
                  )}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-900 rounded-full ${
                    friend.isOnline ? "bg-primary" : "bg-slate-300"
                  }`}
                />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{friend.name}</p>
                {friend.isOnline && friend.status ? (
                  <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 uppercase">
                    <Icon name="local_hospital" className="text-[12px] text-primary" />
                    {friend.status}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">
                    Offline · {friend.lastSeen}
                  </p>
                )}
              </div>
            </div>
            {!friend.isOnline && (
              <button className="p-2 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase transition-colors">
                <Icon name="waving_hand" className="text-sm" /> Poke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
