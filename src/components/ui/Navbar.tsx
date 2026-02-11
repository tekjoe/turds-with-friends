"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  avatarUrl?: string;
  // isPremium prop kept for backward compatibility but no longer used (premium features are open)
  isPremium?: boolean;
}

export function Navbar({ isAuthenticated = false, userName, avatarUrl }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 dark:bg-[#1A1614]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image
              src="/icon.png"
              alt="Bowel Buddies Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-accent dark:text-primary truncate">
            <span className="hidden sm:inline">Bowel Buddies</span>
            <span className="sm:hidden">BB</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/friends" className="hover:text-primary transition-colors">
                Friends
              </Link>
              <Link href="/activity" className="hover:text-primary transition-colors">
                Activity
              </Link>
              <Link href="/analytics" className="hover:text-primary transition-colors">
                Analytics
              </Link>
              <Link href="/challenges" className="hover:text-primary transition-colors">
                Challenges
              </Link>
              <Link href="/map" className="hover:text-primary transition-colors">
                Poop Map
              </Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div
              className="relative"
              ref={menuRef}
            >
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">{userName}</span>
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" width={40} height={40} className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex-shrink-0 object-cover" />
                ) : (
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                    {userName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 pt-2 w-56 z-[9999]">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2">
                  {/* Mobile-only Navigation Links */}
                  <div className="md:hidden border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                    {[
                      { label: "Dashboard", href: "/dashboard" },
                      { label: "Friends", href: "/friends" },
                      { label: "Activity", href: "/activity" },
                      { label: "Analytics", href: "/analytics" },
                      { label: "Challenges", href: "/challenges" },
                      { label: "Poop Map", href: "/map" },
                    ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <div className="flex items-center gap-3">
                             <span>{item.label}</span>
                          </div>
                        </Link>
                      ))}
                  </div>

                  <Link
                    href="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Icon name="notifications" className="text-slate-400" />
                    Notifications
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Icon name="settings" className="text-slate-400" />
                    Account Settings
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors hidden md:flex"
                  >
                    <Icon name="dashboard" className="text-slate-400" />
                    Dashboard
                  </Link>
                  <div className="border-t border-slate-200 dark:border-slate-800 my-1" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                  >
                    <Icon name="logout" className="text-red-400" />
                    Sign Out
                  </button>
                </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="md">
                  Log In
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="primary" size="md">
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
