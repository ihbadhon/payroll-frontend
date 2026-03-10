// "use client";

// import Link from "next/link";
// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import { useAuth } from "@/store/auth.context";
// import {
//   useMyActiveSalary,
//   useMyBonuses,
//   useMyLoans,
//   useMyPayslips,
// } from "@/hooks/useMyData";
// import { formatCurrency, getMonthName } from "@/utils/format";
// import { LoanStatus, BonusStatus, PayrollStatus } from "@/types/enums";
// import {
//   Wallet,
//   HandCoins,
//   BadgeDollarSign,
//   Receipt,
//   CheckCircle2,
//   XCircle,
//   ArrowRight,
//   Mail,
//   ShieldCheck,
//   TrendingUp,
//   AlertCircle,
//   ChevronRight,
// } from "lucide-react";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
//   const map: Record<PayrollStatus, { cls: string; label: string }> = {
//     [PayrollStatus.DRAFT]: {
//       cls: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//       label: "Draft",
//     },
//     [PayrollStatus.APPROVED]: {
//       cls: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//       label: "Approved",
//     },
//     [PayrollStatus.PAID]: {
//       cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//       label: "Paid",
//     },
//   };
//   const { cls, label } = map[status] ?? {
//     cls: "bg-gray-100 text-gray-600",
//     label: status,
//   };
//   return (
//     <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
//       {label}
//     </span>
//   );
// }

// function LoanStatusBadge({ status }: { status: LoanStatus }) {
//   const map: Record<LoanStatus, string> = {
//     [LoanStatus.PENDING]:
//       "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//     [LoanStatus.APPROVED]:
//       "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//     [LoanStatus.ACTIVE]:
//       "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//     [LoanStatus.COMPLETED]:
//       "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-gray-400",
//     [LoanStatus.REJECTED]:
//       "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
//   };
//   return (
//     <span
//       className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? ""}`}
//     >
//       {status.charAt(0) + status.slice(1).toLowerCase()}
//     </span>
//   );
// }

// function BonusStatusDot({ status }: { status: BonusStatus }) {
//   const colors: Record<BonusStatus, string> = {
//     [BonusStatus.PENDING]: "bg-yellow-400",
//     [BonusStatus.APPROVED]: "bg-blue-400",
//     [BonusStatus.PAID]: "bg-green-400",
//   };
//   return (
//     <span
//       className={`inline-block h-2 w-2 rounded-full ${colors[status] ?? "bg-gray-300"}`}
//     />
//   );
// }

// function SectionHeader({ title, href }: { title: string; href: string }) {
//   return (
//     <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//       <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//         {title}
//       </h2>
//       <Link
//         href={href}
//         className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
//       >
//         View all <ArrowRight className="h-3.5 w-3.5" />
//       </Link>
//     </div>
//   );
// }

// function TableSkeleton({ cols, rows = 3 }: { cols: number; rows?: number }) {
//   return (
//     <>
//       {Array.from({ length: rows }).map((_, i) => (
//         <tr key={i}>
//           {Array.from({ length: cols }).map((_, j) => (
//             <td key={j} className="px-4 py-3">
//               <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-dark-3" />
//             </td>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// }

// export default function EmployeeDashboard() {
//   const { user } = useAuth();
//   const { data: salary, isLoading: salaryLoading } = useMyActiveSalary();
//   const { data: loans = [], isLoading: loansLoading } = useMyLoans();
//   const { data: bonuses = [], isLoading: bonusesLoading } = useMyBonuses();
//   const { data: payslips = [], isLoading: payslipsLoading } = useMyPayslips();

//   const activeLoans = loans.filter(
//     (l) => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.PENDING,
//   );
//   const pendingBonuses = bonuses.filter(
//     (b) =>
//       b.status === BonusStatus.PENDING || b.status === BonusStatus.APPROVED,
//   );
//   const pendingBonusTotal = pendingBonuses.reduce(
//     (s, b) => s + parseFloat(b.amount),
//     0,
//   );
//   const latestPayslip = payslips[0];
//   const recentPayslips = payslips.slice(0, 5);
//   const recentBonuses = bonuses.slice(0, 4);
//   const recentLoans = loans.slice(0, 3);

//   const initials = (user?.name ?? "U")
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="space-y-6">
//       {/* ── Header ───────────────────────────────────────────────────── */}
//       <PageHeader
//         title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}!`}
//         description="Here's an overview of your salary, loans, bonuses and payslips."
//       />

//       {/* ── Stat Cards ───────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Current Gross Salary"
//           value={salary ? formatCurrency(salary.grossSalary) : "—"}
//           subtitle="Active salary structure"
//           icon={Wallet}
//           iconBg="bg-blue-50 dark:bg-blue-500/10"
//           iconColor="text-blue-600 dark:text-blue-400"
//           isLoading={salaryLoading}
//         />
//         <StatCard
//           title="Active / Pending Loans"
//           value={
//             activeLoans.length > 0
//               ? formatCurrency(
//                   activeLoans.reduce((s, l) => s + l.remainingBalance, 0),
//                 )
//               : "None"
//           }
//           subtitle={`${activeLoans.length} loan(s) outstanding`}
//           icon={HandCoins}
//           iconBg="bg-orange-50 dark:bg-orange-500/10"
//           iconColor="text-orange-600 dark:text-orange-400"
//           isLoading={loansLoading}
//         />
//         <StatCard
//           title="Pending Bonuses"
//           value={
//             pendingBonuses.length > 0
//               ? formatCurrency(pendingBonusTotal)
//               : "None"
//           }
//           subtitle={`${pendingBonuses.length} bonus(es) awaiting payment`}
//           icon={BadgeDollarSign}
//           iconBg="bg-purple-50 dark:bg-purple-500/10"
//           iconColor="text-purple-600 dark:text-purple-400"
//           isLoading={bonusesLoading}
//         />
//         <StatCard
//           title="Latest Net Pay"
//           value={latestPayslip ? formatCurrency(latestPayslip.netSalary) : "—"}
//           subtitle={
//             latestPayslip
//               ? `${getMonthName(latestPayslip.payroll.month)} ${latestPayslip.payroll.year}`
//               : "No payslips yet"
//           }
//           icon={Receipt}
//           iconBg="bg-green-50 dark:bg-green-500/10"
//           iconColor="text-green-600 dark:text-green-400"
//           isLoading={payslipsLoading}
//         />
//       </div>

//       {/* ── Profile + Salary ─────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
//         {/* Profile Card */}
//         {/* <div className="card p-6">
//           <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
//             My Profile
//           </h2>
//           <div className="flex flex-col items-center gap-3 text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
//               {initials}
//             </div>
//             <div>
//               <p className="text-base font-semibold text-gray-900 dark:text-white">
//                 {user?.name}
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 {user?.role?.name}
//               </p>
//             </div>
//           </div>
//           <div className="mt-5 space-y-3">
//             <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-dark-3">
//               <Mail className="h-4 w-4 shrink-0 text-gray-600 dark:text-gray-400" />
//               <span className="truncate text-sm text-gray-700 dark:text-gray-300">
//                 {user?.email}
//               </span>
//             </div>
//             <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-dark-3">
//               <ShieldCheck className="h-4 w-4 shrink-0 text-gray-600 dark:text-gray-400" />
//               <span className="text-sm text-gray-700 dark:text-gray-300">
//                 {user?.role?.name}
//               </span>
//             </div>
//             <div className="mt-4 space-y-2">
//               {[
//                 { label: "Email Verified", ok: user?.isVerified ?? false },
//                 { label: "Account Active", ok: user?.isActive ?? false },
//               ].map(({ label, ok }) => (
//                 <div key={label} className="flex items-center justify-between">
//                   <span className="text-xs text-gray-600 dark:text-gray-400">
//                     {label}
//                   </span>
//                   {ok ? (
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                   ) : (
//                     <XCircle className="h-4 w-4 text-red-400" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div> */}

//         {/* Salary Structure Card */}
//         {/* <div className="card lg:col-span-2">
//           <SectionHeader title="Salary Structure" href="/my-salary" />
//           {salaryLoading ? (
//             <div className="p-6 space-y-3">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
//                 />
//               ))}
//             </div>
//           ) : salary ? (
//             <div className="p-5">
//               <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
//                 {[
//                   {
//                     label: "Gross Salary",
//                     value: formatCurrency(salary.grossSalary),
//                   },
//                   {
//                     label: "Net Salary",
//                     value: formatCurrency(salary.effectiveNetSalary),
//                   },
//                   {
//                     label: "Loan Deduction",
//                     value: salary.loanDeduction
//                       ? formatCurrency(salary.loanDeduction)
//                       : "None",
//                   },
//                   {
//                     label: "Components",
//                     value: `${salary.components?.length ?? 0} items`,
//                   },
//                 ].map(({ label, value }) => (
//                   <div
//                     key={label}
//                     className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3"
//                   >
//                     <p className="text-xs text-gray-600 dark:text-gray-400">
//                       {label}
//                     </p>
//                     <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
//                       {value}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
//               <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-600" />
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 No salary structure assigned yet
//               </p>
//             </div>
//           )}
//         </div> */}
//       </div>

//       {/* ── Recent Payslips + Recent Loans ────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
//         {/* Recent Payslips */}
//         <div className="card">
//           <SectionHeader title="Recent Payslips" href="/my-payslips" />
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 dark:bg-dark-3">
//                   <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
//                     Period
//                   </th>
//                   <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">
//                     Net Pay
//                   </th>
//                   <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50 dark:divide-dark-3">
//                 {payslipsLoading ? (
//                   <TableSkeleton cols={3} />
//                 ) : recentPayslips.length > 0 ? (
//                   recentPayslips.map((p) => (
//                     <tr
//                       key={p.id}
//                       className="hover:bg-gray-50 dark:hover:bg-dark-3"
//                     >
//                       <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
//                         {getMonthName(p.payroll.month)} {p.payroll.year}
//                       </td>
//                       <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
//                         {formatCurrency(p.netSalary)}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <PayrollStatusBadge status={p.status} />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400"
//                     >
//                       No payslips found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Loans */}
//         <div className="card">
//           <SectionHeader title="My Loans" href="/my-loans" />
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 dark:bg-dark-3">
//                   <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
//                     Amount
//                   </th>
//                   <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">
//                     Remaining
//                   </th>
//                   <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50 dark:divide-dark-3">
//                 {loansLoading ? (
//                   <TableSkeleton cols={3} />
//                 ) : recentLoans.length > 0 ? (
//                   recentLoans.map((l) => {
//                     const pct =
//                       l.totalInstallments > 0
//                         ? Math.round(
//                             (l.paidInstallments / l.totalInstallments) * 100,
//                           )
//                         : 0;
//                     return (
//                       <tr
//                         key={l.id}
//                         className="hover:bg-gray-50 dark:hover:bg-dark-3"
//                       >
//                         <td className="px-4 py-3">
//                           <p className="font-medium text-gray-900 dark:text-white">
//                             {formatCurrency(l.loanAmount)}
//                           </p>
//                           <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
//                             <div
//                               className="h-full rounded-full bg-blue-500"
//                               style={{ width: `${pct}%` }}
//                             />
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 text-right font-semibold text-orange-600 dark:text-orange-400">
//                           {formatCurrency(l.remainingBalance)}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <LoanStatusBadge status={l.status} />
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400"
//                     >
//                       No loans found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ── Recent Bonuses ────────────────────────────────────────────── */}
//       <div className="card">
//         <SectionHeader title="Recent Bonuses" href="/my-bonuses" />
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-gray-50 dark:bg-dark-3">
//                 <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
//                   Type
//                 </th>
//                 <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
//                   Period
//                 </th>
//                 <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
//                   Reason
//                 </th>
//                 <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">
//                   Amount
//                 </th>
//                 <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50 dark:divide-dark-3">
//               {bonusesLoading ? (
//                 <TableSkeleton cols={5} />
//               ) : recentBonuses.length > 0 ? (
//                 recentBonuses.map((b) => (
//                   <tr
//                     key={b.id}
//                     className="hover:bg-gray-50 dark:hover:bg-dark-3"
//                   >
//                     <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
//                       {b.bonusType}
//                     </td>
//                     <td className="px-4 py-3 text-gray-700 dark:text-gray-400">
//                       {getMonthName(b.month)} {b.year}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
//                       {b.reason ?? "—"}
//                     </td>
//                     <td className="px-4 py-3 text-right font-semibold text-purple-600 dark:text-purple-400">
//                       {formatCurrency(b.amount)}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className="inline-flex items-center gap-1.5">
//                         <BonusStatusDot status={b.status} />
//                         <span className="text-xs text-gray-600 dark:text-gray-400">
//                           {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
//                         </span>
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400"
//                   >
//                     No bonuses found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Quick Links ───────────────────────────────────────────────── */}
//       <div>
//         <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
//           Quick Access
//         </p>
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//           {[
//             {
//               label: "My Salary",
//               desc: "Salary structure & history",
//               href: "/my-salary",
//               icon: Wallet,
//               color: "text-blue-600 dark:text-blue-400",
//               bg: "bg-blue-50 dark:bg-blue-500/10",
//             },
//             {
//               label: "My Loans",
//               desc: "Track loan repayments",
//               href: "/my-loans",
//               icon: HandCoins,
//               color: "text-orange-600 dark:text-orange-400",
//               bg: "bg-orange-50 dark:bg-orange-500/10",
//             },
//             {
//               label: "My Bonuses",
//               desc: "Earned bonuses & status",
//               href: "/my-bonuses",
//               icon: BadgeDollarSign,
//               color: "text-purple-600 dark:text-purple-400",
//               bg: "bg-purple-50 dark:bg-purple-500/10",
//             },
//             {
//               label: "My Payslips",
//               desc: "Monthly payslip records",
//               href: "/my-payslips",
//               icon: Receipt,
//               color: "text-green-600 dark:text-green-400",
//               bg: "bg-green-50 dark:bg-green-500/10",
//             },
//           ].map(({ label, desc, href, icon: Icon, color, bg }) => (
//             <Link
//               key={href}
//               href={href}
//               className="card group flex items-center gap-3 p-4 transition hover:shadow-md"
//             >
//               <div
//                 className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
//               >
//                 <Icon className={`h-5 w-5 ${color}`} />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                   {label}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400">
//                   {desc}
//                 </p>
//               </div>
//               <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* ── Growth Banner ─────────────────────────────────────────────── */}
//       <div className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
//         <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
//         <div>
//           <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
//             Stay on top of your financials
//           </p>
//           <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
//             Use the quick links above to view detailed breakdowns of your
//             salary, track loan instalments, and download payslips anytime.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { useAuth } from "@/store/auth.context";
import {
  useMyActiveSalary,
  useMyBonuses,
  useMyLoans,
  useMyPayslips,
} from "@/hooks/useMyData";
import { formatCurrency, getMonthName } from "@/utils/format";
import { LoanStatus, BonusStatus, PayrollStatus } from "@/types/enums";
import {
  Wallet,
  HandCoins,
  BadgeDollarSign,
  Receipt,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Mail,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Bell,
  Download,
  BarChart3,
  Clock,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  PiggyBank,
  Activity,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const map: Record<PayrollStatus, { cls: string; label: string }> = {
    [PayrollStatus.DRAFT]: {
      cls: "inline-flex items-center gap-1 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
      label: "Draft",
    },
    [PayrollStatus.APPROVED]: {
      cls: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
      label: "Approved",
    },
    [PayrollStatus.PAID]: {
      cls: "inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
      label: "Paid",
    },
  };
  const { cls, label } = map[status] ?? {
    cls: "inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600",
    label: status,
  };
  return (
    <span className={cls}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const map: Record<LoanStatus, string> = {
    [LoanStatus.PENDING]:
      "inline-flex items-center gap-1 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
    [LoanStatus.APPROVED]:
      "inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
    [LoanStatus.ACTIVE]:
      "inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
    [LoanStatus.COMPLETED]:
      "inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-dark-3 dark:text-gray-400",
    [LoanStatus.REJECTED]:
      "inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };
  return (
    <span className={map[status] ?? ""}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function BonusStatusBadge({ status }: { status: BonusStatus }) {
  const map: Record<BonusStatus, string> = {
    [BonusStatus.PENDING]:
      "inline-flex items-center gap-1 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
    [BonusStatus.APPROVED]:
      "inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
    [BonusStatus.PAID]:
      "inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
  };
  return (
    <span className={map[status] ?? ""}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function TableSkeleton({ cols, rows = 3 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-4 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Stat Card (TailGrids style) ─────────────────────────────────────────────
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  isLoading,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: "blue" | "orange" | "purple" | "green";
  isLoading?: boolean;
  trend?: string;
}) {
  const accentMap = {
    blue: {
      bg: "bg-blue-500/10 dark:bg-blue-500/10",
      icon: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-500/20",
      badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
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
    green: {
      bg: "bg-green-500/10",
      icon: "text-green-600 dark:text-green-400",
      ring: "ring-green-500/20",
      badge:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
  };
  const a = accentMap[accent];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.bg} ring-1 ${a.ring}`}
        >
          <Icon className={`h-6 w-6 ${a.icon}`} />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${a.badge}`}
          >
            <ArrowUpRight className="h-3 w-3" />
            {trend}
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

// ─── Section Header (TailGrids card header style) ────────────────────────────
function CardHeader({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />}
        <h3 className="text-base font-semibold text-dark dark:text-white">
          {title}
        </h3>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary/80"
      >
        View all
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data: salary, isLoading: salaryLoading } = useMyActiveSalary();
  const { data: loans = [], isLoading: loansLoading } = useMyLoans();
  const { data: bonuses = [], isLoading: bonusesLoading } = useMyBonuses();
  const { data: payslips = [], isLoading: payslipsLoading } = useMyPayslips();

  const activeLoans = loans.filter(
    (l) => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.PENDING,
  );
  const pendingBonuses = bonuses.filter(
    (b) =>
      b.status === BonusStatus.PENDING || b.status === BonusStatus.APPROVED,
  );
  const pendingBonusTotal = pendingBonuses.reduce(
    (s, b) => s + parseFloat(b.amount),
    0,
  );
  const latestPayslip = payslips[0];
  const recentPayslips = payslips.slice(0, 5);
  const recentBonuses = bonuses.slice(0, 4);
  const recentLoans = loans.slice(0, 3);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* ── Top Welcome Banner (TailGrids hero-style) ────────────────── */}
      <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-primary to-primary/80 px-6 py-7 shadow-md md:px-8">
        {/* decorative circles */}
        <span className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <span className="absolute -bottom-12 right-24 h-56 w-56 rounded-full bg-white/5" />
        <span className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white shadow-inner ring-2 ring-white/30">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Good day 👋</p>
              <h1 className="text-xl font-bold text-white">
                Welcome back, {firstName}!
              </h1>
              <p className="mt-0.5 text-xs text-white/60">
                Here's your financial overview
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {latestPayslip && (
              <Link
                href="/my-payslips"
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
              >
                <Download className="h-4 w-4" />
                Latest Payslip
              </Link>
            )}
            <Link
              href="/my-salary"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              <BarChart3 className="h-4 w-4" />
              View Salary
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current Gross Salary"
          value={salary ? formatCurrency(salary.grossSalary) : "—"}
          subtitle="Active salary structure"
          icon={Wallet}
          accent="blue"
          isLoading={salaryLoading}
          trend="Active"
        />
        <MetricCard
          title="Active / Pending Loans"
          value={
            activeLoans.length > 0
              ? formatCurrency(
                  activeLoans.reduce((s, l) => s + l.remainingBalance, 0),
                )
              : "None"
          }
          subtitle={`${activeLoans.length} loan(s) outstanding`}
          icon={CreditCard}
          accent="orange"
          isLoading={loansLoading}
        />
        <MetricCard
          title="Pending Bonuses"
          value={
            pendingBonuses.length > 0
              ? formatCurrency(pendingBonusTotal)
              : "None"
          }
          subtitle={`${pendingBonuses.length} bonus(es) awaiting payment`}
          icon={PiggyBank}
          accent="purple"
          isLoading={bonusesLoading}
        />
        <MetricCard
          title="Latest Net Pay"
          value={latestPayslip ? formatCurrency(latestPayslip.netSalary) : "—"}
          subtitle={
            latestPayslip
              ? `${getMonthName(latestPayslip.payroll.month)} ${latestPayslip.payroll.year}`
              : "No payslips yet"
          }
          icon={Receipt}
          accent="green"
          isLoading={payslipsLoading}
          trend={
            latestPayslip
              ? latestPayslip.status.charAt(0) +
                latestPayslip.status.slice(1).toLowerCase()
              : undefined
          }
        />
      </div>

      {/* ── Salary Breakdown + Recent Payslips ───────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Salary Breakdown Panel */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Salary Breakdown
              </h3>
            </div>
            <Link
              href="/my-salary"
              className="text-xs font-medium text-primary transition hover:text-primary/80"
            >
              Details →
            </Link>
          </div>

          {salaryLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
                />
              ))}
            </div>
          ) : salary ? (
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    label: "Gross Salary",
                    value: formatCurrency(salary.grossSalary),
                    color: "bg-blue-500",
                    pct: 100,
                  },
                  {
                    label: "Net Salary",
                    value: formatCurrency(salary.effectiveNetSalary),
                    color: "bg-green-500",
                    pct: Math.round(
                      (salary.effectiveNetSalary / salary.grossSalary) * 100,
                    ),
                  },
                  {
                    label: "Loan Deduction",
                    value: salary.loanDeduction
                      ? formatCurrency(salary.loanDeduction)
                      : "None",
                    color: "bg-orange-400",
                    pct: salary.loanDeduction
                      ? Math.round(
                          (salary.loanDeduction / salary.grossSalary) * 100,
                        )
                      : 0,
                  },
                ].map(({ label, value, color, pct }) => (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-dark-4 dark:text-dark-6">
                        {label}
                      </span>
                      <span className="text-sm font-semibold text-dark dark:text-white">
                        {value}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  Components
                </p>
                <p className="mt-0.5 text-lg font-bold text-dark dark:text-white">
                  {salary.components?.length ?? 0}{" "}
                  <span className="text-sm font-medium text-dark-4">items</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                No salary structure assigned yet
              </p>
            </div>
          )}
        </div>

        {/* Recent Payslips */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card lg:col-span-2">
          <CardHeader
            title="Recent Payslips"
            href="/my-payslips"
            icon={Receipt}
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Period
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Gross
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Net Pay
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Status
                  </th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-dark-3">
                {payslipsLoading ? (
                  <TableSkeleton cols={5} />
                ) : recentPayslips.length > 0 ? (
                  recentPayslips.map((p) => (
                    <tr
                      key={p.id}
                      className="group transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-dark dark:text-white">
                          {getMonthName(p.payroll.month)} {p.payroll.year}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                        {p.grossSalary ? formatCurrency(p.grossSalary) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(p.netSalary)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PayrollStatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="invisible rounded-lg border border-stroke p-1.5 text-dark-4 transition hover:border-primary hover:text-primary group-hover:visible dark:border-dark-3 dark:text-dark-6">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-dark-4 dark:text-dark-6"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        No payslips found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Loans + Bonuses ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Loans Table */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <CardHeader title="My Loans" href="/my-loans" icon={CreditCard} />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Remaining
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-dark-3">
                {loansLoading ? (
                  <TableSkeleton cols={3} />
                ) : recentLoans.length > 0 ? (
                  recentLoans.map((l) => {
                    const pct =
                      l.totalInstallments > 0
                        ? Math.round(
                            (l.paidInstallments / l.totalInstallments) * 100,
                          )
                        : 0;
                    return (
                      <tr
                        key={l.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-dark dark:text-white">
                            {formatCurrency(l.loanAmount)}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-dark-4 dark:text-dark-6">
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-orange-600 dark:text-orange-400">
                          {formatCurrency(l.remainingBalance)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <LoanStatusBadge status={l.status} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-dark-4 dark:text-dark-6"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        No loans found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bonuses Table */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <CardHeader
            title="Recent Bonuses"
            href="/my-bonuses"
            icon={BadgeDollarSign}
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Type / Period
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-dark-3">
                {bonusesLoading ? (
                  <TableSkeleton cols={3} />
                ) : recentBonuses.length > 0 ? (
                  recentBonuses.map((b) => (
                    <tr
                      key={b.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-dark dark:text-white">
                          {b.bonusType}
                        </p>
                        <p className="text-xs text-dark-4 dark:text-dark-6">
                          {getMonthName(b.month)} {b.year}
                          {b.reason && (
                            <span className="ml-1.5 text-gray-400">
                              · {b.reason}
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-purple-600 dark:text-purple-400">
                        {formatCurrency(b.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <BonusStatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-dark-4 dark:text-dark-6"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <BadgeDollarSign className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        No bonuses found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Quick Access + Banner ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Quick Access Links */}
        <div className="xl:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark-4 dark:text-dark-6">
            Quick Access
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-2 xl:gap-4 2xl:grid-cols-4">
            {[
              {
                label: "My Salary",
                desc: "Salary structure & history",
                href: "/my-salary",
                icon: Wallet,
                accent: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-500/10",
                ring: "hover:ring-blue-200 dark:hover:ring-blue-500/30",
              },
              {
                label: "My Loans",
                desc: "Track loan repayments",
                href: "/my-loans",
                icon: CreditCard,
                accent: "text-orange-600 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-500/10",
                ring: "hover:ring-orange-200 dark:hover:ring-orange-500/30",
              },
              {
                label: "My Bonuses",
                desc: "Earned bonuses & status",
                href: "/my-bonuses",
                icon: BadgeDollarSign,
                accent: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-500/10",
                ring: "hover:ring-purple-200 dark:hover:ring-purple-500/30",
              },
              {
                label: "My Payslips",
                desc: "Monthly payslip records",
                href: "/my-payslips",
                icon: Receipt,
                accent: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-500/10",
                ring: "hover:ring-green-200 dark:hover:ring-green-500/30",
              },
            ].map(({ label, desc, href, icon: Icon, accent, bg, ring }) => (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3.5 rounded-[10px] border border-stroke bg-white p-4 shadow-sm transition hover:shadow-md hover:ring-2 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card ${ring}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${accent}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-dark dark:text-white">
                    {label}
                  </p>
                  <p className="text-xs text-dark-4 dark:text-dark-6">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-dark-4 dark:text-dark-6 dark:group-hover:text-dark-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Tip / Info Panel */}
        <div className="flex flex-col gap-4">
          {/* Account Status Card */}
          <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-sm font-semibold text-dark dark:text-white">
              Account Status
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Email Verified",
                  ok: user?.isVerified ?? false,
                  icon: Mail,
                },
                {
                  label: "Account Active",
                  ok: user?.isActive ?? false,
                  icon: ShieldCheck,
                },
              ].map(({ label, ok, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 dark:bg-dark-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-dark-4 dark:text-dark-6" />
                    <span className="text-sm text-dark-4 dark:text-dark-6">
                      {label}
                    </span>
                  </div>
                  {ok ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                  ) : (
                    <XCircle className="h-4.5 w-4.5 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Growth Banner */}
          <div className="flex flex-1 flex-col justify-center rounded-[10px] bg-gradient-to-br from-primary/90 to-primary p-5 shadow-sm">
            <Sparkles className="mb-3 h-6 w-6 text-white/70" />
            <p className="text-sm font-bold text-white">
              Stay on top of your financials
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70">
              View salary breakdowns, track loan instalments, and download
              payslips any time from your dashboard.
            </p>
            <Link
              href="/my-salary"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 transition hover:text-white"
            >
              Explore details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
