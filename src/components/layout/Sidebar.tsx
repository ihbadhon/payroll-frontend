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

  return (
    <>
      {/* ── Mobile Backdrop ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Panel ───────────────────────────────────────────────── */}
      <aside
        className={cn(
          // Base
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col",
          "border-r border-gray-200 bg-white",
          "dark:border-dark-3 dark:bg-dark-2",
          // Desktop: always visible
          "lg:static lg:z-auto lg:translate-x-0",
          // Mobile: slide in/out
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* ── Logo ────────────────────────────────────────────────────── */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5 dark:border-dark-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              PayrollHQ
            </span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden dark:hover:bg-dark-3"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-6">
            {navGroups.map((group) => (
              <li key={group.title}>
                {/* Group title */}
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {group.title}
                </p>
                {/* Group items */}
                <ul className="space-y-0.5">
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
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-3 dark:hover:text-white",
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive
                                ? "text-primary dark:text-primary-300"
                                : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                            )}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
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

        {/* ── User Profile Footer ──────────────────────────────────────── */}
        <div className="shrink-0 border-t border-gray-200 p-4 dark:border-dark-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-primary-300">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.role?.name ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
