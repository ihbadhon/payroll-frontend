import { useQuery } from "@tanstack/react-query";
import { listTransactions } from "@/services/transaction/transaction.service";
import { TransactionQueryParams } from "@/types/transaction";

export const TRANSACTION_KEYS = {
  all: ["transactions"] as const,
  list: (params: TransactionQueryParams) =>
    ["transactions", "list", params] as const,
};

export function useTransactions(params: TransactionQueryParams = {}) {
  return useQuery({
    queryKey: TRANSACTION_KEYS.list(params),
    queryFn: () => listTransactions(params),
  });
}
