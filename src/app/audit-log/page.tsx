"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import {
  useAuditLogs,
  useAuditLogDetail,
  useExportAuditLogsCsv,
} from "@/hooks/useAuditLogs";
import { AuditLogQueryParams } from "@/types/audit-log";
import { formatDate } from "@/utils/format";
import {
  Search,
  Filter,
  Download,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  FileText,
  Activity,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/store/auth.context";
import { ROLES } from "@/config/permissions";
import toast from "react-hot-toast";

const MODULES = [
  "EMPLOYEE",
  "SALARY",
  "BONUS",
  "PAYROLL",
  "LOAN",
  "DEPARTMENT",
  "ROLE",
  "USER",
];

const ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "APPROVE",
  "REJECT",
  "GENERATE",
  "EXPORT",
];

export default function AuditLogPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.name === ROLES.SUPER_ADMIN;

  const [filters, setFilters] = useState<AuditLogQueryParams>({
    page: 1,
    limit: 20,
    search: "",
    module: "",
    action: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] =
    useState<AuditLogQueryParams>(filters);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { data, isLoading } = useAuditLogs(appliedFilters);
  const { data: logDetail, isLoading: detailLoading } =
    useAuditLogDetail(selectedLogId);
  const { mutateAsync: exportCsv, isPending: exporting } =
    useExportAuditLogsCsv();

  // Redirect if not super admin
  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Only Super Admins can access audit logs
          </p>
        </div>
      </div>
    );
  }

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters, page: 1 });
  };

  const handleResetFilters = () => {
    const reset: AuditLogQueryParams = {
      page: 1,
      limit: 20,
      search: "",
      module: "",
      action: "",
      userId: "",
      startDate: "",
      endDate: "",
    };
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const handleExportCsv = async () => {
    try {
      const blob = await exportCsv(appliedFilters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Audit logs exported successfully");
    } catch (error) {
      toast.error("Failed to export audit logs");
    }
  };

  const handlePageChange = (newPage: number) => {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities across payroll modules"
      />

      {/* Filters Card */}
      <div className="card space-y-4 p-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search user / record id / description..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* User Filter */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              User
            </label>
            <select
              value={filters.userId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, userId: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
            </select>
          </div>

          {/* Module Filter */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Module
            </label>
            <select
              value={filters.module}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, module: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              {MODULES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, action: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              {ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800 dark:text-white"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={handleApplyFilters} variant="primary">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
            <Button onClick={handleResetFilters} variant="secondary">
              Reset
            </Button>
          </div>
          <Button
            onClick={handleExportCsv}
            variant="secondary"
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !data?.logs || data.logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Activity className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              No audit logs found
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            <TableRoot>
              <TableHeader className="bg-gray-50 dark:bg-dark-3">
                <TableRow>
                  <TableHead className="uppercase">Time</TableHead>
                  <TableHead className="uppercase">User</TableHead>
                  <TableHead className="uppercase">Module</TableHead>
                  <TableHead className="uppercase">Action</TableHead>
                  <TableHead className="uppercase">Description</TableHead>
                  <TableHead className="text-center uppercase">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                  >
                    <TableCell className="whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-400">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                      ,{" "}
                      {new Date(log.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {log.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {log.module}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600 dark:text-gray-400">
                      {log.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => setSelectedLogId(log.id)}
                        className="inline-flex rounded-lg p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-dark-3 dark:hover:text-primary"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableRoot>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-dark-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {(data.page - 1) * data.limit + 1}–
                  {Math.min(data.page * data.limit, data.total)} of {data.total}{" "}
                  entries
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={data.page === 1}
                    className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-dark-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {data.page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={data.page === data.totalPages}
                    className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-dark-3"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedLogId && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedLogId(null)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white  dark:bg-dark-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-dark-3 dark:bg-dark-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Audit Log Details
              </h3>
              <button
                onClick={() => setSelectedLogId(null)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="space-y-6 p-6">
              {detailLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : logDetail ? (
                <>
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          User
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {logDetail.user.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {logDetail.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Timestamp
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(logDetail.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Activity className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Action
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                            {logDetail.module}
                          </span>
                          <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                            {logDetail.action}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Record ID
                        </p>
                        <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                          {logDetail.recordId}
                        </p>
                      </div>
                    </div>

                    {logDetail.description && (
                      <div>
                        <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">
                          Description
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {logDetail.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Old Value */}
                  {logDetail.oldValue && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                        Previous State
                      </h4>
                      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-800 dark:bg-dark-3 dark:text-gray-300">
                        {JSON.stringify(logDetail.oldValue, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* New Value */}
                  {logDetail.newValue && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                        New State
                      </h4>
                      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-800 dark:bg-dark-3 dark:text-gray-300">
                        {JSON.stringify(logDetail.newValue, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  Failed to load details
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
