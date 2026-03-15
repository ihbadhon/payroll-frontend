import {
  approveSalaryStructures,
  assignSalaryStructure,
  getUnassignedEmployees,
  getSalaryHistory,
  listSalaryStructures,
  listPendingSalaryStructures,
  rejectSalaryStructure,
  updateSalaryStructure,
} from "@/services/salary-structure/salary-structure.service";
import {
  ApproveSalaryStructurePayload,
  AssignSalaryPayload,
  RejectSalaryStructurePayload,
  UpdateSalaryPayload,
} from "@/types/salary-structure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SALARY_STRUCTURE_KEYS = {
  all: ["salary-structure"] as const,
  list: ["salary-structure", "list"] as const,
  pending: ["salary-structure", "pending"] as const,
  unassigned: ["salary-structure", "unassigned"] as const,
  history: (employeeId: string) =>
    ["salary-structure", "history", employeeId] as const,
};

export function useSalaryHistory(employeeId: string | null) {
  return useQuery({
    queryKey: SALARY_STRUCTURE_KEYS.history(employeeId ?? ""),
    queryFn: () => getSalaryHistory(employeeId!),
    enabled: !!employeeId,
  });
}

export function useUnassignedEmployees() {
  return useQuery({
    queryKey: SALARY_STRUCTURE_KEYS.unassigned,
    queryFn: getUnassignedEmployees,
  });
}

export function useSalaryStructures() {
  return useQuery({
    queryKey: SALARY_STRUCTURE_KEYS.list,
    queryFn: listSalaryStructures,
  });
}

export function useAssignSalary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignSalaryPayload) =>
      assignSalaryStructure(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALARY_STRUCTURE_KEYS.all });
    },
  });
}

export function useApproveSalaryStructures() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApproveSalaryStructurePayload) =>
      approveSalaryStructures(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALARY_STRUCTURE_KEYS.all });
    },
  });
}

export function useRejectSalaryStructure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RejectSalaryStructurePayload;
    }) => rejectSalaryStructure(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALARY_STRUCTURE_KEYS.all });
    },
  });
}

export function usePendingSalaryStructures() {
  return useQuery({
    queryKey: SALARY_STRUCTURE_KEYS.pending,
    queryFn: listPendingSalaryStructures,
  });
}

export function useUpdateSalaryStructure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSalaryPayload;
    }) => updateSalaryStructure(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALARY_STRUCTURE_KEYS.all });
    },
  });
}
