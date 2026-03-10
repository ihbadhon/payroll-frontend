export interface AuditLog {
  id: string;
  action: string;
  module: string;
  recordId: string;
  description: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuditLogListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  logs: AuditLog[];
}

export interface AuditLogQueryParams {
  search?: string;
  userId?: string;
  module?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogDetail extends AuditLog {
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
}
