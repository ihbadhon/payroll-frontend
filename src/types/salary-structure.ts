import {
  CalculationBase,
  CalculationType,
  ComponentType,
  PayrollStatus,
  SalaryStructureStatus,
} from "./enums";

export interface SalaryComponent {
  id: string;
  name: string;
  type: ComponentType;
  calculationType: CalculationType;
  calculationBase?: CalculationBase;
  value: string;
  isActive: boolean;
}

export interface SalaryStructure {
  id: string;
  employeeId: string;
  /** Included by the API on list endpoints via employee join */
  fullName?: string;
  basicSalary: string;
  grossSalary: string;
  status: SalaryStructureStatus;
  components: SalaryComponent[];
  approvedById?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── My Salary (employee self-service) ───────────────────────────────────────

export interface MySalaryComponent {
  title: string;
  value: number; // percentage
  amount: number; // calculated BDT amount
}

export interface MySalaryBonus {
  id: string;
  bonusType: string;
  amount: number;
  reason?: string;
  month: number;
  year: number;
}

export interface MySalaryNextInstallment {
  installmentNo: number;
  amount: number;
  dueDate: string;
}

export interface MySalaryActiveLoan {
  id: string;
  loanAmount: number;
  monthlyInstallment: number;
  totalInstallments: number;
  paidInstallments: number;
  remainingBalance: number;
  status: string;
  nextInstallment?: MySalaryNextInstallment;
}

export interface MySalaryData {
  id: string;
  employeeId: string;
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  status: SalaryStructureStatus;
  approvedById?: string;
  approvedAt?: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  components: MySalaryComponent[];
  currentMonthBonuses: MySalaryBonus[];
  totalBonusAmount: number;
  activeLoan: MySalaryActiveLoan | null;
  loanDeduction: number;
  effectiveNetSalary: number;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface MyPayslipItem {
  id: string;
  grossSalary: number;
  basicSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  bonusAmount: number;
  loanDeduction: number;
  netSalary: number;
  earningsBreakdown: Record<string, number>;
  deductionsBreakdown: Record<string, number>;
  status: PayrollStatus;
  payroll: {
    month: number;
    year: number;
    status: PayrollStatus;
  };
  createdAt: string;
}

export interface MyPayslipsResponse {
  employeeId: string;
  salaryStructures: MyPayslipItem[];
}

export interface AssignSalaryPayload {
  employeeId: string;
  grossSalary: number;
  effectiveFrom: string; // ISO 8601 date string, e.g., '2026-03-01'
}

export interface UpdateSalaryPayload {
  grossSalary: number;
}

export interface ApproveSalaryStructurePayload {
  /** One or many pending salary-structure IDs to approve */
  structureIds: string[];
}

export interface RejectSalaryStructurePayload {
  reason: string;
}

// ─── Active Salary List ───────────────────────────────────────────────────────
export interface ActiveSalaryEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  email: string;
  phone?: string;
  departmentId: string;
  employeeType: string;
  joinDate: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  salaryStructures: Array<{
    id: string;
    grossSalary: string;
  }>;
  department: {
    name: string;
  };
}
