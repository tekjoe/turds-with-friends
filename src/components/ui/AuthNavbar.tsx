"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
              <Image
                src="/icon.png"
                alt="Bowel Buddies Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-accent truncate">
              <span className="hidden sm:inline">Bowel Buddies</span>
              <span className="sm:hidden">BB</span>
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
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userLevel}</p>
              </div>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm sm:text-base ring-2 ring-accent/20 flex-shrink-0">
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
