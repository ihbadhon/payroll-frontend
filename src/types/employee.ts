import { EmployeeStatus, EmployeeType } from "./enums";

export type AccountType = "SAVINGS" | "CURRENT" | "SALARY";

export interface BankDetails {
  id: string;
  employeeId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  routingNumber?: string;
  accountType: AccountType;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId: string;
  department: Department;
  designation: string;
  employeeType: EmployeeType;
  joinDate: string;
  resignDate?: string;
  status: EmployeeStatus;
  userId: string;
  bankDetails?: BankDetails | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSearchParams {
  search?: string;
  departmentId?: string;
  designation?: string;
  status?: EmployeeStatus;
  employeeType?: EmployeeType;
  page?: number;
  limit?: number;
}

export interface EmployeeSearchResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}

// ─── Comprehensive employee details (GET /employee/:id/details) ───────────────
export interface EmployeeDetailsProfile {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  designation: string;
  employeeType: EmployeeType;
  status: EmployeeStatus;
  joinDate: string;
  resignDate: string | null;
  departmentId: string;
  userId: string;
}

export interface EmployeeDetailsUserInfo {
  id: string;
  email: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  role: { id: string; name: string };
  lastLogin: string;
}

export interface EmployeeDetailsDepartment {
  id: string;
  name: string;
  description?: string;
}

export interface EmployeeDetailsSalaryStructure {
  id: string;
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  approvedAt: string | null;
}

export interface EmployeeDetailsBankDetails {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
  routingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDetailsEmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string | null;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDetails {
  profile: EmployeeDetailsProfile;
  userInfo: EmployeeDetailsUserInfo;
  department: EmployeeDetailsDepartment;
  currentSalaryStructure: EmployeeDetailsSalaryStructure | null;
  bankDetails: EmployeeDetailsBankDetails | null;
  emergencyContacts: EmployeeDetailsEmergencyContact[];
}
