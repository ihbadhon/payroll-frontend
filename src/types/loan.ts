import { InstallmentStatus, LoanStatus } from "./enums";

export interface LoanEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  department?: { name: string };
}

export interface LoanInstallment {
  id: string;
  installmentNo: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: InstallmentStatus;
  loanId: string;
}

export interface Loan {
  id: string;
  loanAmount: number;
  monthlyInstallment: number;
  totalInstallments: number;
  paidInstallments: number;
  remainingBalance: number;
  issueDate: string;
  status: LoanStatus;
  rejectionReason?: string;
  approvedById?: string;
  approvedAt?: string;
  employeeId: string;
  employee?: LoanEmployee;
  installments: LoanInstallment[];
  createdAt: string;
  updatedAt: string;
}
