"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";
import { ExportButton } from "@/components/dashboard/ExportButton";

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  avatarUrl?: string;
  isPremium?: boolean;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/friends", label: "Friends" },
  { href: "/activity", label: "Activity" },
  { href: "/analytics", label: "Analytics" },
  { href: "/challenges", label: "Challenges" },
  { href: "/map", label: "Poop Map" },
];

export function Navbar({ isAuthenticated = false, userName, avatarUrl }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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
    <nav className="fixed top-0 w-full z-50 bg-card dark:bg-card border-b border-card-border dark:border-card-border">
      <div className="px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 relative flex-shrink-0">
              <Image
                src="/icon.png"
                alt="Bowel Buddies Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-base font-bold font-display tracking-tight text-primary truncate">
              <span className="hidden sm:inline">Bowel Buddies</span>
              <span className="sm:hidden">BB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-text-secondary hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/activity" className="flex items-center text-text-secondary hover:text-foreground transition-colors">
                <Icon name="notifications" className="text-xl leading-none" />
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={`${userName} profile avatar`} width={32} height={32} className="h-8 w-8 rounded-full flex-shrink-0 object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-bg flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">{userName}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 pt-2 w-56 z-[9999]">
                    <div className="bg-card border border-card-border rounded-xl shadow-xl py-2">
                      {/* Mobile-only Navigation Links */}
                      <div className="md:hidden border-b border-card-border pb-2 mb-2">
                        {navLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon name="settings" className="text-slate-400" />
                        Account Settings
                      </Link>
                      <div className="px-4 py-2">
                        <ExportButton />
                      </div>
                      <div className="border-t border-card-border my-1" />
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left cursor-pointer"
                      >
                        <Icon name="logout" className="text-red-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                <ExportButton />
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
