"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const sidebarItems = [
  { icon: "person", label: "Account", href: "/settings" },
  { icon: "lock", label: "Privacy", href: "/settings/privacy" },
  { icon: "notifications", label: "Notifications", href: "/activity" },
  { icon: "group", label: "Friends List", href: "/friends" },
];

const mobileItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  ...sidebarItems,
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col justify-between p-6 shrink-0">
      <div className="flex flex-col gap-8">
        <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-primary/10"
                  }`}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <Icon name="arrow_back" />
          <span>Dashboard</span>
        </Link>
      </aside>
    </>
  );
}
