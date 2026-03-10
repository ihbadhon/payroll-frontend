import { PayrollStatus } from "./enums";

// ─── Employee-level payroll line item ─────────────────────────────────────────
export interface PayrollItem {
  id: string;
  payrollId: string;
  employeeId: string;
  basicSalary: string;
  grossSalary: string;
  totalEarnings: string;
  totalDeductions: string;
  netSalary: string;
  month: number;
  year: number;
  status: PayrollStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Payroll preview (per-employee breakdown before generation) ────────────────
export interface PayrollPreviewItem {
  employeeId: string;
  name: string;
  grossSalary: number;
  //   allowances: number;
  bonuses: number;
  deductions: number;
  loansEmi: number;
  netSalary: number;
}

export interface PayrollPreviewSummary {
  totalEmployees: number;
  totalGrossSalary: number;
  totalBonuses: number;
  totalDeductions: number;
  totalLoanRecovery: number;
  totalNetPayable: number;
}

export interface PayrollPreviewResponse {
  items: PayrollPreviewItem[];
  summary: PayrollPreviewSummary;
}

export interface GeneratePayrollPayload {
  month: number;
  year: number;
  allowFuture?: boolean;
}

export interface PayrollActor {
  id: string;
  name: string;
  email: string;
}

export interface TotalMonthlySalary {
  id: string;
  month: number;
  year: number;
  totalEmployees: number;
  totalAmount: number;
  totalEarnings: number;
  totalDeductions: number;
  status: PayrollStatus;
  generatedBy: PayrollActor;
  generatedAt: string;
  approvedBy: PayrollActor | null;
  approvedAt: string | null;
  paidBy: PayrollActor | null;
  paidAt: string | null;
}

export interface PayrollListParams {
  month?: number;
  year?: number;
  status?: PayrollStatus;
}
