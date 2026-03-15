import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  Employee,
  EmployeeDetails,
  EmployeeSearchParams,
  EmployeeSearchResponse,
} from "@/types/employee";

// ─── GET /api/employee/count ──────────────────────────────────────────────────
export async function getEmployeeCount(): Promise<number> {
  const res = await api.get<ApiResponse<number>>("/employee/count");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return typeof raw === "number" ? raw : (raw?.count ?? raw?.total ?? 0);
}

// ─── GET /api/employee/search ─────────────────────────────────────────────────
export async function searchEmployees(
  params: EmployeeSearchParams = {},
): Promise<EmployeeSearchResponse> {
  const res = await api.get<ApiResponse<EmployeeSearchResponse>>(
    "/employee/search",
    { params },
  );
  return (res.data?.data ?? res.data) as EmployeeSearchResponse;
}

// ─── GET /api/employee/by-department/:departmentId ───────────────────────────
export async function getEmployeesByDepartment(
  departmentId: string,
): Promise<Employee[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await api.get<ApiResponse<any>>(
    `/employee/by-department/${departmentId}`,
  );
  const raw = res.data?.data ?? res.data;
  return (
    Array.isArray(raw) ? raw : (raw?.data ?? raw?.employees ?? [])
  ) as Employee[];
}

// ─── GET /api/employee/{id} ───────────────────────────────────────────────────
export async function getEmployeeById(id: string): Promise<Employee> {
  const res = await api.get<ApiResponse<Employee>>(`/employee/${id}`);
  return (res.data?.data ?? res.data) as Employee;
}

// ─── GET /api/employee/:id/details ────────────────────────────────────────────
export async function getEmployeeDetails(id: string): Promise<EmployeeDetails> {
  const res = await api.get(`/employee/${id}/details`);
  return (res.data?.data ?? res.data) as EmployeeDetails;
}

// ─── PATCH /api/employee/{id} ─────────────────────────────────────────────────
export type UpdateEmployeePayload = Partial<
  Pick<
    Employee,
    | "phone"
    | "departmentId"
    | "designation"
    | "employeeType"
    | "joinDate"
    | "resignDate"
    | "status"
  >
>;

export async function updateEmployee(
  id: string,
  payload: UpdateEmployeePayload,
): Promise<Employee> {
  const res = await api.patch<ApiResponse<Employee>>(
    `/employee/${id}`,
    payload,
  );
  return (res.data?.data ?? res.data) as Employee;
}

// ─── POST /api/employee/create-employee ───────────────────────────────────────
export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  phone?: string;
  departmentId: string;
  designation: string;
  employeeType: Employee["employeeType"];
  joinDate: string;
  roleId: string;
}

export async function createEmployee(
  payload: CreateEmployeePayload,
): Promise<Employee> {
  const res = await api.post<ApiResponse<Employee>>(
    "/employee/create-employee",
    payload,
  );
  return (res.data?.data ?? res.data) as Employee;
}

// ─── POST /api/employee/activate-employee ────────────────────────────────────
export async function activateEmployee(employeeId: string): Promise<Employee> {
  const res = await api.post<ApiResponse<Employee>>(
    "/employee/activate-employee",
    { employeeId },
  );
  return (res.data?.data ?? res.data) as Employee;
}

// ─── POST /api/employee/deactive-employee ────────────────────────────────────
export async function deactivateEmployee(
  employeeId: string,
): Promise<Employee> {
  const res = await api.post<ApiResponse<Employee>>(
    "/employee/deactive-employee",
    { employeeId },
  );
  return (res.data?.data ?? res.data) as Employee;
}
