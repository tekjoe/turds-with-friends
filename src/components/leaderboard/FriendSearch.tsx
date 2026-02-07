"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function FriendSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
      <h3 className="font-bold text-lg mb-4">Find Friends</h3>
      <div className="relative">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none"
          placeholder="Username or Email..."
        />
      </div>
    </div>
  );
}
