import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface Role {
  id: string;
  name: string;
  permissions: string[] | null;
}

// ─── GET /api/roles ───────────────────────────────────────────────────────────
export async function listRoles(): Promise<Role[]> {
  const res = await api.get<ApiResponse<Role[]>>("user/roles");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (res.data?.data ?? res.data) as any;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? []);
}
