import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  GeneratePayrollPayload,
  PayrollItem,
  PayrollListParams,
  PayrollPreviewResponse,
  TotalMonthlySalary,
} from "@/types/payroll";

// ─── GET /api/payroll-processing/preview ─────────────────────────────────────────
export async function getPayrollPreview(
  params: Pick<GeneratePayrollPayload, "month" | "year">,
): Promise<PayrollPreviewResponse> {
  const res = await api.get<ApiResponse<PayrollPreviewResponse>>(
    "/payroll-processing/preview",
    { params },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;

  // Extract items from nested data structure
  const rawItems = raw?.data ?? (Array.isArray(raw) ? raw : []);
  console.log(rawItems);

  // Map items to ensure proper field names
  const items = (Array.isArray(rawItems) ? rawItems : []).map((item: any) => ({
    employeeId: item.employeeId,
    name: item.name,
    grossSalary:
      typeof item.grossSalary === "string"
        ? parseFloat(item.grossSalary)
        : item.grossSalary,
    bonuses:
      typeof item.bonuses === "string"
        ? parseFloat(item.bonuses)
        : item.bonuses,
    deductions:
      typeof item.deductions === "string"
        ? parseFloat(item.deductions)
        : item.deductions,
    loansEmi:
      typeof item.loansEmi === "string"
        ? parseFloat(item.loansEmi)
        : item.loansEmi,
    netSalary:
      typeof item.netSalary === "string"
        ? parseFloat(item.netSalary)
        : item.netSalary,
  }));

  return {
    items,
    summary: raw?.summary ?? {
      totalEmployees: 0,
      totalGrossSalary: 0,
      totalBonuses: 0,
      totalDeductions: 0,
      totalLoanRecovery: 0,
      totalNetPayable: 0,
    },
  };
}

// ─── POST /api/payroll-processing/generate ───────────────────────────────────
export async function generatePayroll(
  payload: GeneratePayrollPayload,
): Promise<TotalMonthlySalary> {
  const res = await api.post<ApiResponse<TotalMonthlySalary>>(
    "/payroll-processing/generate",
    {},
    { params: payload },
  );
  console.log(res);

  return (res.data?.data ?? res.data) as TotalMonthlySalary;
}

// ─── PATCH /api/payroll-processing/{id}/regenerate ───────────────────────────
export async function regeneratePayroll(
  id: string,
): Promise<TotalMonthlySalary> {
  const res = await api.patch<ApiResponse<TotalMonthlySalary>>(
    `/payroll-processing/${id}/regenerate`,
  );
  return (res.data?.data ?? res.data) as TotalMonthlySalary;
}

// ─── GET /api/reports/detail ─────────────────────────────────────────────────
export async function listPayrolls(
  params: PayrollListParams = {},
): Promise<TotalMonthlySalary[]> {
  const res = await api.get<ApiResponse<TotalMonthlySalary[]>>(
    "payroll-processing/reports/detail",
    { params },
  );
  // Response shape: { success, data: { meta: {...}, data: [...] } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outer = (res.data?.data ?? res.data) as any;
  const list = outer?.data ?? outer;
  return Array.isArray(list) ? list : [];
}

// ─── GET /api/payroll-processing/{id} ────────────────────────────────────────
export async function getPayrollById(id: string): Promise<TotalMonthlySalary> {
  const res = await api.get<ApiResponse<TotalMonthlySalary>>(
    `/payroll-processing/${id}`,
  );
  return (res.data?.data ?? res.data) as TotalMonthlySalary;
}

// ─── PATCH /api/payroll-processing/{id}/approve ──────────────────────────────
export async function approvePayroll(id: string): Promise<TotalMonthlySalary> {
  const res = await api.patch<ApiResponse<TotalMonthlySalary>>(
    `/payroll-processing/${id}/approve`,
  );
  return (res.data?.data ?? res.data) as TotalMonthlySalary;
}

// ─── PATCH /api/payroll-processing/{id}/revoke-approval ──────────────────────
export async function revokePayrollApproval(
  id: string,
): Promise<TotalMonthlySalary> {
  const res = await api.patch<ApiResponse<TotalMonthlySalary>>(
    `/payroll-processing/${id}/revoke-approval`,
  );
  return (res.data?.data ?? res.data) as TotalMonthlySalary;
}

// ─── PATCH /api/payroll-processing/{id}/mark-paid ────────────────────────────
export async function markPayrollPaid(id: string): Promise<TotalMonthlySalary> {
  const res = await api.patch<ApiResponse<TotalMonthlySalary>>(
    `/payroll-processing/${id}/mark-paid`,
  );
  return (res.data?.data ?? res.data) as TotalMonthlySalary;
}

// ─── POST /api/payslips/generate/{payrollId} ────────────────────────────────
export async function generatePayslips(payrollId: string): Promise<void> {
  await api.post(`/payslips/generate/${payrollId}`);
}

// ─── GET /api/payroll-processing/employee/{employeeId}/item ──────────────────
export async function getEmployeePayrollItems(
  employeeId: string,
): Promise<PayrollItem[]> {
  const res = await api.get<ApiResponse<PayrollItem[]>>(
    `/payroll-processing/employee/${employeeId}/item`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}
