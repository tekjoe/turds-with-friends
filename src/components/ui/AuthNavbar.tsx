"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

interface AuthNavbarProps {
  userName?: string;
  userLevel?: string;
  userInitials?: string;
}

export function AuthNavbar({
  userName = "User",
  userLevel = "Level 1",
  userInitials = "U",
}: AuthNavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/log", label: "Log Movement" },
    { href: "/leaderboard", label: "Leagues" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-3xl">💩</span>
            <span className="font-display font-extrabold text-xl tracking-tight text-accent">
              Turds with Friends
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary font-semibold border-b-2 border-primary pb-1"
                    : "text-slate-500 dark:text-slate-400 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userLevel}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold ring-2 ring-accent/20">
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
