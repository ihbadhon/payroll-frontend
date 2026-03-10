"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useLoanDetail, useApproveLoan, useRejectLoan } from "@/hooks/useLoans";
import { InstallmentStatus, LoanStatus } from "@/types/enums";
import { formatCurrency, formatDate } from "@/utils/format";
import { getLoanStatusBadge } from "@/utils/status-helpers";
import {
  X,
  User,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface LoanDetailModalProps {
  loanId: string | null;
  onClose: () => void;
}

function InstallmentBadge({ status }: { status: InstallmentStatus }) {
  if (status === InstallmentStatus.PAID)
    return (
      <Badge variant="success">
        <CheckCircle className="mr-1 h-3 w-3" />
        Paid
      </Badge>
    );
  if (status === InstallmentStatus.OVERDUE)
    return (
      <Badge variant="danger">
        <AlertCircle className="mr-1 h-3 w-3" />
        Overdue
      </Badge>
    );
  return <Badge variant="warning">Pending</Badge>;
}

export default function LoanDetailModal({
  loanId,
  onClose,
}: LoanDetailModalProps) {
  const { data: loan, isLoading } = useLoanDetail(loanId);
  const { mutate: approve, isPending: approving } = useApproveLoan();
  const { mutate: reject, isPending: rejecting } = useRejectLoan();

  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!loanId) return null;

  const handleApprove = () => {
    approve(loanId, { onSuccess: onClose });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    reject(
      { id: loanId, payload: { reason: rejectReason } },
      { onSuccess: onClose },
    );
  };

  const statusBadge = loan ? getLoanStatusBadge(loan.status) : null;
  const remainingInstallments = loan
    ? loan.totalInstallments - loan.paidInstallments
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Loan Details
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Installment schedule &amp; loan summary
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading || !loan ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {/* Employee info */}
              {loan.employee && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-dark-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {loan.employee.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {loan.employee.designation}
                      {loan.employee.department &&
                        ` · ${loan.employee.department.name}`}
                      {" · "}
                      <span className="font-mono">
                        {loan.employee.employeeId}
                      </span>
                    </p>
                  </div>
                  <div className="ml-auto">
                    {statusBadge && (
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Loan summary grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <SummaryTile
                  icon={CreditCard}
                  label="Loan Amount"
                  value={formatCurrency(loan.loanAmount)}
                  color="text-purple-600"
                  bg="bg-purple-50 dark:bg-purple-500/10"
                />
                <SummaryTile
                  icon={Calendar}
                  label="Monthly Installment"
                  value={formatCurrency(loan.monthlyInstallment)}
                  color="text-blue-600"
                  bg="bg-blue-50 dark:bg-blue-500/10"
                />
                <SummaryTile
                  icon={CreditCard}
                  label="Remaining Balance"
                  value={formatCurrency(loan.remainingBalance)}
                  color="text-red-600"
                  bg="bg-red-50 dark:bg-red-500/10"
                />
                <SummaryTile
                  icon={CheckCircle}
                  label="Paid Installments"
                  value={`${loan.paidInstallments} / ${loan.totalInstallments}`}
                  color="text-green-600"
                  bg="bg-green-50 dark:bg-green-500/10"
                />
                <SummaryTile
                  icon={AlertCircle}
                  label="Remaining"
                  value={`${remainingInstallments} installments`}
                  color="text-yellow-600"
                  bg="bg-yellow-50 dark:bg-yellow-500/10"
                />
                {loan.issueDate && (
                  <SummaryTile
                    icon={Calendar}
                    label="Issue Date"
                    value={formatDate(loan.issueDate)}
                    color="text-gray-500"
                    bg="bg-gray-100 dark:bg-dark-3"
                  />
                )}
              </div>

              {/* Rejection reason */}
              {loan.status === LoanStatus.REJECTED && loan.rejectionReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    Rejection Reason
                  </p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {loan.rejectionReason}
                  </p>
                </div>
              )}

              {/* Installment schedule */}
              {loan.installments && loan.installments.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Installment Schedule
                  </h3>
                  <TableRoot>
                    <TableHeader className="bg-gray-50 dark:bg-dark-3">
                      <TableRow>
                        <TableHead className="uppercase">#</TableHead>
                        <TableHead className="uppercase">Amount</TableHead>
                        <TableHead className="uppercase">Due Date</TableHead>
                        <TableHead className="uppercase">Paid Date</TableHead>
                        <TableHead className="uppercase">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loan.installments.map((inst) => (
                        <TableRow
                          key={inst.id}
                          className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                        >
                          <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            {inst.installmentNo}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(inst.amount)}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(inst.dueDate)}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                            {inst.paidDate ? formatDate(inst.paidDate) : "—"}
                          </TableCell>
                          <TableCell>
                            <InstallmentBadge status={inst.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableRoot>
                </div>
              )}

              {/* Reject reason input */}
              {showReject && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                  <label className="mb-1.5 block text-xs font-medium text-red-700 dark:text-red-400">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Enter reason for rejection…"
                    className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500/40 dark:bg-dark-2 dark:text-gray-100"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions — only for PENDING loans */}
        {loan?.status === LoanStatus.PENDING && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-dark-3">
            {showReject ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReject(false);
                    setRejectReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                  disabled={!rejectReason.trim() || rejecting}
                  onClick={handleReject}
                >
                  <XCircle className="h-4 w-4" />
                  {rejecting ? "Rejecting…" : "Confirm Reject"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={() => setShowReject(true)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                  disabled={approving}
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4" />
                  {approving ? "Approving…" : "Approve"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper tile ──────────────────────────────────────────────────────────────
interface SummaryTileProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: SummaryTileProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 dark:border-dark-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} flex-shrink-0`}
      >
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
