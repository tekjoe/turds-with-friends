"use client";

import Link from "next/link";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export function Navbar({ isAuthenticated = false, userName }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 dark:bg-[#1A1614]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
            <Icon name="sentiment_satisfied" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-accent dark:text-primary truncate">
            <span className="hidden sm:inline">Turds with Friends</span>
            <span className="sm:hidden">TWF</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#chart" className="hover:text-primary transition-colors">
            The Chart
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/leaderboard" className="hover:text-primary transition-colors">
                Friends
              </Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">{userName}</span>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="md">
                  Log In
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="primary" size="sm" className="sm:text-base sm:px-4 sm:py-2">
                  <span className="hidden sm:inline">Join Now</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
