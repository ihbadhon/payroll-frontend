import { EmployeeStatus, EmployeeType } from "./enums";

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
