import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Department } from "@/types/employee";

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

// ─── GET /api/departments ─────────────────────────────────────────────────────
export async function listDepartments(): Promise<Department[]> {
  const res = await api.get<ApiResponse<Department[]>>("/departments");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}
// ─── POST /api/departments ────────────────────────────────────────────────────
export async function createDepartment(
  payload: CreateDepartmentPayload,
): Promise<Department> {
  const res = await api.post<ApiResponse<Department>>("/departments", payload);
  return (res.data?.data ?? res.data) as Department;
}
