"use client";

import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/store/auth.context";
import { getUserRoleName } from "@/utils/auth-role";
import { cn } from "@/utils/cn";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const { setTheme, resolvedTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-stroke bg-white px-4 dark:border-dark-3 dark:bg-dark-2 sm:px-6">
      {/* ── Left: Menu ─────────────────────────────────────────────────── */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-dark-5 transition hover:bg-gray-100 hover:text-dark lg:hidden dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* ── Right: Actions ─────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-1">
        {/* Theme toggle */}
        {typeof resolvedTheme !== "undefined" && (
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-dark-5 transition hover:bg-gray-100 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>
        )}

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-dark-5 transition hover:bg-gray-100 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* Divider */}
        <div className="mx-1.5 h-5 w-px bg-stroke dark:bg-dark-3" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition",
              "hover:bg-gray-50 dark:hover:bg-dark-3",
              dropdownOpen && "bg-gray-50 dark:bg-dark-3",
            )}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20 dark:bg-primary/20 dark:text-blue-400">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[13px] font-semibold leading-none text-dark dark:text-white">
                {user?.name ?? "User"}
              </p>
              <p className="mt-0.5 text-[11px] leading-none text-dark-5 dark:text-dark-6">
                {getUserRoleName(user)}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "hidden h-3.5 w-3.5 text-dark-5 transition-transform duration-200 sm:block dark:text-dark-6",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 overflow-hidden rounded-xl border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-dark-2">
              {/* User info */}
              <div className="bg-gray-50 px-4 py-3 dark:bg-dark-3">
                <p className="truncate text-[13px] font-semibold text-dark dark:text-white">
                  {user?.name}
                </p>
                <p className="truncate text-[11px] text-dark-5 dark:text-dark-6">
                  {user?.email}
                </p>
              </div>

              {/* Items */}
              <div className="py-1.5">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-dark-4 transition hover:bg-gray-50 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-dark-4 transition hover:bg-gray-50 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-stroke py-1.5 dark:border-dark-3">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out…" : "Log out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
