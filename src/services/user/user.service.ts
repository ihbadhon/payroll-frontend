import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  AuthUser,
  EmergencyContact,
  EmergencyContactPayload,
  EmergencyContactsResponse,
} from "@/types/auth";
import { BankDetails } from "@/types/employee";
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

// ─── GET /api/user/my-emergency-contacts ─────────────────────────────────────
export async function getEmergencyContacts(): Promise<EmergencyContactsResponse> {
  const res = await api.get<ApiResponse<EmergencyContactsResponse>>(
    "/user/my-emergency-contacts",
  );
  const raw = (res.data?.data ?? res.data) as EmergencyContactsResponse;
  return raw;
}

// ─── POST /api/user/emergency-contacts ───────────────────────────────────────
export async function addEmergencyContact(
  payload: EmergencyContactPayload,
): Promise<EmergencyContact> {
  const res = await api.post<ApiResponse<EmergencyContact>>(
    "/user/emergency-contacts",
    payload,
  );
  return (res.data?.data ?? res.data) as EmergencyContact;
}

// ─── GET /api/user/my-bank-accounts ─────────────────────────────────────────
export async function getMyBankAccount(): Promise<BankDetails | null> {
  const res = await api.get("/user/my-bank-accounts");
  const raw = res.data?.data ?? res.data;
  if (!raw) return null;
  return Array.isArray(raw) ? (raw[0] ?? null) : raw;
}

// ─── POST /api/user/add-bank-account ────────────────────────────────────────
export interface BankAccountPayload {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  routingNumber?: string;
  accountType?: string;
}

export async function addBankAccount(
  payload: BankAccountPayload,
): Promise<unknown> {
  const res = await api.post("/user/add-bank-account", payload);
  return res.data?.data ?? res.data;
}

// ─── PATCH /api/user/update-bank-account/:accountId ──────────────────────────
export async function updateBankAccount(
  accountId: string,
  payload: Partial<BankAccountPayload>,
): Promise<unknown> {
  const res = await api.patch(
    `/user/update-bank-account/${accountId}`,
    payload,
  );
  return res.data?.data ?? res.data;
}

// ─── PATCH /api/user/emergency-contacts/:contactId ───────────────────────────
export async function updateEmergencyContact(
  contactId: string,
  payload: Partial<EmergencyContactPayload>,
): Promise<EmergencyContact> {
  const res = await api.patch<ApiResponse<EmergencyContact>>(
    `/user/emergency-contacts/${contactId}`,
    payload,
  );
  return (res.data?.data ?? res.data) as EmergencyContact;
}
