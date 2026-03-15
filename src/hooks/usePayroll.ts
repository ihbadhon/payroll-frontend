import {
  approvePayroll,
  exportPayrollCsv,
  generatePayroll,
  generatePayslips,
  getPayrollById,
  getPayrollItems,
  getPayrollPreview,
  listPayrolls,
  markPayrollPaid,
  markSingleEmployeePaid,
  revokePayrollApproval,
} from "@/services/payroll/payroll.service";
import {
  GeneratePayrollPayload,
  PayrollListParams,
  SingleEmployeePaymentPayload,
  TransactionEntry,
} from "@/types/payroll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PAYROLL_KEYS = {
  all: ["payroll"] as const,
  list: (params: PayrollListParams) => ["payroll", "list", params] as const,
  preview: (month: number, year: number) =>
    ["payroll", "preview", month, year] as const,
  detail: (id: string) => ["payroll", id] as const,
  items: (id: string) => ["payroll", id, "items"] as const,
};

export function usePayrolls(params: PayrollListParams = {}) {
  return useQuery({
    queryKey: PAYROLL_KEYS.list(params),
    queryFn: () => listPayrolls(params),
  });
}

export function usePayrollPreview(
  params: { month: number; year: number },
  enabled = false,
) {
  return useQuery({
    queryKey: PAYROLL_KEYS.preview(params.month, params.year),
    queryFn: () => getPayrollPreview(params),
    enabled,
  });
}

export function useGeneratePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeneratePayrollPayload) => generatePayroll(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
    },
  });
}

export function useApprovePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvePayroll(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
    },
  });
}

export function useMarkPayrollPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      transactions,
    }: {
      id: string;
      transactions?: TransactionEntry[];
    }) => markPayrollPaid(id, transactions),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
    },
  });
}

export function useMarkSingleEmployeePaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      employeeUUID,
      payload,
    }: {
      employeeUUID: string;
      payload: SingleEmployeePaymentPayload;
    }) => markSingleEmployeePaid(employeeUUID, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
    },
  });
}

export function usePayrollById(payrollId: string) {
  return useQuery({
    queryKey: PAYROLL_KEYS.detail(payrollId),
    queryFn: () => getPayrollById(payrollId),
    enabled: !!payrollId,
  });
}

export function usePayrollItems(payrollId: string) {
  return useQuery({
    queryKey: PAYROLL_KEYS.items(payrollId),
    queryFn: () => getPayrollItems(payrollId),
    enabled: !!payrollId,
  });
}

export function useRevokePayrollApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokePayrollApproval(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
    },
  });
}

export function useGeneratePayslips() {
  return useMutation({
    mutationFn: (payrollId: string) => generatePayslips(payrollId),
  });
}

export function useExportPayrollCsv() {
  return useMutation({
    mutationFn: (payrollId: string) => exportPayrollCsv(payrollId),
  });
}
