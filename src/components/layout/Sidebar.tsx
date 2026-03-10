"use client";

import { getNavForRole } from "@/config/nav";
import { useAuth } from "@/store/auth.context";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const roleName = user?.role?.name ?? "Employee";
  const navGroups = getNavForRole(roleName);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* ── Mobile Backdrop ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Panel ───────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-[15.5rem] shrink-0 flex-col",
          "border-r border-stroke bg-white",
          "dark:border-dark-3 dark:bg-dark-2",
          "lg:static lg:z-auto lg:translate-x-0",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* ── Logo ────────────────────────────────────────────────────── */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              {/* Grid pattern */}
              <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
                <rect
                  x="3"
                  y="3"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.9"
                />
                <rect
                  x="11"
                  y="3"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="3"
                  y="11"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="11"
                  y="11"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-dark dark:text-white">
              PayrollHQ
            </span>
          </Link>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-dark-5 transition hover:bg-gray-100 hover:text-dark lg:hidden dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-3">
          <ul className="space-y-5">
            {navGroups.map((group) => (
              <li key={group.title}>
                {/* Group label */}
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-dark-5 dark:text-dark-6">
                  {group.title}
                </p>
                {/* Items */}
                <ul className="space-y-px">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-primary/[0.08] text-primary dark:bg-primary/[0.15] dark:text-blue-400"
                              : "text-dark-4 hover:bg-gray-50 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white",
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                          )}
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive
                                ? "text-primary dark:text-blue-400"
                                : "text-dark-5 group-hover:text-dark-3 dark:text-dark-6 dark:group-hover:text-white",
                            )}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold leading-none text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── User Footer ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-stroke p-3.5 dark:border-dark-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20 dark:bg-primary/20 dark:text-blue-400">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-dark dark:text-white">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-[11px] text-dark-5 dark:text-dark-6">
                {user?.role?.name ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
