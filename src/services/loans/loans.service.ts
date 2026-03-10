import api from "@/lib/axios";
import { ApiResponse, PaginatedData } from "@/types/api";
import { Loan } from "@/types/loan";

// ─── Payloads ─────────────────────────────────────────────────────────────────
export interface RequestLoanPayload {
  loanAmount: number;
  totalInstallments: number;
  reason?: string;
}

export interface RejectLoanPayload {
  reason: string;
}

// ─── POST /api/loans/request ──────────────────────────────────────────────────
export async function requestLoan(payload: RequestLoanPayload): Promise<Loan> {
  const res = await api.post<ApiResponse<Loan>>("/loans/request", payload);
  return (res.data?.data ?? res.data) as Loan;
}

// ─── GET /api/loans/my-loans ──────────────────────────────────────────────────
export async function getMyLoans(): Promise<Loan[]> {
  const res = await api.get<ApiResponse<Loan[]>>("/loans/my-loans");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.loans)) return raw.loans;
  // API returned a single loan object directly — wrap it
  if (raw?.id) return [raw as Loan];
  return [];
}

// ─── GET /api/loans/active-loans ─────────────────────────────────────────────
export async function getActiveLoansCount(): Promise<number> {
  const res = await api.get<ApiResponse<number>>("/loans/loan-status-count");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;

  return typeof raw === "number" ? raw : (raw?.count ?? raw?.total ?? 0);
}

// ─── GET /api/loans ───────────────────────────────────────────────────────────
export interface LoanListParams {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
}

export async function listLoans(
  params: LoanListParams = {},
): Promise<PaginatedData<Loan> | Loan[]> {
  const res = await api.get<ApiResponse<PaginatedData<Loan> | Loan[]>>(
    "/loans",
    { params },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return raw;
}

// ─── PATCH /api/loans/{id}/approve ───────────────────────────────────────────
export async function approveLoan(id: string): Promise<Loan> {
  const res = await api.patch<ApiResponse<Loan>>(`/loans/${id}/approve`);
  return (res.data?.data ?? res.data) as Loan;
}

// ─── PATCH /api/loans/{id}/disburse ──────────────────────────────────────────
export async function disburseLoan(id: string): Promise<Loan> {
  const res = await api.patch<ApiResponse<Loan>>(`/loans/disburse/${id}`);
  return (res.data?.data ?? res.data) as Loan;
}

// ─── PATCH /api/loans/{id}/reject ────────────────────────────────────────────
export async function rejectLoan(
  id: string,
  payload: RejectLoanPayload,
): Promise<Loan> {
  const res = await api.patch<ApiResponse<Loan>>(
    `/loans/${id}/reject`,
    payload,
  );
  return (res.data?.data ?? res.data) as Loan;
}

// ─── GET /api/loans/:id ───────────────────────────────────────────────────────
export async function getLoanById(loanId: string): Promise<Loan> {
  const res = await api.get<ApiResponse<Loan>>(`/loans/${loanId}`);
  return (res.data?.data ?? res.data) as Loan;
}

// ─── GET /api/loans/loan-status-count ───────────────────────────────────────
export interface LoanStatusCount {
  active: number;
  activeLoanAmount: number;
  pending: number;
  completed: number;
}

export async function getLoanStatusCount(): Promise<LoanStatusCount> {
  const res = await api.get<ApiResponse<LoanStatusCount>>(
    "/loans/loan-status-count",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return {
    active: raw?.active ?? 0,
    activeLoanAmount: raw?.activeLoanAmount ?? 0,
    pending: raw?.pending ?? 0,
    completed: raw?.completed ?? 0,
  };
}

// ─── GET /api/loans/active-loans (full list) ──────────────────────────────────
export async function getActiveLoans(): Promise<Loan[]> {
  const res = await api.get<ApiResponse<Loan[]>>("/loans/active-loans");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}
