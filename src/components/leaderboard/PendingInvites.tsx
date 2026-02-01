"use client";

import { Icon } from "@/components/ui/Icon";

interface Invite {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  timeAgo: string;
}

interface PendingInvitesProps {
  invites: Invite[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export function PendingInvites({ invites, onAccept, onDecline }: PendingInvitesProps) {
  if (invites.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Pending Invites</h3>
        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {invites.length}
        </span>
      </div>
      <div className="space-y-4">
        {invites.map((invite) => (
          <div key={invite.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                {invite.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={invite.avatar}
                    alt={invite.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  invite.initials
                )}
              </div>
              <div className="text-sm">
                <p className="font-bold leading-tight">{invite.name}</p>
                <p className="text-xs text-slate-500">{invite.timeAgo}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(invite.id)}
                className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center hover:bg-primary/30"
              >
                <Icon name="check" className="text-sm" />
              </button>
              <button
                onClick={() => onDecline(invite.id)}
                className="w-8 h-8 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg flex items-center justify-center hover:bg-slate-200"
              >
                <Icon name="close" className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
