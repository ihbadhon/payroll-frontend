import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Bonus, EmployeeWithBonuses } from "@/types/bonus";
import { BonusType } from "@/types/enums";

export interface BonusListParams {
  employeeId?: string;
  month?: number;
  year?: number;
  bonusType?: string;
}

export interface EmployeesWithBonusParams {
  departmentId?: string;
  month?: number;
  year?: number;
}

export interface AssignBonusPayload {
  employeeId: string;
  bonusType: BonusType;
  amount: number;
  month: number;
  year: number;
  reason?: string;
}

export interface BonusSummary {
  pending: number;
  approved: number;
  paid: number;
}

// ─── POST /api/bonus/assign ───────────────────────────────────────────────────
export async function assignBonus(payload: AssignBonusPayload): Promise<Bonus> {
  const res = await api.post<ApiResponse<Bonus>>("/bonus/assign", payload);
  return (res.data?.data ?? res.data) as Bonus;
}

// ─── GET /api/bonus ───────────────────────────────────────────────────────────
export async function listBonuses(
  params: BonusListParams = {},
): Promise<Bonus[]> {
  const res = await api.get<ApiResponse<Bonus[]>>("/bonus", { params });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}

// ─── GET /api/bonus/employees-with-bonuses ───────────────────────────────────
export async function getEmployeesWithBonuses(
  params: EmployeesWithBonusParams = {},
): Promise<EmployeeWithBonuses[]> {
  const res = await api.get<ApiResponse<EmployeeWithBonuses[]>>(
    "/bonus/employees-with-bonuses",
    { params },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}

// ─── GET /api/bonus/summary ──────────────────────────────────────────────────
export async function getBonusSummary(
  params: BonusListParams = {},
): Promise<BonusSummary> {
  const res = await api.get<ApiResponse<BonusSummary>>("/bonus/summary", {
    params,
  });
  return (res.data?.data ?? res.data) as BonusSummary;
}

// ─── GET /api/bonus/{id} ─────────────────────────────────────────────────────
export async function getBonusById(id: string): Promise<Bonus> {
  const res = await api.get<ApiResponse<Bonus>>(`/bonus/${id}`);
  return (res.data?.data ?? res.data) as Bonus;
}

// ─── DELETE /api/bonus/{id} ──────────────────────────────────────────────────
export async function deleteBonus(id: string): Promise<void> {
  await api.delete(`/bonus/${id}`);
}
