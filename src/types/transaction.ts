// ─── Transaction types ────────────────────────────────────────────────────────

export type TransactionType = "SALARY" | "BONUS" | "LOAN" | string;
export type PaymentMethod =
  | "cash"
  | "bank"
  | "bkash"
  | "nagad"
  | "card"
  | string;

export interface TransactionEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  department: {
    id: string;
    name: string;
  };
}

export interface TransactionCreatedBy {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  referenceId: string;
  referenceType: string;
  description: string | null;
  bankTransactionId: string | null;
  paymentMethod: PaymentMethod;
  transactionAt: string;
  balanceBefore: number | null;
  balanceAfter: number | null;
  employee: TransactionEmployee;
  createdBy: TransactionCreatedBy;
  createdAt: string;
}

export interface TransactionSummaryItem {
  type: TransactionType;
  count: number;
  totalAmount: number;
}

export interface TransactionMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionListResponse {
  data: Transaction[];
  summary: TransactionSummaryItem[];
  meta: TransactionMeta;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  search?: string;
  startDate?: string;
  endDate?: string;
}
