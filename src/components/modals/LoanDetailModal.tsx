"use client";

import { useLoanDetail } from "@/hooks/useLoans";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { LoanStatus, InstallmentStatus } from "@/types/enums";
import { formatCurrency, formatDate } from "@/utils/format";
import { CheckCircle2, XCircle, Clock, AlertCircle, X } from "lucide-react";

interface LoanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string | null;
}

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const map: Record<LoanStatus, { bg: string; text: string; label: string }> = {
    [LoanStatus.PENDING]: {
      bg: "bg-yellow-50 dark:bg-yellow-500/10",
      text: "text-yellow-700 dark:text-yellow-400",
      label: "Pending",
    },
    [LoanStatus.APPROVED]: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-700 dark:text-blue-400",
      label: "Approved",
    },
    [LoanStatus.ACTIVE]: {
      bg: "bg-green-50 dark:bg-green-500/10",
      text: "text-green-700 dark:text-green-400",
      label: "Active",
    },
    [LoanStatus.COMPLETED]: {
      bg: "bg-gray-50 dark:bg-gray-500/10",
      text: "text-gray-700 dark:text-gray-400",
      label: "Completed",
    },
    [LoanStatus.REJECTED]: {
      bg: "bg-red-50 dark:bg-red-500/10",
      text: "text-red-700 dark:text-red-400",
      label: "Rejected",
    },
  };
  const { bg, text, label } = map[status];
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

function InstallmentStatusBadge({ status }: { status: InstallmentStatus }) {
  const map: Record<
    InstallmentStatus,
    { icon: React.ReactNode; text: string; label: string }
  > = {
    [InstallmentStatus.PENDING]: {
      icon: <Clock className="h-4 w-4" />,
      text: "text-yellow-600 dark:text-yellow-400",
      label: "Pending",
    },
    [InstallmentStatus.PAID]: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      text: "text-green-600 dark:text-green-400",
      label: "Paid",
    },
    [InstallmentStatus.OVERDUE]: {
      icon: <AlertCircle className="h-4 w-4" />,
      text: "text-red-600 dark:text-red-400",
      label: "Overdue",
    },
  };
  const { icon, text, label } = map[status];
  return (
    <div className={`flex items-center gap-1.5 ${text}`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export default function LoanDetailModal({
  isOpen,
  onClose,
  loanId,
}: LoanDetailModalProps) {
  const { data: loan, isLoading, error } = useLoanDetail(loanId);

  if (!isOpen) return null;

  const paidInstallmentPct =
    loan && loan.totalInstallments > 0
      ? Math.round((loan.paidInstallments / loan.totalInstallments) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white  dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-dark-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Loan Details
            </h2>
            {loanId && (
              <p className="mt-0.5 text-xs text-gray-400">ID: {loanId}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to load loan details
              </p>
            </div>
          ) : loan ? (
            <>
              {/* Status + Amount */}
              <div className="flex items-start justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <div className="mt-2">
                    <LoanStatusBadge status={loan.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Loan Amount
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(loan.loanAmount)}
                  </p>
                </div>
              </div>

              {/* Key figures */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    label: "Monthly EMI",
                    value: formatCurrency(loan.monthlyInstallment),
                    valueClass: "",
                  },
                  {
                    label: "Remaining Balance",
                    value: formatCurrency(loan.remainingBalance),
                    valueClass: "text-orange-600 dark:text-orange-400",
                  },
                  {
                    label: "Total Installments",
                    value: loan.totalInstallments.toString(),
                    valueClass: "",
                  },
                  {
                    label: "Paid Installments",
                    value: loan.paidInstallments.toString(),
                    valueClass: "text-green-600 dark:text-green-400",
                  },
                ].map(({ label, value, valueClass }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-100 p-3 dark:border-dark-3"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {label}
                    </p>
                    <p
                      className={`mt-1.5 text-base font-bold text-gray-900 dark:text-white ${valueClass}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Repayment Progress
                  </p>
                  <p className="text-xs font-semibold text-gray-500">
                    {paidInstallmentPct}%
                  </p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                    style={{ width: `${paidInstallmentPct}%` }}
                  />
                </div>
              </div>

              {/* Dates & Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-dark-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Issue Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(loan.issueDate)}
                  </p>
                </div>
                {loan.approvedAt && (
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-dark-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Approved Date
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(loan.approvedAt)}
                    </p>
                  </div>
                )}
                {loan.rejectionReason && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400">
                      Rejection Reason
                    </p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                      {loan.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Installment Schedule */}
              {loan.installments && loan.installments.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Installment Schedule
                  </h3>
                  <TableRoot>
                    <TableHeader className="bg-gray-50 dark:bg-dark-3">
                      <TableRow>
                        <TableHead className="uppercase">#</TableHead>
                        <TableHead className="uppercase">Due Date</TableHead>
                        <TableHead className="uppercase">Paid Date</TableHead>
                        <TableHead className="text-right uppercase">
                          Amount
                        </TableHead>
                        <TableHead className="text-center uppercase">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loan.installments.map((inst) => (
                        <TableRow
                          key={inst.id}
                          className="hover:bg-gray-50 dark:hover:bg-dark-3"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {inst.installmentNo}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {formatDate(inst.dueDate)}
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {inst.paidDate ? formatDate(inst.paidDate) : "—"}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(inst.amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <InstallmentStatusBadge status={inst.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableRoot>
                </div>
              )}

              {loan.installments.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 dark:border-dark-3">
                  <XCircle className="h-6 w-6 text-gray-300" />
                  <p className="text-sm text-gray-400">
                    No installments scheduled yet
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 dark:border-dark-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-dark-3 dark:text-gray-300 dark:hover:bg-dark-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
