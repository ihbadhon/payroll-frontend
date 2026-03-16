"use client";

import { getProfile } from "@/services/auth/auth.service";
import { AuthUser } from "@/types/auth";
import { ACCESS_TOKEN_KEY } from "@/lib/axios";
import { USER_ROLE_KEY } from "@/constants/auth";
import Cookies from "js-cookie";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
export { USER_ROLE_KEY }; // re-export for convenience

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  refetchUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ���── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set user and persist role cookie for middleware
  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u?.role?.name) {
      Cookies.set(USER_ROLE_KEY, u.role.name, COOKIE_OPTIONS);
    } else {
      Cookies.remove(USER_ROLE_KEY);
    }
  }, []);

  // Store access token in cookie
  const setAccessToken = useCallback((token: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: 1 / 96, // ~15 minutes (matches JWT_ACCESS_TOKEN_EXPIRES_IN=15m)
    });
  }, []);

  // Clear everything on logout
  const clearAuth = useCallback(() => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(USER_ROLE_KEY);
    setUserState(null);
  }, []);

  // Re-fetch the user profile (used after login or on mount)
  const refetchUser = useCallback(async () => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const profile = await getProfile();
      setUserState(profile);
      // Keep role cookie in sync with actual profile
      if (profile?.role?.name) {
        Cookies.set(USER_ROLE_KEY, profile.role.name, COOKIE_OPTIONS);
      }
    } catch {
      // Token expired or invalid — clear everything
      Cookies.remove(ACCESS_TOKEN_KEY);
      Cookies.remove(USER_ROLE_KEY);
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount: try to restore user from existing cookie
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        setAccessToken,
        clearAuth,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
