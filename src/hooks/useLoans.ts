import {
  approveLoan,
  disburseLoan,
  getActiveLoans,
  getActiveLoansCount,
  getLoanById,
  getLoanStatusCount,
  listLoans,
  LoanListParams,
  rejectLoan,
  RejectLoanPayload,
  requestLoan,
  RequestLoanPayload,
} from "@/services/loans/loans.service";
import { Loan } from "@/types/loan";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const LOAN_KEYS = {
  all: ["loans"] as const,
  myLoans: ["loans", "my-loans"] as const,
  activeCount: ["loans", "active-count"] as const,
  activeList: ["loans", "active-list"] as const,
  statusCount: ["loans", "status-count"] as const,
  list: (params: LoanListParams) => ["loans", "list", params] as const,
  detail: (id: string) => ["loans", "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useActiveLoansCount() {
  return useQuery({
    queryKey: LOAN_KEYS.activeCount,
    queryFn: getActiveLoansCount,
  });
}

export function useLoans(params: LoanListParams = {}) {
  return useQuery({
    queryKey: LOAN_KEYS.list(params),
    queryFn: () => listLoans(params),
    select: (raw): Loan[] => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = raw as any;
      if (Array.isArray(r)) return r;
      if (Array.isArray(r?.data)) return r.data;
      if (Array.isArray(r?.items)) return r.items;
      if (Array.isArray(r?.loans)) return r.loans;
      if (Array.isArray(r?.results)) return r.results;
      if (r?.id) return [r as Loan];
      return [];
    },
  });
}

export function useActiveLoans() {
  return useQuery({
    queryKey: LOAN_KEYS.activeList,
    queryFn: getActiveLoans,
  });
}

export function useLoanStatusCount() {
  return useQuery({
    queryKey: LOAN_KEYS.statusCount,
    queryFn: getLoanStatusCount,
  });
}

export function useLoanDetail(loanId: string | null) {
  return useQuery({
    queryKey: LOAN_KEYS.detail(loanId ?? ""),
    queryFn: () => getLoanById(loanId!),
    enabled: !!loanId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useApproveLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveLoan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOAN_KEYS.all });
    },
  });
}

export function useRejectLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectLoanPayload }) =>
      rejectLoan(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOAN_KEYS.all });
    },
  });
}

export function useRequestLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestLoanPayload) => requestLoan(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOAN_KEYS.all });
      qc.invalidateQueries({ queryKey: LOAN_KEYS.myLoans });
    },
  });
}

export function useDisburseLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disburseLoan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOAN_KEYS.all });
    },
  });
}
