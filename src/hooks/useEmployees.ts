import {
  activateEmployee,
  createEmployee,
  CreateEmployeePayload,
  deactivateEmployee,
  getEmployeeCount,
  getEmployeeDetails,
  getEmployeesByDepartment,
  searchEmployees,
  updateEmployee,
  UpdateEmployeePayload,
} from "@/services/employee/employee.service";
import {
  listDepartments,
  createDepartment,
  CreateDepartmentPayload,
} from "@/services/department/department.service";
import { listRoles } from "@/services/role/role.service";
import { EmployeeSearchParams } from "@/types/employee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EMPLOYEE_KEYS = {
  all: ["employees"] as const,
  count: ["employees", "count"] as const,
  search: (params: EmployeeSearchParams) =>
    ["employees", "search", params] as const,
  byDepartment: (id: string) => ["employees", "by-department", id] as const,
  detail: (id: string) => ["employees", id] as const,
  departments: ["departments"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useEmployeeCount() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.count,
    queryFn: () => getEmployeeCount(),
  });
}

export function useEmployees(params: EmployeeSearchParams = {}) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.search(params),
    queryFn: () => searchEmployees(params),
  });
}

export function useEmployeesByDepartment(departmentId: string) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.byDepartment(departmentId),
    queryFn: () => getEmployeesByDepartment(departmentId),
    enabled: !!departmentId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDepartments(enabled = true) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.departments,
    queryFn: listDepartments,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoles(enabled = true) {
  return useQuery({
    queryKey: ["roles"],
    queryFn: listRoles,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.departments });
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmployeePayload;
    }) => updateEmployee(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useActivateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => activateEmployee(employeeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeactivateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => deactivateEmployee(employeeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useEmployeeDetails(id: string) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id),
    queryFn: () => getEmployeeDetails(id),
    enabled: !!id,
  });
}
