// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import LoanRequestModal from "@/components/modals/LoanRequestModal";
// import {
//   TableRoot,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/ui/Table";
// import { useMyLoans } from "@/hooks/useMyData";
// import { formatCurrency, formatDate } from "@/utils/format";
// import { LoanStatus, InstallmentStatus } from "@/types/enums";
// import { Loan } from "@/types/loan";
// import {
//   HandCoins,
//   CreditCard,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   XCircle,
//   ChevronDown,
//   ChevronRight,
//   Plus,
// } from "lucide-react";
// import { useState } from "react";

// // ─── Loan Status Badge ────────────────────────────────────────────────────────
// function LoanStatusBadge({ status }: { status: LoanStatus }) {
//   const styles: Record<LoanStatus, string> = {
//     [LoanStatus.PENDING]:
//       "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//     [LoanStatus.APPROVED]:
//       "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//     [LoanStatus.ACTIVE]:
//       "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//     [LoanStatus.COMPLETED]:
//       "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-gray-400",
//     [LoanStatus.REJECTED]:
//       "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
//   };
//   const icons: Record<LoanStatus, React.ReactNode> = {
//     [LoanStatus.PENDING]: <Clock className="h-3 w-3" />,
//     [LoanStatus.APPROVED]: <CheckCircle2 className="h-3 w-3" />,
//     [LoanStatus.ACTIVE]: <CheckCircle2 className="h-3 w-3" />,
//     [LoanStatus.COMPLETED]: <CheckCircle2 className="h-3 w-3" />,
//     [LoanStatus.REJECTED]: <XCircle className="h-3 w-3" />,
//   };
//   const labels: Record<LoanStatus, string> = {
//     [LoanStatus.PENDING]: "Pending",
//     [LoanStatus.APPROVED]: "Approved",
//     [LoanStatus.ACTIVE]: "Active",
//     [LoanStatus.COMPLETED]: "Completed",
//     [LoanStatus.REJECTED]: "Rejected",
//   };
//   return (
//     <span
//       className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
//     >
//       {icons[status]}
//       {labels[status] ?? status}
//     </span>
//   );
// }

// // ─── Installment Status Badge ─────────────────────────────────────────────────
// function InstallmentBadge({ status }: { status: InstallmentStatus }) {
//   const styles: Record<InstallmentStatus, string> = {
//     [InstallmentStatus.PENDING]:
//       "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//     [InstallmentStatus.PAID]:
//       "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//     [InstallmentStatus.OVERDUE]:
//       "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
//   };
//   return (
//     <span
//       className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
//     >
//       {status === InstallmentStatus.PENDING
//         ? "Pending"
//         : status === InstallmentStatus.PAID
//           ? "Paid"
//           : "Overdue"}
//     </span>
//   );
// }

// function SkeletonRow({ cols }: { cols: number }) {
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

// // ─── Expandable Loan Row ──────────────────────────────────────────────────────
// function LoanRow({ loan, index }: { loan: Loan; index: number }) {
//   const [expanded, setExpanded] = useState(false);
//   const progress =
//     loan.totalInstallments > 0
//       ? Math.round((loan.paidInstallments / loan.totalInstallments) * 100)
//       : 0;

//   return (
//     <>
//       <TableRow
//         className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
//         onClick={() => setExpanded((v) => !v)}
//       >
//         <TableCell className="text-center text-xs text-gray-400">
//           {index + 1}
//         </TableCell>
//         <TableCell className="font-semibold text-gray-900 dark:text-white">
//           {formatCurrency(loan.loanAmount)}
//         </TableCell>
//         <TableCell className="text-right text-gray-600 dark:text-gray-400">
//           {formatCurrency(loan.monthlyInstallment)}/mo
//         </TableCell>
//         <TableCell className="text-right">
//           <span className="font-semibold text-red-600 dark:text-red-400">
//             {formatCurrency(loan.remainingBalance)}
//           </span>
//         </TableCell>
//         <TableCell>
//           <div className="flex items-center gap-2">
//             <div className="h-1.5 w-24 rounded-full bg-gray-200 dark:bg-dark-3">
//               <div
//                 className="h-1.5 rounded-full bg-primary transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <span className="text-xs text-gray-500">
//               {loan.paidInstallments}/{loan.totalInstallments}
//             </span>
//           </div>
//         </TableCell>
//         <TableCell className="text-xs text-gray-500 dark:text-gray-400">
//           {formatDate(loan.issueDate)}
//         </TableCell>
//         <TableCell>
//           <LoanStatusBadge status={loan.status} />
//         </TableCell>
//         <TableCell className="text-center text-gray-400">
//           {expanded ? (
//             <ChevronDown className="mx-auto h-4 w-4" />
//           ) : (
//             <ChevronRight className="mx-auto h-4 w-4" />
//           )}
//         </TableCell>
//       </TableRow>

//       {expanded && loan.installments?.length > 0 && (
//         <TableRow>
//           <TableCell
//             colSpan={8}
//             className="bg-gray-50 px-6 py-3 dark:bg-dark-3/30"
//           >
//             <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
//               Installment Schedule
//             </p>
//             <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
//               {loan.installments.map((inst) => (
//                 <div
//                   key={inst.id}
//                   className={`rounded-lg border px-3 py-2 text-xs ${
//                     inst.status === InstallmentStatus.PAID
//                       ? "border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10"
//                       : inst.status === InstallmentStatus.OVERDUE
//                         ? "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
//                         : "border-gray-200 bg-white dark:border-dark-3 dark:bg-dark-2"
//                   }`}
//                 >
//                   <p className="font-semibold text-gray-700 dark:text-gray-200">
//                     #{inst.installmentNo}
//                   </p>
//                   <p className="text-gray-500">{formatCurrency(inst.amount)}</p>
//                   <p className="text-gray-400">{formatDate(inst.dueDate)}</p>
//                   <InstallmentBadge status={inst.status} />
//                 </div>
//               ))}
//             </div>
//           </TableCell>
//         </TableRow>
//       )}
//     </>
//   );
// }

// export default function MyLoansPage() {
//   const { data: loans = [], isLoading } = useMyLoans();
//   const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

//   const activeLoan = loans.find(
//     (l) => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.APPROVED,
//   );
//   const pendingLoans = loans.filter((l) => l.status === LoanStatus.PENDING);
//   const totalRemaining = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
//   const totalPaid = loans.reduce(
//     (sum, l) => sum + (l.loanAmount - l.remainingBalance),
//     0,
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <PageHeader
//           title="My Loans"
//           description="Track your loan requests, status and repayment schedule"
//         />
//         <button
//           onClick={() => setIsRequestModalOpen(true)}
//           className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
//         >
//           <Plus className="h-4 w-4" />
//           Request Loan
//         </button>
//       </div>

//       {/* ── Stat Cards ──────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Total Loans"
//           value={loans.length}
//           subtitle={`${pendingLoans.length} pending approval`}
//           icon={CreditCard}
//           iconBg="bg-blue-50 dark:bg-blue-500/10"
//           iconColor="text-blue-600 dark:text-blue-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Active Loan"
//           value={activeLoan ? formatCurrency(activeLoan.loanAmount) : "None"}
//           subtitle={
//             activeLoan
//               ? `${activeLoan.paidInstallments}/${activeLoan.totalInstallments} installments paid`
//               : "No active loan"
//           }
//           icon={HandCoins}
//           iconBg="bg-green-50 dark:bg-green-500/10"
//           iconColor="text-green-600 dark:text-green-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Remaining Balance"
//           value={formatCurrency(totalRemaining)}
//           subtitle="Total outstanding principal"
//           icon={AlertCircle}
//           iconBg="bg-red-50 dark:bg-red-500/10"
//           iconColor="text-red-600 dark:text-red-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Total Repaid"
//           value={formatCurrency(totalPaid)}
//           subtitle="Across all loans"
//           icon={CheckCircle2}
//           iconBg="bg-purple-50 dark:bg-purple-500/10"
//           iconColor="text-purple-600 dark:text-purple-400"
//           isLoading={isLoading}
//         />
//       </div>

//       {/* ── Active Loan Progress ─────────────────────────────────────────── */}
//       {activeLoan && (
//         <div className="card p-6">
//           <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
//             Active Loan Repayment Progress
//           </h2>
//           <div className="flex flex-wrap items-center gap-6">
//             <div className="flex-1">
//               <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
//                 <span>
//                   {activeLoan.paidInstallments} of{" "}
//                   {activeLoan.totalInstallments} installments paid
//                 </span>
//                 <span className="font-semibold text-primary">
//                   {Math.round(
//                     (activeLoan.paidInstallments /
//                       activeLoan.totalInstallments) *
//                       100,
//                   )}
//                   %
//                 </span>
//               </div>
//               <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
//                 <div
//                   className="h-2.5 rounded-full bg-primary transition-all"
//                   style={{
//                     width: `${Math.round((activeLoan.paidInstallments / activeLoan.totalInstallments) * 100)}%`,
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="flex gap-6 text-sm">
//               <div className="text-center">
//                 <p className="font-bold text-gray-900 dark:text-white">
//                   {formatCurrency(activeLoan.monthlyInstallment)}
//                 </p>
//                 <p className="text-xs text-gray-400">Monthly EMI</p>
//               </div>
//               <div className="text-center">
//                 <p className="font-bold text-red-600 dark:text-red-400">
//                   {formatCurrency(activeLoan.remainingBalance)}
//                 </p>
//                 <p className="text-xs text-gray-400">Remaining</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Loan History Table ────────────────────────────────────────────── */}
//       <div className="card overflow-hidden">
//         <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//             Loan History
//           </h2>
//           <p className="text-xs text-gray-400">
//             Click a row to view installment schedule
//           </p>
//         </div>
//         <TableRoot>
//           <TableHeader>
//             <TableRow>
//               {[
//                 "#",
//                 "Loan Amount",
//                 "Monthly EMI",
//                 "Remaining",
//                 "Progress",
//                 "Issue Date",
//                 "Status",
//                 "",
//               ].map((h, i) => (
//                 <TableHead
//                   key={i}
//                   className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${
//                     i === 2 || i === 3 ? "text-right" : "text-left"
//                   }`}
//                 >
//                   {h}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <SkeletonRow cols={8} />
//             ) : loans.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} className="py-14 text-center">
//                   <HandCoins className="mx-auto mb-2 h-8 w-8 text-gray-300" />
//                   <p className="text-sm text-gray-400">No loans found</p>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               loans.map((loan, i) => (
//                 <LoanRow key={loan.id} loan={loan} index={i} />
//               ))
//             )}
//           </TableBody>
//         </TableRoot>
//       </div>

//       {/* Loan Request Modal */}
//       <LoanRequestModal
//         isOpen={isRequestModalOpen}
//         onClose={() => setIsRequestModalOpen(false)}
//       />
//     </div>
//   );
// }

"use client";

import LoanRequestModal from "@/components/modals/LoanRequestModal";
import { useMyLoans } from "@/hooks/useMyData";
import { formatCurrency, formatDate } from "@/utils/format";
import { LoanStatus, InstallmentStatus } from "@/types/enums";
import { Loan } from "@/types/loan";
import {
  HandCoins,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Banknote,
  CalendarDays,
  Activity,
} from "lucide-react";
import { useState } from "react";

// ─── Loan Status Badge ────────────────────────────────────────────────────────
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
  const icons: Record<LoanStatus, React.ReactNode> = {
    [LoanStatus.PENDING]: <Clock className="h-3 w-3" />,
    [LoanStatus.APPROVED]: <CheckCircle2 className="h-3 w-3" />,
    [LoanStatus.ACTIVE]: <Activity className="h-3 w-3" />,
    [LoanStatus.COMPLETED]: <CheckCircle2 className="h-3 w-3" />,
    [LoanStatus.REJECTED]: <XCircle className="h-3 w-3" />,
  };
  const labels: Record<LoanStatus, string> = {
    [LoanStatus.PENDING]: "Pending",
    [LoanStatus.APPROVED]: "Approved",
    [LoanStatus.ACTIVE]: "Active",
    [LoanStatus.COMPLETED]: "Completed",
    [LoanStatus.REJECTED]: "Rejected",
  };
  return (
    <span className={map[status] ?? ""}>
      {icons[status]}
      {labels[status] ?? status}
    </span>
  );
}

// ─── Installment Badge ────────────────────────────────────────────────────────
function InstallmentBadge({ status }: { status: InstallmentStatus }) {
  const map: Record<InstallmentStatus, string> = {
    [InstallmentStatus.PENDING]:
      "inline-flex rounded-full bg-warning-light px-2 py-0.5 text-xs font-medium text-warning",
    [InstallmentStatus.PAID]:
      "inline-flex rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success",
    [InstallmentStatus.OVERDUE]:
      "inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };
  const labels = {
    [InstallmentStatus.PENDING]: "Pending",
    [InstallmentStatus.PAID]: "Paid",
    [InstallmentStatus.OVERDUE]: "Overdue",
  };
  return <span className={map[status]}>{labels[status]}</span>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
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

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  badge,
  isLoading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accent: "blue" | "green" | "red" | "purple";
  badge?: string;
  isLoading?: boolean;
}) {
  const a = {
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
    red: {
      bg: "bg-red-500/10",
      icon: "text-red-600 dark:text-red-400",
      ring: "ring-red-500/20",
      badge: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      ring: "ring-purple-500/20",
      badge:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  }[accent];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.bg} ring-1 ${a.ring}`}
        >
          <Icon className={`h-6 w-6 ${a.icon}`} />
        </div>
        {badge && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${a.badge}`}
          >
            <ArrowUpRight className="h-3 w-3" />
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        {isLoading ? (
          <>
            <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
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

// ─── Expandable Loan Row ──────────────────────────────────────────────────────
function LoanRow({ loan, index }: { loan: Loan; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const progress =
    loan.totalInstallments > 0
      ? Math.round((loan.paidInstallments / loan.totalInstallments) * 100)
      : 0;

  const paidCount =
    loan.installments?.filter((i) => i.status === InstallmentStatus.PAID)
      .length ?? 0;
  const overdueCount =
    loan.installments?.filter((i) => i.status === InstallmentStatus.OVERDUE)
      .length ?? 0;

  return (
    <>
      <tr
        className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-6 py-4 text-xs text-dark-4 dark:text-dark-6">
          {index + 1}
        </td>
        <td className="px-6 py-4">
          <p className="font-bold text-dark dark:text-white">
            {formatCurrency(loan.loanAmount)}
          </p>
          <p className="text-xs text-dark-4 dark:text-dark-6">
            {formatCurrency(loan.monthlyInstallment)}/mo EMI
          </p>
        </td>
        <td className="px-6 py-4 text-right">
          <span className="font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(loan.remainingBalance)}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-dark-4 dark:text-dark-6">
              {loan.paidInstallments}/{loan.totalInstallments}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-dark-4 dark:text-dark-6">
            {progress}% repaid
          </p>
        </td>
        <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
          {loan.issueDate ? formatDate(loan.issueDate) : "—"}
        </td>
        <td className="px-6 py-4">
          <LoanStatusBadge status={loan.status} />
        </td>
        <td className="px-6 py-4 text-center text-dark-4 dark:text-dark-6">
          {expanded ? (
            <ChevronDown className="mx-auto h-4 w-4" />
          ) : (
            <ChevronRight className="mx-auto h-4 w-4" />
          )}
        </td>
      </tr>

      {/* ── Expanded Installment Schedule ── */}
      {expanded && loan.installments?.length > 0 && (
        <tr>
          <td colSpan={7} className="bg-gray-50 px-6 py-5 dark:bg-dark-3/30">
            {/* Summary chips */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="mr-2 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                Installment Schedule
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> {paidCount} paid
              </span>
              {overdueCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" /> {overdueCount} overdue
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-dark-4 dark:bg-dark-3 dark:text-dark-6">
                {loan.installments.length - paidCount - overdueCount} pending
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {loan.installments.map((inst) => (
                <div
                  key={inst.id}
                  className={`rounded-xl border p-3 text-xs transition ${
                    inst.status === InstallmentStatus.PAID
                      ? "border-green-200 bg-white dark:border-green-500/20 dark:bg-gray-dark"
                      : inst.status === InstallmentStatus.OVERDUE
                        ? "border-red-200 bg-white dark:border-red-500/20 dark:bg-gray-dark"
                        : "border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-bold text-dark dark:text-white">
                      #{inst.installmentNo}
                    </span>
                    <InstallmentBadge status={inst.status} />
                  </div>
                  <p className="font-semibold text-dark dark:text-white">
                    {formatCurrency(inst.amount)}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-dark-4 dark:text-dark-6">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    {formatDate(inst.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MyLoansPage() {
  const { data: loans = [], isLoading } = useMyLoans();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const activeLoan = loans.find(
    (l) => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.APPROVED,
  );
  const pendingLoans = loans.filter((l) => l.status === LoanStatus.PENDING);
  const totalRemaining = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const totalPaid = loans.reduce(
    (sum, l) => sum + (l.loanAmount - l.remainingBalance),
    0,
  );

  const activePct =
    activeLoan && activeLoan.totalInstallments > 0
      ? Math.round(
          (activeLoan.paidInstallments / activeLoan.totalInstallments) * 100,
        )
      : 0;

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            My Loans
          </h2>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            Track your loan requests, status and repayment schedule
          </p>
        </div>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Request Loan
        </button>
      </div>

      {/* ── Metric Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Loans"
          value={isLoading ? "—" : loans.length}
          subtitle={`${pendingLoans.length} pending approval`}
          icon={CreditCard}
          accent="blue"
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Loan"
          value={activeLoan ? formatCurrency(activeLoan.loanAmount) : "None"}
          subtitle={
            activeLoan
              ? `${activeLoan.paidInstallments}/${activeLoan.totalInstallments} installments paid`
              : "No active loan"
          }
          icon={HandCoins}
          accent="green"
          badge={activeLoan ? "Active" : undefined}
          isLoading={isLoading}
        />
        <MetricCard
          title="Remaining Balance"
          value={formatCurrency(totalRemaining)}
          subtitle="Total outstanding principal"
          icon={AlertCircle}
          accent="red"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Repaid"
          value={formatCurrency(totalPaid)}
          subtitle="Across all loans"
          icon={CheckCircle2}
          accent="purple"
          badge="Paid"
          isLoading={isLoading}
        />
      </div>

      {/* ── Active Loan Progress Card ─────────────────────────────────── */}
      {activeLoan && (
        <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
            <TrendingUp className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <h3 className="text-base font-semibold text-dark dark:text-white">
              Active Loan Repayment Progress
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Progress bar + info */}
              <div className="lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-dark-4 dark:text-dark-6">
                    {activeLoan.paidInstallments} of{" "}
                    {activeLoan.totalInstallments} installments paid
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {activePct}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-dark-4 dark:text-dark-6">
                  <span>{activeLoan.paidInstallments} paid</span>
                  <span>
                    {activeLoan.totalInstallments - activeLoan.paidInstallments}{" "}
                    remaining
                  </span>
                </div>
              </div>

              {/* Metric tiles */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                  <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                    <Banknote className="h-3.5 w-3.5" />
                    Monthly EMI
                  </div>
                  <p className="mt-1 text-base font-bold text-dark dark:text-white">
                    {formatCurrency(activeLoan.monthlyInstallment)}
                  </p>
                </div>
                <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                  <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                    Remaining
                  </div>
                  <p className="mt-1 text-base font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(activeLoan.remainingBalance)}
                  </p>
                </div>
              </div>
            </div>

            {/* Next installment hint if available */}
            {activeLoan.nextInstallment && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3.5 dark:bg-primary/10">
                <CalendarDays className="h-4.5 w-4.5 shrink-0 text-primary" />
                <p className="text-sm text-primary">
                  Next installment{" "}
                  <span className="font-bold">
                    #{activeLoan.nextInstallment.installmentNo}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold">
                    {formatCurrency(activeLoan.nextInstallment.amount)}
                  </span>{" "}
                  due on{" "}
                  <span className="font-bold">
                    {formatDate(activeLoan.nextInstallment.dueDate)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Loan History Table ────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Loan History
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                Click a row to view installment schedule
              </p>
            </div>
          </div>
          {!isLoading && loans.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-dark-4 dark:bg-dark-3 dark:text-dark-6">
              {loans.length} record{loans.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                {[
                  "#",
                  "Loan Amount",
                  "Remaining",
                  "Progress",
                  "Issue Date",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${
                      i === 2 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {isLoading ? (
                <SkeletonRow cols={7} />
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                        <HandCoins className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                        No loans found
                      </p>
                      <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Request your first loan
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                loans.map((loan, i) => (
                  <LoanRow key={loan.id} loan={loan} index={i} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────── */}
      <LoanRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
