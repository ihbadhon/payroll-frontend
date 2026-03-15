import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  TransactionListResponse,
  TransactionQueryParams,
} from "@/types/transaction";

// ─── GET /api/transaction ─────────────────────────────────────────────────────
export async function listTransactions(
  params: TransactionQueryParams = {},
): Promise<TransactionListResponse> {
  const res = await api.get<ApiResponse<TransactionListResponse>>(
    "/transaction",
    { params },
  );
  return (res.data?.data ?? res.data) as TransactionListResponse;
}
