import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAuditLogs,
  getAuditLogDetail,
  exportAuditLogsCsv,
} from "@/services/audit-log/audit-log.service";
import { AuditLogQueryParams } from "@/types/audit-log";

export function useAuditLogs(params: AuditLogQueryParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
}

export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: ["audit-log-detail", id],
    queryFn: () => getAuditLogDetail(id!),
    enabled: !!id,
  });
}

export function useExportAuditLogsCsv() {
  return useMutation({
    mutationFn: (params: AuditLogQueryParams) => exportAuditLogsCsv(params),
  });
}
