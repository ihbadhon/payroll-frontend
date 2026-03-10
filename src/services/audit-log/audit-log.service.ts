import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  AuditLog,
  AuditLogListResponse,
  AuditLogQueryParams,
  AuditLogDetail,
} from "@/types/audit-log";

// ─── GET /api/audit-logs ──────────────────────────────────────────────────────
export async function getAuditLogs(
  params: AuditLogQueryParams,
): Promise<AuditLogListResponse> {
  const res = await api.get<ApiResponse<AuditLogListResponse>>("/audit-logs", {
    params,
  });
  return res.data.data ?? res.data;
}

// ─── GET /api/audit-logs/:id ──────────────────────────────────────────────────
export async function getAuditLogDetail(id: string): Promise<AuditLogDetail> {
  const res = await api.get<ApiResponse<AuditLogDetail>>(`/audit-logs/${id}`);
  return res.data.data ?? res.data;
}

// ─── GET /api/audit-logs/export/csv ───────────────────────────────────────────
export async function exportAuditLogsCsv(
  params: AuditLogQueryParams,
): Promise<Blob> {
  const res = await api.get("/audit-logs/export/csv", {
    params,
    responseType: "blob",
  });
  return res.data;
}

// ─── GET /api/audit-logs/record/{recordId} ────────────────────────────────────
export async function getAuditLogsByRecord(
  recordId: string,
): Promise<AuditLog[]> {
  const res = await api.get<ApiResponse<AuditLog[]>>(
    `/audit-logs/record/${recordId}`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}

// ─── GET /api/audit-logs/user/{userId} ───────────────────────────────────────
export async function getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
  const res = await api.get<ApiResponse<AuditLog[]>>(
    `/audit-logs/user/${userId}`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}
