import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  ActiveSalaryEmployee,
  ApproveSalaryStructurePayload,
  AssignSalaryPayload,
  RejectSalaryStructurePayload,
  SalaryStructure,
  UpdateSalaryPayload,
} from "@/types/salary-structure";
import { Employee } from "@/types/employee";

// ─── GET /api/salary-structure/unassigned-salary ─────────────────────────────
export async function getUnassignedEmployees(): Promise<Employee[]> {
  const res = await api.get<ApiResponse<Employee[]>>(
    "/salary-structure/unassigned-salary",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

// ─── GET /api/salary-structure/active-salary-list ────────────────────────────
export async function listSalaryStructures(): Promise<ActiveSalaryEmployee[]> {
  const res = await api.get<ApiResponse<ActiveSalaryEmployee[]>>(
    "/salary-structure/active-salary-list",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

// ─── POST /api/salary-structure/assign ────────────────────────────────────────
export async function assignSalaryStructure(
  payload: AssignSalaryPayload,
): Promise<SalaryStructure> {
  const res = await api.post<ApiResponse<SalaryStructure>>(
    "/salary-structure/assign",
    payload,
  );
  return (res.data?.data ?? res.data) as SalaryStructure;
}

// ─── GET /api/salary-structure/employee/{employeeId} ─────────────────────────
export async function getEmployeeSalaryStructure(
  employeeId: string,
): Promise<SalaryStructure> {
  const res = await api.get<ApiResponse<SalaryStructure>>(
    `/salary-structure/employee/${employeeId}`,
  );
  return (res.data?.data ?? res.data) as SalaryStructure;
}

// ─── PATCH /api/salary-structure/approve ──────────────────────────────────────
export async function approveSalaryStructures(
  payload: ApproveSalaryStructurePayload,
): Promise<void> {
  // console.log("[approveSalaryStructures] payload:", payload);
  await api.patch("/salary-structure/approve", payload);
}

// ─── PATCH /api/salary-structure/reject/{id} ──────────────────────────────────
export async function rejectSalaryStructure(
  id: string,
  payload: RejectSalaryStructurePayload,
): Promise<void> {
  await api.patch(`/salary-structure/reject/${id}`, payload);
}

// ─── GET /api/salary-structure/pending-salary-list ───────────────────────────
export async function listPendingSalaryStructures(): Promise<
  SalaryStructure[]
> {
  const res = await api.get<ApiResponse<SalaryStructure[]>>(
    "/salary-structure/pending-salary-list",
  );
  // console.log(res);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

// ─── PATCH /api/salary-structure/{id} ────────────────────────────────────────
export async function updateSalaryStructure(
  id: string,
  payload: UpdateSalaryPayload,
): Promise<SalaryStructure> {
  const res = await api.patch<ApiResponse<SalaryStructure>>(
    `/salary-structure/update/${id}`,
    payload,
  );
  return (res.data?.data ?? res.data) as SalaryStructure;
}
