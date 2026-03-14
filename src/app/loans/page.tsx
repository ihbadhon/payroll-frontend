// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import LoanDetailModal from "@/components/loans/LoanDetailModal";
// import EmptyState from "@/components/shared/EmptyState";
// import {
//   TableRoot,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/ui/Table";
// import {
//   useLoans,
//   useApproveLoan,
//   useRejectLoan,
//   useDisburseLoan,
//   useLoanStatusCount,
// } from "@/hooks/useLoans";
// import { Loan } from "@/types/loan";
// import { LoanStatus } from "@/types/enums";
// import { formatCurrency, formatDate } from "@/utils/format";
// import { getLoanStatusBadge } from "@/utils/status-helpers";
// import {
//   CreditCard,
//   Clock,
//   CheckCircle,
//   Eye,
//   XCircle,
//   UserCircle,
//   Banknote,
//   Send,
// } from "lucide-react";
// import { useState } from "react";

// const STATUS_TABS: { label: string; value: LoanStatus | "ALL" }[] = [
//   { label: "All", value: "ALL" },
//   { label: "Approved", value: LoanStatus.APPROVED },
//   { label: "Active", value: LoanStatus.ACTIVE },
//   { label: "Completed", value: LoanStatus.COMPLETED },
//   { label: "Rejected", value: LoanStatus.REJECTED },
// ];

// function empName(loan: Loan) {
//   return loan.employee?.fullName ?? `Employee #${loan.employeeId.slice(0, 8)}`;
// }
// function empSub(loan: Loan) {
//   if (!loan.employee) return null;
//   return `${loan.employee.designation}${loan.employee.department ? ` · ${loan.employee.department.name}` : ""}`;
// }

// function PendingRow({
//   loan,
//   onDetails,
//   onApprove,
//   onReject,
// }: {
//   loan: Loan;
//   onDetails: () => void;
//   onApprove: () => void;
//   onReject: () => void;
// }) {
//   return (
//     <TableRow className="group transition hover:bg-gray-50 dark:hover:bg-dark-3/50">
//       <TableCell>
//         <div className="flex items-center gap-3">
//           <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
//             <UserCircle className="h-4 w-4 text-primary" />
//           </div>
//           <div>
//             <p className="font-medium text-gray-900 dark:text-white">
//               {empName(loan)}
//             </p>
//             {empSub(loan) && (
//               <p className="text-xs text-gray-400">{empSub(loan)}</p>
//             )}
//           </div>
//         </div>
//       </TableCell>
//       <TableCell>
//         <p className="font-semibold text-gray-900 dark:text-white">
//           {formatCurrency(loan.loanAmount)}
//         </p>
//         <p className="text-xs text-gray-400">
//           {formatCurrency(loan.monthlyInstallment)} / mo
//         </p>
//       </TableCell>
//       <TableCell>
//         <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
//           {loan.totalInstallments} installments
//         </span>
//       </TableCell>
//       <TableCell className="text-sm text-gray-500 dark:text-gray-400">
//         {formatDate(loan.createdAt)}
//       </TableCell>
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={onDetails}
//             title="View details"
//             className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
//           >
//             <Eye className="h-4 w-4" />
//           </button>
//           <button
//             onClick={onApprove}
//             title="Approve"
//             className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10"
//           >
//             <CheckCircle className="h-4 w-4" />
//           </button>
//           <button
//             onClick={onReject}
//             title="Reject"
//             className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
//           >
//             <XCircle className="h-4 w-4" />
//           </button>
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// }

// function LoanRow({
//   loan,
//   onDetails,
//   onTransfer,
// }: {
//   loan: Loan;
//   onDetails: () => void;
//   onTransfer?: () => void;
// }) {
//   const badge = getLoanStatusBadge(loan.status);
//   const remaining = loan.totalInstallments - loan.paidInstallments;
//   return (
//     <TableRow className="group transition hover:bg-gray-50 dark:hover:bg-dark-3/50">
//       <TableCell>
//         <div className="flex items-center gap-3">
//           <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
//             <UserCircle className="h-4 w-4 text-primary" />
//           </div>
//           <div>
//             <p className="font-medium text-gray-900 dark:text-white">
//               {empName(loan)}
//             </p>
//             {empSub(loan) && (
//               <p className="text-xs text-gray-400">{empSub(loan)}</p>
//             )}
//           </div>
//         </div>
//       </TableCell>
//       <TableCell>
//         <p className="font-semibold text-gray-900 dark:text-white">
//           {formatCurrency(loan.loanAmount)}
//         </p>
//         <p className="text-xs text-gray-400">
//           {formatCurrency(loan.monthlyInstallment)} / mo
//         </p>
//       </TableCell>
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
//             <div
//               className="h-full rounded-full bg-green-500"
//               style={{
//                 width: `${Math.min(100, (loan.paidInstallments / loan.totalInstallments) * 100)}%`,
//               }}
//             />
//           </div>
//           <span className="text-xs text-gray-500">
//             {loan.paidInstallments}/{loan.totalInstallments}
//           </span>
//         </div>
//         <p className="mt-0.5 text-xs text-gray-400">{remaining} remaining</p>
//       </TableCell>
//       <TableCell>
//         <p className="font-medium text-gray-900 dark:text-white">
//           {formatCurrency(loan.remainingBalance)}
//         </p>
//       </TableCell>
//       <TableCell>
//         <Badge variant={badge.variant}>{badge.label}</Badge>
//       </TableCell>
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={onDetails}
//             title="View details"
//             className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
//           >
//             <Eye className="h-4 w-4" />
//           </button>
//           {loan.status === LoanStatus.APPROVED && onTransfer && (
//             <button
//               onClick={onTransfer}
//               title="Transfer money"
//               className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white transition bg-green-600 hover:bg-green-700"
//             >
//               <Send className="h-3.5 w-3.5" />
//               Transfer
//             </button>
//           )}
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// }

// function TransferConfirmModal({
//   loan,
//   onClose,
//   onConfirm,
//   isPending,
// }: {
//   loan: Loan;
//   onClose: () => void;
//   onConfirm: () => void;
//   isPending: boolean;
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
//             <Send className="h-5 w-5 text-green-600" />
//           </div>
//           <div>
//             <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//               Confirm Money Transfer
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {empName(loan)}
//             </p>
//           </div>
//         </div>
//         <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-dark-3 dark:bg-dark-3">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-gray-500 dark:text-gray-400">
//               Amount to transfer
//             </span>
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {formatCurrency(loan.loanAmount)}
//             </span>
//           </div>
//           <div className="mt-1.5 flex items-center justify-between text-sm">
//             <span className="text-gray-500 dark:text-gray-400">
//               Monthly installment
//             </span>
//             <span className="text-gray-700 dark:text-gray-300">
//               {formatCurrency(loan.monthlyInstallment)} / mo
//             </span>
//           </div>
//           <div className="mt-1.5 flex items-center justify-between text-sm">
//             <span className="text-gray-500 dark:text-gray-400">
//               Total installments
//             </span>
//             <span className="text-gray-700 dark:text-gray-300">
//               {loan.totalInstallments} months
//             </span>
//           </div>
//         </div>
//         <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
//           Confirming this will mark the loan as <strong>Active</strong> and
//           begin the repayment schedule.
//         </p>
//         <div className="mt-4 flex justify-end gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onClose}
//             disabled={isPending}
//           >
//             Cancel
//           </Button>
//           <Button
//             size="sm"
//             className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
//             disabled={isPending}
//             onClick={onConfirm}
//           >
//             <Send className="h-4 w-4" />
//             {isPending ? "Transferring…" : "Confirm Transfer"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RejectConfirmModal({
//   loan,
//   onClose,
//   onConfirm,
//   isPending,
// }: {
//   loan: Loan;
//   onClose: () => void;
//   onConfirm: (reason: string) => void;
//   isPending: boolean;
// }) {
//   const [reason, setReason] = useState("");
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
//         <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//           Reject Loan Request
//         </h3>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           {empName(loan)} — {formatCurrency(loan.loanAmount)}
//         </p>
//         <label className="mt-4 block text-xs font-medium text-gray-700 dark:text-gray-300">
//           Reason <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           rows={3}
//           placeholder="Enter rejection reason…"
//           className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-dark-3 dark:bg-dark-3 dark:text-gray-100"
//         />
//         <div className="mt-4 flex justify-end gap-2">
//           <Button variant="ghost" size="sm" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             size="sm"
//             className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
//             disabled={!reason.trim() || isPending}
//             onClick={() => onConfirm(reason)}
//           >
//             <XCircle className="h-4 w-4" />
//             {isPending ? "Rejecting…" : "Reject"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function SkeletonRows({ cols }: { cols: number }) {
//   return (
//     <>
//       {[1, 2, 3].map((i) => (
//         <TableRow key={i}>
//           {Array.from({ length: cols }).map((_, j) => (
//             <TableCell key={j}>
//               <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-dark-3" />
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </>
//   );
// }

// export default function LoansPage() {
//   const [detailLoanId, setDetailLoanId] = useState<string | null>(null);
//   const [rejectingLoan, setRejectingLoan] = useState<Loan | null>(null);
//   const [transferringLoan, setTransferringLoan] = useState<Loan | null>(null);
//   const [activeTab, setActiveTab] = useState<LoanStatus | "ALL">("ALL");

//   const {
//     data: statusCount,
//     isLoading: statusLoading,
//     isError: statusError,
//   } = useLoanStatusCount();
//   const {
//     data: pendingLoans = [],
//     isLoading: pendingLoading,
//     isError: pendingError,
//   } = useLoans({
//     status: LoanStatus.PENDING,
//   });
//   const { data: activeLoans = [] } = useLoans({
//     status: LoanStatus.ACTIVE,
//   });
//   const {
//     data: allLoans = [],
//     isLoading: allLoading,
//     isError: allError,
//   } = useLoans({});

//   const hasError = statusError || pendingError || allError;

//   const tabLoans =
//     activeTab === "ALL"
//       ? allLoans.filter((l) => l.status !== LoanStatus.PENDING)
//       : allLoans.filter((l) => l.status === activeTab);

//   const totalActiveAmount = activeLoans.reduce(
//     (sum, l) => sum + l.loanAmount,
//     0,
//   );

//   const { mutate: approve } = useApproveLoan();
//   const { mutate: reject, isPending: rejecting } = useRejectLoan();
//   const { mutate: disburse, isPending: disbursing } = useDisburseLoan();

//   const handleRejectSubmit = (reason: string) => {
//     if (!rejectingLoan) return;
//     reject(
//       { id: rejectingLoan.id, payload: { reason } },
//       { onSuccess: () => setRejectingLoan(null) },
//     );
//   };

//   const handleTransferConfirm = () => {
//     if (!transferringLoan) return;
//     disburse(transferringLoan.id, {
//       onSuccess: () => setTransferringLoan(null),
//     });
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         <PageHeader
//           title="Loan Management"
//           description="Review pending loan requests and monitor active employee loans"
//         />

//         {/* API Error Banner */}
//         {hasError && (
//           <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
//             <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
//             <div>
//               <p className="text-sm font-semibold text-red-700 dark:text-red-400">
//                 Failed to load loan data
//               </p>
//               <p className="text-xs text-red-600 dark:text-red-400">
//                 The server returned an error. Your account may not have
//                 permission to access loan records, or the server is unavailable.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//           <StatCard
//             title="Pending Requests"
//             value={statusCount?.pending ?? 0}
//             subtitle="Awaiting your approval"
//             icon={Clock}
//             iconColor="text-yellow-600"
//             iconBg="bg-yellow-50 dark:bg-yellow-500/10"
//             isLoading={statusLoading}
//           />
//           <StatCard
//             title="Active Loans"
//             value={statusCount?.active ?? 0}
//             subtitle={`Total: ${formatCurrency(statusCount?.activeLoanAmount ?? 0)}`}
//             icon={Banknote}
//             iconColor="text-blue-600"
//             iconBg="bg-blue-50 dark:bg-blue-500/10"
//             isLoading={statusLoading}
//           />
//           <StatCard
//             title="Completed Loans"
//             value={statusCount?.completed ?? 0}
//             subtitle="Fully repaid"
//             icon={CreditCard}
//             iconColor="text-green-600"
//             iconBg="bg-green-50 dark:bg-green-500/10"
//             isLoading={statusLoading}
//           />
//         </div>

//         {/* Pending Requests */}
//         <div className="card overflow-hidden">
//           <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark-3">
//             <div>
//               <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                 Pending Loan Requests
//               </h2>
//               <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                 Review and act on employee loan applications
//               </p>
//             </div>
//             {pendingLoans.length > 0 && (
//               <Badge variant="warning">{pendingLoans.length} pending</Badge>
//             )}
//           </div>

//           {pendingLoading ? (
//             <SkeletonRows cols={5} />
//           ) : pendingLoans.length === 0 ? (
//             <EmptyState
//               title="No pending requests"
//               description="All loan requests have been reviewed."
//               icon={CheckCircle}
//             />
//           ) : (
//             <TableRoot>
//               <TableHeader>
//                 <TableRow>
//                   {[
//                     "Employee",
//                     "Amount",
//                     "Installments",
//                     "Requested",
//                     "Actions",
//                   ].map((h) => (
//                     <TableHead
//                       key={h}
//                       className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400"
//                     >
//                       {h}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {pendingLoans.map((loan) => (
//                   <PendingRow
//                     key={loan.id}
//                     loan={loan}
//                     onDetails={() => setDetailLoanId(loan.id)}
//                     onApprove={() => approve(loan.id)}
//                     onReject={() => setRejectingLoan(loan)}
//                   />
//                 ))}
//               </TableBody>
//             </TableRoot>
//           )}
//         </div>

//         {/* Loan Records */}
//         <div className="card overflow-hidden">
//           <div className="border-b border-gray-200 px-5 py-4 dark:border-dark-3">
//             <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//               Loan Records
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//               All employee loans with installment progress
//             </p>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-1 border-b border-gray-200 px-4 dark:border-dark-3">
//             {STATUS_TABS.map((tab) => (
//               <button
//                 key={tab.value}
//                 onClick={() => setActiveTab(tab.value)}
//                 className={`px-3 py-2.5 text-xs font-medium transition ${
//                   activeTab === tab.value
//                     ? "border-b-2 border-primary text-primary"
//                     : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {allLoading ? (
//             <SkeletonRows cols={6} />
//           ) : tabLoans.length === 0 ? (
//             <EmptyState
//               title="No loans found"
//               description="No loans match the selected filter."
//               icon={CreditCard}
//             />
//           ) : (
//             <TableRoot>
//               <TableHeader>
//                 <TableRow>
//                   {[
//                     "Employee",
//                     "Loan Amount",
//                     "Installments",
//                     "Remaining Balance",
//                     "Status",
//                     "",
//                   ].map((h, i) => (
//                     <TableHead
//                       key={i}
//                       className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400"
//                     >
//                       {h}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tabLoans.map((loan) => (
//                   <LoanRow
//                     key={loan.id}
//                     loan={loan}
//                     onDetails={() => setDetailLoanId(loan.id)}
//                     onTransfer={() => setTransferringLoan(loan)}
//                   />
//                 ))}
//               </TableBody>
//             </TableRoot>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       {detailLoanId && (
//         <LoanDetailModal
//           loanId={detailLoanId}
//           onClose={() => setDetailLoanId(null)}
//         />
//       )}
//       {rejectingLoan && (
//         <RejectConfirmModal
//           loan={rejectingLoan}
//           onClose={() => setRejectingLoan(null)}
//           onConfirm={handleRejectSubmit}
//           isPending={rejecting}
//         />
//       )}
//       {transferringLoan && (
//         <TransferConfirmModal
//           loan={transferringLoan}
//           onClose={() => setTransferringLoan(null)}
//           onConfirm={handleTransferConfirm}
//           isPending={disbursing}
//         />
//       )}
//     </>
//   );
// }

"use client";

import LoanDetailModal from "@/components/loans/LoanDetailModal";
import {
  useLoans,
  useApproveLoan,
  useRejectLoan,
  useDisburseLoan,
  useLoanStatusCount,
} from "@/hooks/useLoans";
import { Loan } from "@/types/loan";
import { LoanStatus } from "@/types/enums";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  CreditCard,
  Clock,
  CheckCircle,
  Eye,
  XCircle,
  UserCircle,
  Banknote,
  Send,
  ArrowUpRight,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function empName(loan: Loan) {
  return loan.employee?.fullName ?? `Employee #${loan.employeeId.slice(0, 8)}`;
}
function empSub(loan: Loan) {
  if (!loan.employee) return null;
  return `${loan.employee.designation}${loan.employee.department ? ` · ${loan.employee.department.name}` : ""}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const map: Record<LoanStatus, string> = {
    [LoanStatus.PENDING]:
      "inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
    [LoanStatus.APPROVED]:
      "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
    [LoanStatus.ACTIVE]:
      "inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
    [LoanStatus.COMPLETED]:
      "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-dark-3 dark:text-gray-400",
    [LoanStatus.REJECTED]:
      "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };
  return (
    <span className={map[status] ?? ""}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Employee Cell ────────────────────────────────────────────────────────────
function EmpCell({ loan }: { loan: Loan }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <UserCircle className="h-4.5 w-4.5 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-dark dark:text-white">
          {empName(loan)}
        </p>
        {empSub(loan) && (
          <p className="text-xs text-dark-4 dark:text-dark-6">{empSub(loan)}</p>
        )}
      </div>
    </div>
  );
}

// ─── Icon Button ─────────────────────────────────────────────────────────────
function IconBtn({
  onClick,
  title,
  hoverCls,
  children,
}: {
  onClick: () => void;
  title: string;
  hoverCls: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-lg p-1.5 text-dark-4 transition dark:text-dark-6 ${hoverCls}`}
    >
      {children}
    </button>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  isLoading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accent: "yellow" | "blue" | "green";
  isLoading?: boolean;
}) {
  const a = {
    yellow: {
      bg: "bg-yellow-500/10",
      icon: "text-yellow-600 dark:text-yellow-400",
      ring: "ring-yellow-500/20",
      badge:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      icon: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-500/20",
      badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    green: {
      bg: "bg-green-500/10",
      icon: "text-green-600 dark:text-green-400",
      ring: "ring-green-500/20",
      badge:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
  }[accent];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-6  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.bg} ring-1 ${a.ring}`}
        >
          <Icon className={`h-6 w-6 ${a.icon}`} />
        </div>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <>
            <div className="h-7 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
          </>
        ) : (
          <>
            <h4 className="text-xl font-bold text-dark dark:text-white">
              {value}
            </h4>
            <p className="mt-1 text-sm font-medium text-dark-4 dark:text-dark-6">
              {title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Transfer Confirm Modal ───────────────────────────────────────────────────
function TransferConfirmModal({
  loan,
  onClose,
  onConfirm,
  isPending,
}: {
  loan: Loan;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
            <Send className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dark dark:text-white">
              Confirm Money Transfer
            </h3>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              {empName(loan)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2 rounded-xl border border-stroke bg-gray-50 px-4 py-3 dark:border-dark-3 dark:bg-dark-3">
          {[
            {
              label: "Amount to transfer",
              value: formatCurrency(loan.loanAmount),
              bold: true,
            },
            {
              label: "Monthly installment",
              value: `${formatCurrency(loan.monthlyInstallment)} / mo`,
              bold: false,
            },
            {
              label: "Total installments",
              value: `${loan.totalInstallments} months`,
              bold: false,
            },
          ].map(({ label, value, bold }) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-dark-4 dark:text-dark-6">{label}</span>
              <span
                className={
                  bold
                    ? "font-bold text-dark dark:text-white"
                    : "text-dark dark:text-white"
                }
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-dark-4 dark:text-dark-6">
          Confirming this will mark the loan as{" "}
          <strong className="text-dark dark:text-white">Active</strong> and
          begin the repayment schedule.
        </p>

        <div className="mt-5 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark-4 transition hover:bg-gray-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isPending ? "Transferring…" : "Confirm Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reject Confirm Modal ─────────────────────────────────────────────────────
function RejectConfirmModal({
  loan,
  onClose,
  onConfirm,
  isPending,
}: {
  loan: Loan;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dark dark:text-white">
              Reject Loan Request
            </h3>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              {empName(loan)} — {formatCurrency(loan.loanAmount)}
            </p>
          </div>
        </div>

        <label className="mt-5 block text-xs font-semibold text-dark dark:text-white">
          Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Enter rejection reason…"
          className="mt-1.5 w-full rounded-xl border border-stroke bg-gray-50 px-3.5 py-2.5 text-sm text-dark outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
        />

        <div className="mt-5 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark-4 transition hover:bg-gray-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || isPending}
            onClick={() => onConfirm(reason)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {isPending ? "Rejecting…" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab labels ───────────────────────────────────────────────────────────────
const STATUS_TABS: { label: string; value: LoanStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Approved", value: LoanStatus.APPROVED },
  { label: "Active", value: LoanStatus.ACTIVE },
  { label: "Completed", value: LoanStatus.COMPLETED },
  { label: "Rejected", value: LoanStatus.REJECTED },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoansPage() {
  const [detailLoanId, setDetailLoanId] = useState<string | null>(null);
  const [rejectingLoan, setRejectingLoan] = useState<Loan | null>(null);
  const [transferringLoan, setTransferringLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState<LoanStatus | "ALL">("ALL");

  const {
    data: statusCount,
    isLoading: statusLoading,
    isError: statusError,
  } = useLoanStatusCount();
  const {
    data: pendingLoans = [],
    isLoading: pendingLoading,
    isError: pendingError,
  } = useLoans({ status: LoanStatus.PENDING });
  const { data: activeLoans = [] } = useLoans({ status: LoanStatus.ACTIVE });
  const {
    data: allLoans = [],
    isLoading: allLoading,
    isError: allError,
  } = useLoans({});

  const hasError = statusError || pendingError || allError;

  const tabLoans =
    activeTab === "ALL"
      ? allLoans.filter((l) => l.status !== LoanStatus.PENDING)
      : allLoans.filter((l) => l.status === activeTab);

  const { mutate: approve } = useApproveLoan();
  const { mutate: reject, isPending: rejecting } = useRejectLoan();
  const { mutate: disburse, isPending: disbursing } = useDisburseLoan();

  const handleRejectSubmit = (reason: string) => {
    if (!rejectingLoan) return;
    reject(
      { id: rejectingLoan.id, payload: { reason } },
      { onSuccess: () => setRejectingLoan(null) },
    );
  };

  const handleTransferConfirm = () => {
    if (!transferringLoan) return;
    disburse(transferringLoan.id, {
      onSuccess: () => setTransferringLoan(null),
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Loan Management
            </h2>
            <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
              Review pending loan requests and monitor active employee loans
            </p>
          </div>
          {pendingLoans.length > 0 && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-warning-light px-3 py-1.5 text-xs font-semibold text-warning">
              <Clock className="h-3.5 w-3.5" />
              {pendingLoans.length} pending request
              {pendingLoans.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Error Banner ──────────────────────────────────────────── */}
        {hasError && (
          <div className="flex items-start gap-3 rounded-[10px] border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/20 dark:bg-red-500/10">
            <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Failed to load loan data
              </p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80">
                Your account may not have permission to access loan records, or
                the server is unavailable.
              </p>
            </div>
          </div>
        )}

        {/* ── Metric Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MetricCard
            title="Pending Requests"
            value={statusCount?.pending ?? 0}
            subtitle="Awaiting your approval"
            icon={Clock}
            accent="yellow"
            isLoading={statusLoading}
          />
          <MetricCard
            title="Active Loans"
            value={statusCount?.active ?? 0}
            subtitle={`Total: ${formatCurrency(statusCount?.activeLoanAmount ?? 0)}`}
            icon={Banknote}
            accent="blue"
            isLoading={statusLoading}
          />
          <MetricCard
            title="Completed Loans"
            value={statusCount?.completed ?? 0}
            subtitle="Fully repaid"
            icon={CreditCard}
            accent="green"
            isLoading={statusLoading}
          />
        </div>

        {/* ── Pending Requests ──────────────────────────────────────── */}
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <div>
                <h3 className="text-base font-semibold text-dark dark:text-white">
                  Pending Loan Requests
                </h3>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  Review and act on employee loan applications
                </p>
              </div>
            </div>
            {pendingLoans.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-light px-2.5 py-1 text-xs font-medium text-warning">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {pendingLoans.length} pending
              </span>
            )}
          </div>

          {pendingLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  <SkeletonRows cols={5} />
                </tbody>
              </table>
            </div>
          ) : pendingLoans.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                <CheckCircle className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                No pending requests
              </p>
              <p className="text-xs text-gray-400">
                All loan requests have been reviewed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    {[
                      "Employee",
                      "Amount",
                      "Installments",
                      "Requested",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {pendingLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                    >
                      <td className="px-6 py-4">
                        <EmpCell loan={loan} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-dark dark:text-white">
                          {formatCurrency(loan.loanAmount)}
                        </p>
                        <p className="text-xs text-dark-4 dark:text-dark-6">
                          {formatCurrency(loan.monthlyInstallment)} / mo
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                        {loan.totalInstallments} installments
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                        {formatDate(loan.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <IconBtn
                            onClick={() => setDetailLoanId(loan.id)}
                            title="View details"
                            hoverCls="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
                          >
                            <Eye className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn
                            onClick={() => approve(loan.id)}
                            title="Approve"
                            hoverCls="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn
                            onClick={() => setRejectingLoan(loan)}
                            title="Reject"
                            hoverCls="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                          >
                            <XCircle className="h-4 w-4" />
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Loan Records ──────────────────────────────────────────── */}
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
          <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
            <CreditCard className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Loan Records
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                All employee loans with installment progress
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 overflow-x-auto border-b border-stroke px-4 dark:border-dark-3">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold transition ${
                  activeTab === tab.value
                    ? "border-b-2 border-primary text-primary"
                    : "text-dark-4 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {allLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  <SkeletonRows cols={6} />
                </tbody>
              </table>
            </div>
          ) : tabLoans.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                <CreditCard className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                No loans found
              </p>
              <p className="text-xs text-gray-400">
                No loans match the selected filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    {[
                      "Employee",
                      "Loan Amount",
                      "Installments",
                      "Remaining Balance",
                      "Status",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {tabLoans.map((loan) => {
                    const pct =
                      loan.totalInstallments > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (loan.paidInstallments / loan.totalInstallments) *
                                100,
                            ),
                          )
                        : 0;
                    const remaining =
                      loan.totalInstallments - loan.paidInstallments;
                    return (
                      <tr
                        key={loan.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <td className="px-6 py-4">
                          <EmpCell loan={loan} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-dark dark:text-white">
                            {formatCurrency(loan.loanAmount)}
                          </p>
                          <p className="text-xs text-dark-4 dark:text-dark-6">
                            {formatCurrency(loan.monthlyInstallment)} / mo
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-dark-4 dark:text-dark-6">
                              {loan.paidInstallments}/{loan.totalInstallments}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-dark-4 dark:text-dark-6">
                            {remaining} remaining
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-dark dark:text-white">
                          {formatCurrency(loan.remainingBalance)}
                        </td>
                        <td className="px-6 py-4">
                          <LoanStatusBadge status={loan.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <IconBtn
                              onClick={() => setDetailLoanId(loan.id)}
                              title="View details"
                              hoverCls="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
                            >
                              <Eye className="h-4 w-4" />
                            </IconBtn>
                            {loan.status === LoanStatus.APPROVED && (
                              <button
                                onClick={() => setTransferringLoan(loan)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                              >
                                <Send className="h-3.5 w-3.5" />
                                Transfer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {detailLoanId && (
        <LoanDetailModal
          loanId={detailLoanId}
          onClose={() => setDetailLoanId(null)}
        />
      )}
      {rejectingLoan && (
        <RejectConfirmModal
          loan={rejectingLoan}
          onClose={() => setRejectingLoan(null)}
          onConfirm={handleRejectSubmit}
          isPending={rejecting}
        />
      )}
      {transferringLoan && (
        <TransferConfirmModal
          loan={transferringLoan}
          onClose={() => setTransferringLoan(null)}
          onConfirm={handleTransferConfirm}
          isPending={disbursing}
        />
      )}
    </>
  );
}
