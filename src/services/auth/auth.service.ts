import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { AuthResponse, LoginPayload } from "@/types/auth";

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  return (res.data?.data ?? res.data) as AuthResponse;
}

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export async function forgotPassword(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
export async function refreshToken(): Promise<{ accessToken: string }> {
  const res =
    await api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
  return (res.data?.data ?? res.data) as { accessToken: string };
}

// ─── GET /api/auth/verify-email ───────────────────────────────────────────────
// Check if email verification token is valid (no side effects, no password set)
export async function verifyEmailToken(
  token: string,
): Promise<{ valid: boolean }> {
  const res = await api.get<ApiResponse<{ valid: boolean }>>(
    "/auth/verify-email",
    {
      params: { token },
    },
  );
  return (res.data?.data ?? res.data) as { valid: boolean };
}

// ─── POST /api/auth/set-password ──────────────────────────────────────────────
// Set employee password and mark email as verified (token becomes invalid)
export async function setPassword(payload: {
  token: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>(
    "/auth/set-password",
    payload,
  );
  return (res.data?.data ?? res.data) as AuthResponse;
}

// getProfile has been moved to @/services/user/user.service
export { getProfile } from "@/services/user/user.service";
