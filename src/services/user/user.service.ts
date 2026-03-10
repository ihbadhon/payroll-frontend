import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { AuthUser } from "@/types/auth";
import { Loan } from "@/types/loan";
import { SalaryStructure } from "@/types/salary-structure";

// ─── GET /api/user/profile ────────────────────────────────────────────────────
export async function getProfile(): Promise<AuthUser> {
  const res = await api.get<ApiResponse<AuthUser>>("/user/profile");
  return (res.data?.data ?? res.data) as AuthUser;
}

// ─── PATCH /api/user/profile ──────────────────────────────────────────────────
export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  const res = await api.patch<ApiResponse<AuthUser>>("/user/profile", payload);
  return (res.data?.data ?? res.data) as AuthUser;
}

// ─── POST /api/user/change-password ──────────────────────────────────────────
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await api.post("/user/change-password", payload);
}

// ─── GET /api/user/my-salary ─────────────────────────────────────────────────
export async function getMySalary(): Promise<SalaryStructure> {
  const res = await api.get<ApiResponse<SalaryStructure>>("/user/my-salary");
  return (res.data?.data ?? res.data) as SalaryStructure;
}

// ─── GET /api/user/my-loans ──────────────────────────────────────────────────
export async function getMyLoans(): Promise<Loan[]> {
  const res = await api.get<ApiResponse<Loan[]>>("/user/my-loans");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}
