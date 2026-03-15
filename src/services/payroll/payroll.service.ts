import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  GeneratePayrollPayload,
  MarkPaidEmployee,
  MarkPaidResponse,
  PayrollItem,
  PayrollListParams,
  PayrollPreviewResponse,
  SingleEmployeePaymentPayload,
  SingleEmployeePaymentResponse,
  TransactionEntry,
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

  type RawPreviewItem = {
    employeeId: string;
    name: string;
    grossSalary: number | string;
    bonuses: number | string;
    deductions: number | string;
    loansEmi: number | string;
    netSalary: number | string;
  };

  // Map items to ensure proper field names
  const items = (Array.isArray(rawItems) ? rawItems : []).map((item) => {
    const row = item as RawPreviewItem;

    return {
      employeeId: row.employeeId,
      name: row.name,
      grossSalary:
        typeof row.grossSalary === "string"
          ? parseFloat(row.grossSalary)
          : row.grossSalary,
      bonuses:
        typeof row.bonuses === "string" ? parseFloat(row.bonuses) : row.bonuses,
      deductions:
        typeof row.deductions === "string"
          ? parseFloat(row.deductions)
          : row.deductions,
      loansEmi:
        typeof row.loansEmi === "string"
          ? parseFloat(row.loansEmi)
          : row.loansEmi,
      netSalary:
        typeof row.netSalary === "string"
          ? parseFloat(row.netSalary)
          : row.netSalary,
    };
  });

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

// ─── GET /api/payroll-processing/{id}/transfer ────────────────────────────────────
export async function getPayrollItems(
  payrollId: string,
): Promise<MarkPaidEmployee[]> {
  const res = await api.get(`/payroll-processing/${payrollId}/transfer`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}

// ─── PATCH /api/payroll-processing/{id}/transfer ────────────────────────────────
export async function markPayrollPaid(
  id: string,
  transactions?: TransactionEntry[],
): Promise<MarkPaidResponse> {
  const res = await api.patch<ApiResponse<MarkPaidResponse> | MarkPaidResponse>(
    `/payroll-processing/${id}/transfer`,
    transactions?.length ? { transactions } : {},
  );

  // Support both raw payload and global API envelope shapes.
  const payload = res.data as ApiResponse<MarkPaidResponse> | MarkPaidResponse;
  const normalized =
    payload &&
    typeof payload === "object" &&
    "statusCode" in payload &&
    "data" in payload
      ? (payload as ApiResponse<MarkPaidResponse>).data
      : (payload as MarkPaidResponse);

  return normalized;
}

// ─── PATCH /api/payroll-processing/paid/single-employee/{employeeUUID} ───────────
export async function markSingleEmployeePaid(
  employeeUUID: string,
  payload: SingleEmployeePaymentPayload,
): Promise<SingleEmployeePaymentResponse> {
  const res = await api.patch<
    ApiResponse<SingleEmployeePaymentResponse> | SingleEmployeePaymentResponse
  >(`/payroll-processing/paid/single-employee/${employeeUUID}`, payload);

  const body = res.data as
    | ApiResponse<SingleEmployeePaymentResponse>
    | SingleEmployeePaymentResponse;

  if (
    body &&
    typeof body === "object" &&
    "statusCode" in body &&
    "data" in body
  ) {
    return {
      success: body.success,
      message: body.message,
      data: body.data,
    };
  }

  return body;
}

// ─── POST /api/payslips/generate/{payrollId} ────────────────────────────────
export async function generatePayslips(payrollId: string): Promise<void> {
  await api.post(`/payslips/generate/${payrollId}`);
}

// ─── GET /api/payroll-processing/export/csv/{payrollId} ──────────────────────
export async function exportPayrollCsv(payrollId: string): Promise<Blob> {
  const res = await api.get(`/payslips/export/csv/${payrollId}`, {
    responseType: "blob",
  });
  return res.data;
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
