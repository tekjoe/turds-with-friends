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

export function FriendSearch() {
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
      <h3 className="font-bold text-lg mb-4">Find Friends</h3>
      <div className="relative">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none"
          placeholder="Search by username..."
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {(isSearching || results.length > 0 || (query.length >= 2 && !isSearching)) && (
        <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
          {isSearching && results.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">Searching...</p>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">No users found</p>
          )}

          {results.map((u) => {
            const name = u.display_name ?? u.username ?? "Anonymous";
            const sent = sentIds.has(u.id);
            return (
              <div
                key={u.id}
                className="flex items-center justify-between py-2 px-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {u.avatar_url ? (
                    <Image
                      src={u.avatar_url}
                      alt={name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {getInitials(name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{name}</p>
                    {u.username && (
                      <p className="text-[10px] text-slate-400 truncate">@{u.username}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => sendRequest(u.id)}
                  disabled={sent}
                  className={`shrink-0 ml-2 px-3 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                    sent
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      : "bg-primary text-white hover:bg-green-600"
                  }`}
                >
                  {sent ? (
                    <Icon name="check" className="text-xs" />
                  ) : (
                    <Icon name="person_add" className="text-xs" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
