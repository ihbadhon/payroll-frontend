import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Bonus } from "@/types/bonus";
import { MySalaryData, MyPayslipItem } from "@/types/salary-structure";
import { Employee } from "@/types/employee";
import { parseDecimal } from "@/utils/format";

// ─── GET /api/employee/me ─────────────────────────────────────────────────────
export async function getMyEmployeeProfile(): Promise<Employee> {
  const res = await api.get<ApiResponse<Employee>>("/employee/me");
  return (res.data?.data ?? res.data) as Employee;
}

// ─── GET /api/salary-structure/my-salary ──────────────────────────────────────
export async function getMyActiveSalary(): Promise<MySalaryData | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await api.get<ApiResponse<any>>("/salary-structure/my-salary");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (res.data?.data ?? res.data) as any;
    if (!raw?.id) return null;

    // Parse Decimal.js { s, e, d } objects into plain numbers
    const data: MySalaryData = {
      id: raw.id,
      employeeId: raw.employeeId,
      grossSalary: parseDecimal(raw.grossSalary),
      totalEarnings: parseDecimal(raw.totalEarnings),
      totalDeductions: parseDecimal(raw.totalDeductions),
      effectiveFrom: raw.effectiveFrom,
      effectiveTo: raw.effectiveTo ?? null,
      isActive: raw.isActive ?? false,
      status: raw.status,
      approvedById: raw.approvedById ?? undefined,
      approvedAt: raw.approvedAt ?? undefined,
      rejectionReason: raw.rejectionReason ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      components: (raw.components ?? []).map(
        (c: { title: string; value: unknown; amount: unknown }) => ({
          title: c.title,
          value: parseDecimal(c.value),
          amount: parseDecimal(c.amount),
        }),
      ),
      currentMonthBonuses: (raw.currentMonthBonuses ?? []).map(
        (b: {
          id: string;
          bonusType: string;
          amount: unknown;
          reason?: string;
          month: number;
          year: number;
        }) => ({
          id: b.id,
          bonusType: b.bonusType,
          amount: parseDecimal(b.amount),
          reason: b.reason,
          month: b.month,
          year: b.year,
        }),
      ),
      totalBonusAmount: raw.totalBonusAmount ?? 0,
      activeLoan: raw.activeLoan
        ? {
            id: raw.activeLoan.id,
            loanAmount: parseDecimal(raw.activeLoan.loanAmount),
            monthlyInstallment: parseDecimal(raw.activeLoan.monthlyInstallment),
            totalInstallments: raw.activeLoan.totalInstallments,
            paidInstallments: raw.activeLoan.paidInstallments,
            remainingBalance: parseDecimal(raw.activeLoan.remainingBalance),
            status: raw.activeLoan.status,
            nextInstallment: raw.activeLoan.nextInstallment
              ? {
                  installmentNo: raw.activeLoan.nextInstallment.installmentNo,
                  amount: parseDecimal(raw.activeLoan.nextInstallment.amount),
                  dueDate: raw.activeLoan.nextInstallment.dueDate,
                }
              : undefined,
          }
        : null,
      loanDeduction: raw.loanDeduction ?? 0,
      effectiveNetSalary: raw.effectiveNetSalary ?? 0,
    };
    return data;
  } catch {
    return null;
  }
}

// ─── GET /api/bonus/my-bonuses ────────────────────────────────────────────────
export async function getMyBonuses(): Promise<Bonus[]> {
  const res = await api.get<ApiResponse<Bonus[]>>("/bonus/my-bonuses");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}

// ─── GET /api/user/my-payslips ───────────────────────────────────────────────
export async function getMyPayslips(): Promise<MyPayslipItem[]> {
  try {
    console.log("[getMyPayslips] calling /user/my-payslips");
    const res =
      await api.get<
        ApiResponse<{ employeeId: string; salaryStructures: MyPayslipItem[] }>
      >("/user/my-payslips");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (res.data?.data ?? res.data) as any;
    console.log("[getMyPayslips] raw response:", raw);

    const items =
      raw?.salaryStructures ?? raw?.payslips ?? raw?.data ?? raw?.items ?? [];
    console.log("[getMyPayslips] extracted items:", items);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error("[getMyPayslips] error:", err);
    throw err;
  }
}

// ─── GET /api/user/my/download/{payrollItemId} ──────────────────────────────
export async function downloadMyPayslip(payrollItemId: string): Promise<Blob> {
  try {
    const res = await api.get(`/payslips/my/download/${payrollItemId}`, {
      responseType: "blob",
    });
    return res.data as Blob;
  } catch {
    // Backward-compatible fallback in case backend still exposes the user route
    const res = await api.get(`/user/my/download/${payrollItemId}`, {
      responseType: "blob",
    });
    return res.data as Blob;
  }
}
