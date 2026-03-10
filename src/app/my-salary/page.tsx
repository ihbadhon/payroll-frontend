// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import {
//   TableRoot,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/ui/Table";
// import { useMyActiveSalary, useMyPayslips } from "@/hooks/useMyData";
// import { formatCurrency, formatDate, getMonthName } from "@/utils/format";
// import { PayrollStatus, SalaryStructureStatus } from "@/types/enums";
// import {
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   Receipt,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   BarChart3,
//   Banknote,
//   HandCoins,
//   BadgeDollarSign,
//   CalendarDays,
// } from "lucide-react";

// //  Payroll status badge
// function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
//   const styles: Record<PayrollStatus, string> = {
//     [PayrollStatus.DRAFT]:
//       "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//     [PayrollStatus.APPROVED]:
//       "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//     [PayrollStatus.PAID]:
//       "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//   };
//   const icons: Record<PayrollStatus, React.ReactNode> = {
//     [PayrollStatus.DRAFT]: <Clock className="h-3 w-3" />,
//     [PayrollStatus.APPROVED]: <CheckCircle2 className="h-3 w-3" />,
//     [PayrollStatus.PAID]: <CheckCircle2 className="h-3 w-3" />,
//   };
//   return (
//     <span
//       className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
//     >
//       {icons[status]}
//       {status === PayrollStatus.PAID
//         ? "Paid"
//         : status === PayrollStatus.APPROVED
//           ? "Approved"
//           : "Draft"}
//     </span>
//   );
// }

// function SkeletonRow({ cols }: { cols: number }) {
//   return (
//     <>
//       {[1, 2, 3, 4].map((i) => (
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

// export default function MySalaryPage() {
//   const { data: salary, isLoading: salaryLoading } = useMyActiveSalary();
//   const { data: payslips = [], isLoading: payslipsLoading } = useMyPayslips();

//   const latestPayslip = payslips[0] ?? null;

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="My Salary"
//         description="View your current salary structure, loan info and payslip history"
//       />

//       {/*  Stat Cards  */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Gross Salary"
//           value={salary ? formatCurrency(salary.grossSalary) : ""}
//           subtitle={
//             salary?.status === SalaryStructureStatus.APPROVED
//               ? "Active & approved"
//               : "Pending approval"
//           }
//           icon={Wallet}
//           iconBg="bg-blue-50 dark:bg-blue-500/10"
//           iconColor="text-blue-600 dark:text-blue-400"
//           isLoading={salaryLoading}
//         />
//         <StatCard
//           title="Effective Net Salary"
//           value={salary ? formatCurrency(salary.effectiveNetSalary) : ""}
//           subtitle="After loan deduction"
//           icon={TrendingUp}
//           iconBg="bg-green-50 dark:bg-green-500/10"
//           iconColor="text-green-600 dark:text-green-400"
//           isLoading={salaryLoading}
//         />
//         <StatCard
//           title="Loan Deduction"
//           value={
//             salary?.loanDeduction
//               ? formatCurrency(salary.loanDeduction)
//               : "None"
//           }
//           subtitle={
//             salary?.activeLoan ? "Monthly EMI deducted" : "No active loan"
//           }
//           icon={HandCoins}
//           iconBg="bg-orange-50 dark:bg-orange-500/10"
//           iconColor="text-orange-600 dark:text-orange-400"
//           isLoading={salaryLoading}
//         />
//         <StatCard
//           title="This Month Bonus"
//           value={
//             salary?.totalBonusAmount
//               ? formatCurrency(salary.totalBonusAmount)
//               : "None"
//           }
//           subtitle={`${salary?.currentMonthBonuses?.length ?? 0} bonus(es) this month`}
//           icon={BadgeDollarSign}
//           iconBg="bg-purple-50 dark:bg-purple-500/10"
//           iconColor="text-purple-600 dark:text-purple-400"
//           isLoading={salaryLoading}
//         />
//       </div>

//       {/*  Salary Breakdown + Components  */}
//       {(salary || salaryLoading) && (
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* Summary card */}
//           <div className="card p-6">
//             <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
//               <BarChart3 className="h-4 w-4 text-primary" />
//               Salary Summary
//             </h2>
//             {salaryLoading ? (
//               <div className="space-y-3">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div
//                     key={i}
//                     className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
//                   />
//                 ))}
//               </div>
//             ) : salary ? (
//               <div className="space-y-2">
//                 {[
//                   {
//                     label: "Gross Salary",
//                     value: salary.grossSalary,
//                     color: "text-blue-600 dark:text-blue-400",
//                   },
//                   {
//                     label: "Total Earnings",
//                     value: salary.totalEarnings,
//                     color: "text-green-600 dark:text-green-400",
//                   },
//                   {
//                     label: "Total Deductions",
//                     value: salary.totalDeductions,
//                     color: "text-red-600 dark:text-red-400",
//                   },
//                   {
//                     label: "Loan Deduction",
//                     value: salary.loanDeduction,
//                     color: "text-orange-600 dark:text-orange-400",
//                   },
//                   {
//                     label: "Effective Net Pay",
//                     value: salary.effectiveNetSalary,
//                     color: "text-gray-900 dark:text-white",
//                     bold: true,
//                   },
//                 ].map(({ label, value, color, bold }) => (
//                   <div
//                     key={label}
//                     className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${bold ? "border border-primary/20 bg-primary/5" : "border border-gray-100 bg-gray-50 dark:border-dark-3 dark:bg-dark-3"}`}
//                   >
//                     <span
//                       className={`text-sm ${bold ? "font-semibold text-gray-700 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}
//                     >
//                       {label}
//                     </span>
//                     <span
//                       className={`text-sm font-${bold ? "bold" : "semibold"} ${color}`}
//                     >
//                       {formatCurrency(value)}
//                     </span>
//                   </div>
//                 ))}

//                 <div className="mt-3 space-y-1 rounded-lg border border-dashed border-gray-200 px-4 py-3 dark:border-dark-3">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`h-2 w-2 rounded-full ${salary.status === SalaryStructureStatus.APPROVED ? "bg-green-500" : "bg-yellow-500"}`}
//                     />
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Status:{" "}
//                       <span className="font-semibold text-gray-700 dark:text-gray-200">
//                         {salary.status}
//                       </span>
//                     </p>
//                   </div>
//                   {salary.effectiveFrom && (
//                     <p className="flex items-center gap-1.5 text-xs text-gray-400">
//                       <CalendarDays className="h-3 w-3" />
//                       Effective: {formatDate(salary.effectiveFrom)}
//                     </p>
//                   )}
//                   {salary.approvedAt && (
//                     <p className="text-xs text-gray-400">
//                       Approved: {formatDate(salary.approvedAt)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ) : null}
//           </div>

//           {/* Components table */}
//           <div className="card overflow-hidden lg:col-span-2">
//             <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//               <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//                 Salary Components
//               </h2>
//               <p className="text-xs text-gray-400">
//                 Allowances applied to your gross salary
//               </p>
//             </div>
//             <TableRoot>
//               <TableHeader>
//                 <TableRow>
//                   {["#", "Component", "Percentage", "Amount (BDT)"].map(
//                     (h, i) => (
//                       <TableHead
//                         key={h}
//                         className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${i >= 2 ? "text-right" : "text-left"}`}
//                       >
//                         {h}
//                       </TableHead>
//                     ),
//                   )}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {salaryLoading ? (
//                   <SkeletonRow cols={4} />
//                 ) : !salary?.components?.length ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={4}
//                       className="py-10 text-center text-sm text-gray-400"
//                     >
//                       No components defined
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   salary.components.map((comp, i) => (
//                     <TableRow
//                       key={i}
//                       className="hover:bg-gray-50 dark:hover:bg-dark-3/50"
//                     >
//                       <TableCell className="text-center text-xs text-gray-400">
//                         {i + 1}
//                       </TableCell>
//                       <TableCell className="font-medium text-gray-900 dark:text-white">
//                         {comp.title}
//                       </TableCell>
//                       <TableCell className="text-right text-gray-500 dark:text-gray-400">
//                         {comp.value}%
//                       </TableCell>
//                       <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
//                         {formatCurrency(comp.amount)}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </TableRoot>
//           </div>
//         </div>
//       )}

//       {/*  Active Loan Info  */}
//       {salary?.activeLoan && (
//         <div className="card p-6">
//           <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
//             <HandCoins className="h-4 w-4 text-orange-500" />
//             Active Loan
//           </h2>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//             {[
//               {
//                 label: "Loan Amount",
//                 value: formatCurrency(salary.activeLoan.loanAmount),
//               },
//               {
//                 label: "Monthly EMI",
//                 value: formatCurrency(salary.activeLoan.monthlyInstallment),
//               },
//               {
//                 label: "Remaining Balance",
//                 value: formatCurrency(salary.activeLoan.remainingBalance),
//               },
//               {
//                 label: "Total Installments",
//                 value: salary.activeLoan.totalInstallments.toString(),
//               },
//               {
//                 label: "Paid",
//                 value: salary.activeLoan.paidInstallments.toString(),
//               },
//               {
//                 label: "Remaining",
//                 value: (
//                   salary.activeLoan.totalInstallments -
//                   salary.activeLoan.paidInstallments
//                 ).toString(),
//               },
//             ].map(({ label, value }) => (
//               <div
//                 key={label}
//                 className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3"
//               >
//                 <p className="text-xs text-gray-400">{label}</p>
//                 <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
//                   {value}
//                 </p>
//               </div>
//             ))}
//           </div>
//           {salary.activeLoan.nextInstallment && (
//             <div className="mt-4 flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 dark:border-orange-500/20 dark:bg-orange-500/10">
//               <CalendarDays className="h-4 w-4 shrink-0 text-orange-500" />
//               <p className="text-sm text-orange-700 dark:text-orange-300">
//                 Next installment{" "}
//                 <span className="font-bold">
//                   #{salary.activeLoan.nextInstallment.installmentNo}
//                 </span>{" "}
//                 of{" "}
//                 <span className="font-bold">
//                   {formatCurrency(salary.activeLoan.nextInstallment.amount)}
//                 </span>{" "}
//                 due on{" "}
//                 <span className="font-bold">
//                   {formatDate(salary.activeLoan.nextInstallment.dueDate)}
//                 </span>
//               </p>
//             </div>
//           )}
//           {/* Repayment progress */}
//           <div className="mt-4">
//             <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
//               <span>Repayment Progress</span>
//               <span>
//                 {Math.round(
//                   (salary.activeLoan.paidInstallments /
//                     salary.activeLoan.totalInstallments) *
//                     100,
//                 )}
//                 %
//               </span>
//             </div>
//             <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
//               <div
//                 className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all"
//                 style={{
//                   width: `${Math.round((salary.activeLoan.paidInstallments / salary.activeLoan.totalInstallments) * 100)}%`,
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/*  Current Month Bonuses  */}
//       {salary?.currentMonthBonuses && salary.currentMonthBonuses.length > 0 && (
//         <div className="card overflow-hidden">
//           <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//             <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//               This Month&apos;s Bonuses
//             </h2>
//           </div>
//           <TableRoot>
//             <TableHeader>
//               <TableRow>
//                 {["Type", "Reason", "Month", "Amount"].map((h, i) => (
//                   <TableHead
//                     key={h}
//                     className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${i === 3 ? "text-right" : "text-left"}`}
//                   >
//                     {h}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {salary.currentMonthBonuses.map((b) => (
//                 <TableRow
//                   key={b.id}
//                   className="hover:bg-gray-50 dark:hover:bg-dark-3/50"
//                 >
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {b.bonusType}
//                   </TableCell>
//                   <TableCell className="text-gray-500 dark:text-gray-400">
//                     {b.reason ?? ""}
//                   </TableCell>
//                   <TableCell className="text-gray-500 dark:text-gray-400">
//                     {getMonthName(b.month)} {b.year}
//                   </TableCell>
//                   <TableCell className="text-right font-bold text-purple-600 dark:text-purple-400">
//                     {formatCurrency(b.amount)}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </TableRoot>
//         </div>
//       )}

//       {/*  Payslip History  */}
//       <div className="card overflow-hidden">
//         <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//             Payslip History
//           </h2>
//           <p className="text-xs text-gray-400">Your monthly payroll records</p>
//         </div>
//         <TableRoot>
//           <TableHeader>
//             <TableRow>
//               {[
//                 "Period",
//                 "Basic Salary",
//                 "Gross Salary",
//                 "Earnings",
//                 "Deductions",
//                 "Net Salary",
//                 "Status",
//               ].map((h, i) => (
//                 <TableHead
//                   key={h}
//                   className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${i >= 1 && i <= 5 ? "text-right" : "text-left"}`}
//                 >
//                   {h}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {payslipsLoading ? (
//               <SkeletonRow cols={7} />
//             ) : payslips.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="py-14 text-center">
//                   <XCircle className="mx-auto mb-2 h-8 w-8 text-gray-300" />
//                   <p className="text-sm text-gray-400">No payslips found yet</p>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               payslips.map((p) => (
//                 <TableRow
//                   key={p.id}
//                   className="hover:bg-gray-50 dark:hover:bg-dark-3/50"
//                 >
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {getMonthName(p.payroll.month, true)} {p.payroll.year}
//                   </TableCell>
//                   <TableCell className="text-right text-gray-600 dark:text-gray-400">
//                     {formatCurrency(p.basicSalary)}
//                   </TableCell>
//                   <TableCell className="text-right text-gray-600 dark:text-gray-400">
//                     {formatCurrency(p.grossSalary)}
//                   </TableCell>
//                   <TableCell className="text-right text-green-600 dark:text-green-400">
//                     +{formatCurrency(p.totalEarnings)}
//                   </TableCell>
//                   <TableCell className="text-right text-red-500 dark:text-red-400">
//                     -{formatCurrency(p.totalDeductions)}
//                   </TableCell>
//                   <TableCell className="text-right font-bold text-gray-900 dark:text-white">
//                     {formatCurrency(p.netSalary)}
//                   </TableCell>
//                   <TableCell>
//                     <PayrollStatusBadge status={p.status} />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </TableRoot>
//       </div>
//     </div>
//   );
// }

"use client";

import PageHeader from "@/components/layout/PageHeader";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useMyActiveSalary, useMyPayslips } from "@/hooks/useMyData";
import { formatCurrency, formatDate, getMonthName } from "@/utils/format";
import { PayrollStatus, SalaryStructureStatus } from "@/types/enums";
import {
  Wallet,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  HandCoins,
  BadgeDollarSign,
  CalendarDays,
  ArrowUpRight,
  Layers,
  Download,
  AlertCircle,
} from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const map: Record<
    PayrollStatus,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    [PayrollStatus.DRAFT]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
      icon: <Clock className="h-3 w-3" />,
      label: "Draft",
    },
    [PayrollStatus.APPROVED]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Approved",
    },
    [PayrollStatus.PAID]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Paid",
    },
  };
  const { cls, icon, label } = map[status] ?? {
    cls: "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600",
    icon: null,
    label: status,
  };
  return (
    <span className={cls}>
      {icon}
      {label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
            </TableCell>
          ))}
        </TableRow>
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
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: "blue" | "green" | "orange" | "purple";
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
    orange: {
      bg: "bg-orange-500/10",
      icon: "text-orange-600 dark:text-orange-400",
      ring: "ring-orange-500/20",
      badge:
        "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
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
    <div className="rounded-[10px] border border-stroke bg-white p-6  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
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
              {value || "—"}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MySalaryPage() {
  const { data: salary, isLoading: salaryLoading } = useMyActiveSalary();
  const { data: payslips = [], isLoading: payslipsLoading } = useMyPayslips();

  const loanPct =
    salary?.activeLoan && salary.activeLoan.totalInstallments > 0
      ? Math.round(
          (salary.activeLoan.paidInstallments /
            salary.activeLoan.totalInstallments) *
            100,
        )
      : 0;

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            My Salary
          </h2>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            View your current salary structure, loan info and payslip history
          </p>
        </div>
        {salary && (
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              salary.status === SalaryStructureStatus.APPROVED
                ? "bg-success-light text-success"
                : "bg-warning-light text-warning"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {salary.status === SalaryStructureStatus.APPROVED
              ? "Active & Approved"
              : "Pending Approval"}
          </span>
        )}
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Gross Salary"
          value={salary ? formatCurrency(salary.grossSalary) : ""}
          subtitle={
            salary?.status === SalaryStructureStatus.APPROVED
              ? "Active & approved"
              : "Pending approval"
          }
          icon={Wallet}
          accent="blue"
          badge="Gross"
          isLoading={salaryLoading}
        />
        <MetricCard
          title="Effective Net Salary"
          value={salary ? formatCurrency(salary.effectiveNetSalary) : ""}
          subtitle="After loan deduction"
          icon={TrendingUp}
          accent="green"
          badge="Net"
          isLoading={salaryLoading}
        />
        <MetricCard
          title="Loan Deduction"
          value={
            salary?.loanDeduction
              ? formatCurrency(salary.loanDeduction)
              : "None"
          }
          subtitle={
            salary?.activeLoan ? "Monthly EMI deducted" : "No active loan"
          }
          icon={HandCoins}
          accent="orange"
          isLoading={salaryLoading}
        />
        <MetricCard
          title="This Month Bonus"
          value={
            salary?.totalBonusAmount
              ? formatCurrency(salary.totalBonusAmount)
              : "None"
          }
          subtitle={`${salary?.currentMonthBonuses?.length ?? 0} bonus(es) this month`}
          icon={BadgeDollarSign}
          accent="purple"
          isLoading={salaryLoading}
        />
      </div>

      {/* ── Salary Summary + Components ──────────────────────────────── */}
      {(salary || salaryLoading) && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Summary Card */}
          <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
            <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
              <BarChart3 className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Salary Summary
              </h3>
            </div>

            {salaryLoading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
                  />
                ))}
              </div>
            ) : salary ? (
              <div className="p-6">
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Gross Salary",
                      value: salary.grossSalary,
                      color: "text-blue-600 dark:text-blue-400",
                      bold: false,
                    },
                    {
                      label: "Total Earnings",
                      value: salary.totalEarnings,
                      color: "text-green-600 dark:text-green-400",
                      bold: false,
                    },
                    {
                      label: "Total Deductions",
                      value: salary.totalDeductions,
                      color: "text-red-500 dark:text-red-400",
                      bold: false,
                    },
                    {
                      label: "Loan Deduction",
                      value: salary.loanDeduction,
                      color: "text-orange-600 dark:text-orange-400",
                      bold: false,
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 px-4 py-2.5 dark:border-dark-3 dark:bg-dark-3"
                    >
                      <span className="text-sm text-dark-4 dark:text-dark-6">
                        {label}
                      </span>
                      <span className={`text-sm font-semibold ${color}`}>
                        {formatCurrency(value)}
                      </span>
                    </div>
                  ))}

                  {/* Net Pay highlight */}
                  <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 dark:bg-primary/10">
                    <span className="text-sm font-semibold text-dark dark:text-white">
                      Effective Net Pay
                    </span>
                    <span className="text-base font-bold text-primary">
                      {formatCurrency(salary.effectiveNetSalary)}
                    </span>
                  </div>
                </div>

                {/* Meta info */}
                <div className="mt-4 space-y-1.5 rounded-lg border border-dashed border-stroke px-4 py-3 dark:border-dark-3">
                  {salary.effectiveFrom && (
                    <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Effective:{" "}
                      <span className="font-medium text-dark dark:text-white">
                        {formatDate(salary.effectiveFrom)}
                      </span>
                    </div>
                  )}
                  {salary.approvedAt && (
                    <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Approved:{" "}
                      <span className="font-medium text-dark dark:text-white">
                        {formatDate(salary.approvedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Components Table */}
          <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
              <div className="flex items-center gap-2.5">
                <Layers className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
                <div>
                  <h3 className="text-base font-semibold text-dark dark:text-white">
                    Salary Components
                  </h3>
                  <p className="text-xs text-dark-4 dark:text-dark-6">
                    Allowances applied to your gross salary
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    {["#", "Component", "Percentage", "Amount (BDT)"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${i >= 2 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {salaryLoading ? (
                    <SkeletonRow cols={4} />
                  ) : !salary?.components?.length ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                          <p className="text-sm text-dark-4 dark:text-dark-6">
                            No components defined
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    salary.components.map((comp, i) => (
                      <tr
                        key={i}
                        className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <td className="px-6 py-4 text-xs text-dark-4 dark:text-dark-6">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-dark dark:text-white">
                          {comp.title}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-dark-4 dark:bg-dark-3 dark:text-dark-6">
                            {comp.value}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-dark dark:text-white">
                          {formatCurrency(comp.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Loan ──────────────────────────────────────────────── */}
      {salary?.activeLoan && (
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
          <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
            <HandCoins className="h-4.5 w-4.5 text-orange-500" />
            <h3 className="text-base font-semibold text-dark dark:text-white">
              Active Loan
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  label: "Loan Amount",
                  value: formatCurrency(salary.activeLoan.loanAmount),
                },
                {
                  label: "Monthly EMI",
                  value: formatCurrency(salary.activeLoan.monthlyInstallment),
                },
                {
                  label: "Remaining Balance",
                  value: formatCurrency(salary.activeLoan.remainingBalance),
                },
                {
                  label: "Total Installments",
                  value: salary.activeLoan.totalInstallments.toString(),
                },
                {
                  label: "Paid",
                  value: salary.activeLoan.paidInstallments.toString(),
                },
                {
                  label: "Remaining",
                  value: (
                    salary.activeLoan.totalInstallments -
                    salary.activeLoan.paidInstallments
                  ).toString(),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3"
                >
                  <p className="text-xs text-dark-4 dark:text-dark-6">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-dark dark:text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Next installment alert */}
            {salary.activeLoan.nextInstallment && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-5 py-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                <CalendarDays className="h-4.5 w-4.5 shrink-0 text-orange-500" />
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Next installment{" "}
                  <span className="font-bold">
                    #{salary.activeLoan.nextInstallment.installmentNo}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold">
                    {formatCurrency(salary.activeLoan.nextInstallment.amount)}
                  </span>{" "}
                  due on{" "}
                  <span className="font-bold">
                    {formatDate(salary.activeLoan.nextInstallment.dueDate)}
                  </span>
                </p>
              </div>
            )}

            {/* Repayment progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-dark-4 dark:text-dark-6">
                  Repayment Progress
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">
                  {loanPct}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700"
                  style={{ width: `${loanPct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-dark-4 dark:text-dark-6">
                <span>{salary.activeLoan.paidInstallments} paid</span>
                <span>
                  {salary.activeLoan.totalInstallments -
                    salary.activeLoan.paidInstallments}{" "}
                  remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── This Month's Bonuses ─────────────────────────────────────── */}
      {salary?.currentMonthBonuses && salary.currentMonthBonuses.length > 0 && (
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
          <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
            <BadgeDollarSign className="h-4.5 w-4.5 text-purple-500" />
            <h3 className="text-base font-semibold text-dark dark:text-white">
              This Month's Bonuses
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  {["Type", "Reason", "Month", "Amount"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${i === 3 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-dark-3">
                {salary.currentMonthBonuses.map((b) => (
                  <tr
                    key={b.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                  >
                    <td className="px-6 py-4 font-medium text-dark dark:text-white">
                      {b.bonusType}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                      {b.reason ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                      {getMonthName(b.month)} {b.year}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(b.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Payslip History ──────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <Receipt className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Payslip History
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                Your monthly payroll records
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                {[
                  "Period",
                  "Basic Salary",
                  "Gross Salary",
                  "Earnings",
                  "Deductions",
                  "Net Salary",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${i >= 1 && i <= 5 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {payslipsLoading ? (
                <SkeletonRow cols={8} />
              ) : payslips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                        <Receipt className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                        No payslips found yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payslips.map((p) => (
                  <tr
                    key={p.id}
                    className="group transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                  >
                    <td className="px-6 py-4 font-semibold text-dark dark:text-white">
                      {getMonthName(p.payroll.month, true)} {p.payroll.year}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-dark-4 dark:text-dark-6">
                      {formatCurrency(p.basicSalary)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-dark-4 dark:text-dark-6">
                      {formatCurrency(p.grossSalary)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600 dark:text-green-400">
                      +{formatCurrency(p.totalEarnings)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-red-500 dark:text-red-400">
                      -{formatCurrency(p.totalDeductions)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-dark dark:text-white">
                      {formatCurrency(p.netSalary)}
                    </td>
                    <td className="px-6 py-4">
                      <PayrollStatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="invisible rounded-lg border border-stroke p-1.5 text-dark-4 transition hover:border-primary hover:text-primary group-hover:visible dark:border-dark-3 dark:text-dark-6">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
