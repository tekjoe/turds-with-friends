"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

interface SearchResult {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AddFriendModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const sendRequest = async (addresseeId: string) => {
    setError(null);
    const res = await fetch("/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressee_id: addresseeId }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Failed to send request");
      return;
    }

    setSentIds((prev) => new Set(prev).add(addresseeId));
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display">Add a Friend</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        <div className="relative mb-4">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Search by username..."
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        <div className="relative min-h-[72px] max-h-64 overflow-y-auto space-y-2">
          {isSearching && results.length > 0 && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 z-10 flex items-center justify-center rounded-xl">
              <p className="text-sm text-slate-400">Searching...</p>
            </div>
          )}

          {isSearching && results.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">Searching...</p>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No users found</p>
          )}

          {!isSearching && query.length < 2 && results.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">Type a username to search</p>
          )}

          {results.map((user) => {
            const displayName = user.display_name ?? user.username ?? "Anonymous";
            const sent = sentIds.has(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={displayName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {getInitials(displayName)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm">{displayName}</p>
                    {user.username && (
                      <p className="text-xs text-slate-400">@{user.username}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => sendRequest(user.id)}
                  disabled={sent}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    sent
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      : "bg-primary text-white hover:bg-green-600"
                  }`}
                >
                  {sent ? "Sent" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
