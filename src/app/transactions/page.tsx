"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { TransactionQueryParams, TransactionType } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils/format";
import { useAuth } from "@/store/auth.context";
import { getUserRoleName } from "@/utils/auth-role";
import { ROLES } from "@/config/permissions";
import {
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
  ArrowRightLeft,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LIMIT = 20;

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank: "Bank",
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card",
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  cash: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  bank: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  bkash: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  nagad:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  card: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

const TRANSACTION_TYPE_COLORS: Record<string, string> = {
  SALARY: "bg-primary/10 text-primary",
  BONUS: "bg-success-light text-success",
  LOAN: "bg-warning-light text-warning",
};

// ─── Payment Method Icon ──────────────────────────────────────────────────────
function PaymentMethodBadge({ method }: { method: string }) {
  const label = PAYMENT_METHOD_LABELS[method] ?? method;
  const cls =
    PAYMENT_METHOD_COLORS[method] ??
    "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-gray-400";
  const Icon = method === "bank" || method === "card" ? CreditCard : Banknote;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Transaction Type Badge ───────────────────────────────────────────────────
function TransactionTypeBadge({ type }: { type: string }) {
  const cls =
    TRANSACTION_TYPE_COLORS[type] ??
    "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-gray-400";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {type}
    </span>
  );
}

// ─── Summary Tile ─────────────────────────────────────────────────────────────
function SummaryTile({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-5 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <ArrowUpRight className="h-3 w-3" />
          {count} txn{count !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-lg font-bold text-dark dark:text-white">
          {formatCurrency(total)}
        </p>
        <p className="mt-0.5 text-xs font-medium text-dark-4 dark:text-dark-6">
          {label} transactions
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────
function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Filter select ────────────────────────────────────────────────────────────
const selectCls =
  "rounded-xl border border-stroke bg-gray-50 px-3 py-2.5 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [methodFilter, setMethodFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(""); // "YYYY-MM"
  const [startDate, setStartDate] = useState(""); // "YYYY-MM-DD"
  const [endDate, setEndDate] = useState(""); // "YYYY-MM-DD"

  const roleName = getUserRoleName(user);
  const isAdmin = roleName === ROLES.SUPER_ADMIN || roleName === ROLES.HR;
  const isFinance = roleName === ROLES.FINANCE;

  const params: TransactionQueryParams = {
    page,
    limit: LIMIT,
    ...(search ? { search } : {}),
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(methodFilter ? { paymentMethod: methodFilter } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  };

  const { data, isLoading } = useTransactions(params);

  if (!isAdmin && !isFinance) {
    router.replace("/unauthorized");
    return null;
  }

  const transactions = data?.data ?? [];
  const summary = data?.summary ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 };

  const hasFilters = !!(
    search ||
    typeFilter ||
    methodFilter ||
    monthFilter ||
    startDate ||
    endDate
  );

  // Derive a human-readable label for the active date range
  const dateRangeLabel = monthFilter
    ? new Date(monthFilter + "-02").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : startDate || endDate
      ? `${startDate || "…"} → ${endDate || "…"}`
      : "";

  function applyMonth(ym: string) {
    setMonthFilter(ym);
    if (ym) {
      const [y, m] = ym.split("-").map(Number);
      const last = new Date(y, m, 0);
      const pad = (n: number) => String(n).padStart(2, "0");
      setStartDate(`${y}-${pad(m)}-01`);
      setEndDate(`${y}-${pad(m)}-${pad(last.getDate())}`);
    } else {
      setStartDate("");
      setEndDate("");
    }
    setPage(1);
  }

  function handleStartDate(val: string) {
    setStartDate(val);
    setMonthFilter(""); // custom range, clear month shortcut
    setPage(1);
  }

  function handleEndDate(val: string) {
    setEndDate(val);
    setMonthFilter("");
    setPage(1);
  }

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setMethodFilter("");
    setMonthFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Transactions
          </h2>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            View all payroll and salary transactions
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-stroke bg-white px-4 py-2 text-sm font-semibold text-dark-4 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
          <ArrowRightLeft className="h-4 w-4" />
          {isLoading ? "—" : meta.total} total
        </span>
      </div>

      {/* ── Summary Tiles ───────────────────────────────────────────── */}
      {!isLoading && summary.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.map((s) => (
            <SummaryTile
              key={s.type}
              label={s.type}
              count={s.count}
              total={s.totalAmount}
            />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[10px] bg-gray-100 dark:bg-dark-3"
            />
          ))}
        </div>
      )}

      {/* ── Filters Bar ────────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name, ID…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-stroke bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-dark dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-dark-4 dark:text-dark-6" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TransactionType | "");
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="">All Types</option>
              <option value="SALARY">SALARY</option>
              <option value="BONUS">BONUS</option>
              <option value="LOAN">LOAN</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setPage(1);
            }}
            className={selectCls}
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="card">Card</option>
          </select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-stroke px-3 py-2.5 text-xs font-medium text-dark-4 transition hover:border-red-300 hover:text-red-500 dark:border-dark-3 dark:text-dark-6"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* ── Date filters row ───────────────────────────────────── */}
        <div className="mt-3 flex flex-col gap-3 border-t border-stroke pt-3 dark:border-dark-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-dark-4 dark:text-dark-6" />
            <span className="text-xs font-medium text-dark-4 dark:text-dark-6 whitespace-nowrap">
              Month
            </span>
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => applyMonth(e.target.value)}
              className={selectCls}
            />
          </div>
          <span className="hidden text-xs text-dark-4 dark:text-dark-6 sm:block">
            or
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dark-4 dark:text-dark-6 whitespace-nowrap">
              From
            </span>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => handleStartDate(e.target.value)}
              className={selectCls}
            />
            <span className="text-xs text-dark-4 dark:text-dark-6">→</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => handleEndDate(e.target.value)}
              className={selectCls}
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setMonthFilter("");
                  setPage(1);
                }}
                className="text-gray-400 transition hover:text-red-500"
                title="Clear dates"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stroke pt-3 dark:border-dark-3">
            <span className="text-xs text-dark-4 dark:text-dark-6">
              Active filters:
            </span>
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                Search: &ldquo;{search}&rdquo;
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                Type: {typeFilter}
                <button
                  onClick={() => {
                    setTypeFilter("");
                    setPage(1);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {methodFilter && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                Method: {PAYMENT_METHOD_LABELS[methodFilter] ?? methodFilter}
                <button
                  onClick={() => {
                    setMethodFilter("");
                    setPage(1);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateRangeLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                <CalendarDays className="h-3 w-3" />
                {dateRangeLabel}
                <button
                  onClick={() => {
                    setMonthFilter("");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <ArrowRightLeft className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Transaction Records
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </span>
                ) : (
                  `${meta.total} transaction${meta.total !== 1 ? "s" : ""} found`
                )}
              </p>
            </div>
          </div>
          {!isLoading && meta.total > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-dark-4 dark:bg-dark-3 dark:text-dark-6">
              {meta.total} result{meta.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                {[
                  "Employee",
                  "Type",
                  "Amount",
                  "Payment Method",
                  "Description",
                  "Created By",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {isLoading ? (
                <SkeletonRows />
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                        <ArrowRightLeft className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                        No transactions found
                      </p>
                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                  >
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
                          {tx.employee.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-dark dark:text-white">
                            {tx.employee.fullName}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                            <span className="font-mono">
                              {tx.employee.employeeId}
                            </span>
                            <span>·</span>
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {tx.employee.department.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <TransactionTypeBadge type={tx.type} />
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-dark dark:text-white">
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="px-6 py-4">
                      <PaymentMethodBadge method={tx.paymentMethod} />
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 max-w-[240px]">
                      <p
                        className="truncate text-sm text-dark-4 dark:text-dark-6"
                        title={tx.description ?? ""}
                      >
                        {tx.description ?? <span className="italic">—</span>}
                      </p>
                      {tx.bankTransactionId && (
                        <p className="mt-0.5 font-mono text-xs text-dark-4 dark:text-dark-6">
                          Ref: {tx.bankTransactionId}
                        </p>
                      )}
                    </td>

                    {/* Created By */}
                    <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                      {tx.createdBy?.name ?? "—"}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                      {formatDate(tx.transactionAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-dark-3">
            <p className="text-xs text-dark-4 dark:text-dark-6">
              Showing{" "}
              <span className="font-semibold text-dark dark:text-white">
                {(meta.page - 1) * meta.limit + 1}–
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-dark dark:text-white">
                {meta.total}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={meta.page <= 1}
                className="rounded-lg p-1.5 text-dark-4 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page pills (max 5 shown) */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(meta.totalPages, 5) },
                  (_, i) => {
                    let p: number;
                    if (meta.totalPages <= 5) {
                      p = i + 1;
                    } else if (meta.page <= 3) {
                      p = i + 1;
                    } else if (meta.page >= meta.totalPages - 2) {
                      p = meta.totalPages - 4 + i;
                    } else {
                      p = meta.page - 2 + i;
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                          p === meta.page
                            ? "bg-primary text-white"
                            : "text-dark-4 hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  },
                )}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-lg p-1.5 text-dark-4 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
