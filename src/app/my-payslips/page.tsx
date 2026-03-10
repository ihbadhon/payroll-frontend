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
// import { useDownloadMyPayslip, useMyPayslips } from "@/hooks/useMyData";
// import { formatCurrency, getMonthName } from "@/utils/format";
// import { PayrollStatus } from "@/types/enums";
// import { MyPayslipItem } from "@/types/salary-structure";
// import {
//   Receipt,
//   Wallet,
//   BadgeCheck,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   TrendingUp,
//   ChevronDown,
//   ChevronUp,
//   Download,
//   Loader2,
// } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";

// function PayslipStatusBadge({ status }: { status: PayrollStatus }) {
//   const map: Record<
//     PayrollStatus,
//     { cls: string; label: string; icon: React.ReactNode }
//   > = {
//     [PayrollStatus.PAID]: {
//       cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//       label: "Paid",
//       icon: <CheckCircle2 className="h-3 w-3" />,
//     },
//     [PayrollStatus.APPROVED]: {
//       cls: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//       label: "Approved",
//       icon: <CheckCircle2 className="h-3 w-3" />,
//     },
//     [PayrollStatus.DRAFT]: {
//       cls: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//       label: "Draft",
//       icon: <Clock className="h-3 w-3" />,
//     },
//   };
//   const { cls, label, icon } = map[status] ?? {
//     cls: "bg-gray-100 text-gray-600",
//     label: status,
//     icon: null,
//   };
//   return (
//     <span
//       className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
//     >
//       {icon}
//       {label}
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

// function BreakdownRow({
//   payslip,
//   colSpan,
// }: {
//   payslip: MyPayslipItem;
//   colSpan: number;
// }) {
//   const earnings = Object.entries(payslip.earningsBreakdown ?? {});
//   const deductions = Object.entries(payslip.deductionsBreakdown ?? {});
//   return (
//     <TableRow className="bg-gray-50 dark:bg-dark-3/40">
//       <TableCell colSpan={colSpan} className="pb-4 pt-0">
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           {/* Earnings */}
//           {earnings.length > 0 && (
//             <div>
//               <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
//                 Earnings
//               </p>
//               <div className="space-y-1">
//                 {earnings.map(([key, val]) => (
//                   <div key={key} className="flex justify-between text-xs">
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {key}
//                     </span>
//                     <span className="font-medium text-gray-900 dark:text-white">
//                       {formatCurrency(val as number)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {/* Deductions */}
//           {deductions.length > 0 && (
//             <div>
//               <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
//                 Deductions
//               </p>
//               <div className="space-y-1">
//                 {deductions.map(([key, val]) => (
//                   <div key={key} className="flex justify-between text-xs">
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {key}
//                     </span>
//                     <span className="font-medium text-red-600 dark:text-red-400">
//                       -{formatCurrency(val as number)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// }

// export default function MyPayslipsPage() {
//   const { data: payslips = [], isLoading, isError, error } = useMyPayslips();
//   const { mutate: downloadPayslip, isPending: isDownloading } =
//     useDownloadMyPayslip();
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [downloadingId, setDownloadingId] = useState<string | null>(null);

//   const latest = payslips[0] ?? null;
//   const paidCount = payslips.filter(
//     (p) => p.status === PayrollStatus.PAID,
//   ).length;
//   const totalNetEarned = payslips
//     .filter((p) => p.status === PayrollStatus.PAID)
//     .reduce((s, p) => s + p.netSalary, 0);

//   const toggleExpand = (id: string) =>
//     setExpandedId((prev) => (prev === id ? null : id));

//   const handleDownload = (payslip: MyPayslipItem) => {
//     setDownloadingId(payslip.id);
//     downloadPayslip(payslip.id, {
//       onSuccess: (blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         const month = getMonthName(payslip.payroll.month).toLowerCase();
//         link.href = url;
//         link.download = `payslip-${month}-${payslip.payroll.year}.pdf`;
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//         toast.success("Payslip downloaded");
//       },
//       onError: () => {
//         toast.error("Failed to download payslip");
//       },
//       onSettled: () => setDownloadingId(null),
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="My Payslips"
//         description="View your monthly payroll breakdown and payment history"
//       />

//       {isError && (
//         <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
//           <strong>Failed to load payslips:</strong>{" "}
//           {(error as Error)?.message ??
//             "Unknown error. Check browser console for details."}
//         </div>
//       )}

//       {/*  Stat Cards  */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Latest Net Salary"
//           value={latest ? formatCurrency(latest.netSalary) : ""}
//           subtitle={
//             latest
//               ? `${getMonthName(latest.payroll.month)} ${latest.payroll.year}`
//               : "No payslips yet"
//           }
//           icon={Wallet}
//           iconBg="bg-blue-50 dark:bg-blue-500/10"
//           iconColor="text-blue-600 dark:text-blue-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Total Paid Months"
//           value={paidCount}
//           subtitle={`of ${payslips.length} total payslip${payslips.length !== 1 ? "s" : ""}`}
//           icon={Receipt}
//           iconBg="bg-green-50 dark:bg-green-500/10"
//           iconColor="text-green-600 dark:text-green-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Total Earned"
//           value={totalNetEarned > 0 ? formatCurrency(totalNetEarned) : ""}
//           subtitle="Cumulative net (paid only)"
//           icon={TrendingUp}
//           iconBg="bg-purple-50 dark:bg-purple-500/10"
//           iconColor="text-purple-600 dark:text-purple-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Latest Bonus"
//           value={
//             latest?.bonusAmount ? formatCurrency(latest.bonusAmount) : "None"
//           }
//           subtitle={
//             latest
//               ? `${getMonthName(latest.payroll.month)} ${latest.payroll.year}`
//               : ""
//           }
//           icon={BadgeCheck}
//           iconBg="bg-orange-50 dark:bg-orange-500/10"
//           iconColor="text-orange-600 dark:text-orange-400"
//           isLoading={isLoading}
//         />
//       </div>

//       {/*  Latest Payslip Detail  */}
//       {latest && !isLoading && (
//         <div className="card p-6">
//           {/* Company header */}
//           <div className="mb-5 flex flex-col items-start gap-1 border-b border-gray-100 pb-5 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//                 Pimjo
//               </h2>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Level 2, House 03, Road 05, Baridhara J Block, Dhaka 1212
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 +8801764801826
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
//                 {getMonthName(latest.payroll.month)} {latest.payroll.year}
//               </p>
//               <PayslipStatusBadge status={latest.status} />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
//             {[
//               {
//                 label: "Basic Salary",
//                 value: formatCurrency(latest.basicSalary),
//                 color: "text-gray-900 dark:text-white",
//               },
//               {
//                 label: "Gross Salary",
//                 value: formatCurrency(latest.grossSalary),
//                 color: "text-blue-600 dark:text-blue-400",
//               },
//               {
//                 label: "Bonus",
//                 value: latest.bonusAmount
//                   ? `+${formatCurrency(latest.bonusAmount)}`
//                   : "",
//                 color: "text-purple-600 dark:text-purple-400",
//               },
//               {
//                 label: "Total Earnings",
//                 value: `+${formatCurrency((latest.totalEarnings ?? 0) + (latest.bonusAmount ?? 0))}`,
//                 color: "text-green-600 dark:text-green-400",
//               },
//               {
//                 label: "Total Deductions",
//                 value: `-${formatCurrency(latest.totalDeductions)}`,
//                 color: "text-red-600 dark:text-red-400",
//               },
//               {
//                 label: "Loan Deduction",
//                 value: latest.loanDeduction
//                   ? `-${formatCurrency(latest.loanDeduction)}`
//                   : "None",
//                 color: "text-orange-600 dark:text-orange-400",
//               },
//               {
//                 label: "Net Salary",
//                 value: formatCurrency(latest.netSalary),
//                 color: "text-primary font-bold text-base",
//               },
//             ].map(({ label, value, color }) => (
//               <div
//                 key={label}
//                 className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3"
//               >
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   {label}
//                 </p>
//                 <p className={`mt-1 text-sm font-semibold ${color}`}>{value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Breakdown grids */}
//           {(Object.keys(latest.earningsBreakdown ?? {}).length > 0 ||
//             Object.keys(latest.deductionsBreakdown ?? {}).length > 0) && (
//             <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {Object.keys(latest.earningsBreakdown ?? {}).length > 0 && (
//                 <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/5">
//                   <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
//                     Earnings Breakdown
//                   </p>
//                   <div className="space-y-2">
//                     {Object.entries(latest.earningsBreakdown).map(
//                       ([key, val]) => (
//                         <div
//                           key={key}
//                           className="flex items-center justify-between"
//                         >
//                           <span className="text-sm text-gray-700 dark:text-gray-300">
//                             {key}
//                           </span>
//                           <span className="text-sm font-semibold text-green-700 dark:text-green-400">
//                             {formatCurrency(val as number)}
//                           </span>
//                         </div>
//                       ),
//                     )}
//                     {/* Bonus line */}
//                     {!!latest.bonusAmount && (
//                       <div className="flex items-center justify-between border-t border-green-100 pt-2 dark:border-green-500/20">
//                         <span className="text-sm text-gray-700 dark:text-gray-300">
//                           Bonus
//                         </span>
//                         <span className="text-sm font-semibold text-green-700 dark:text-green-400">
//                           +{formatCurrency(latest.bonusAmount)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               {Object.keys(latest.deductionsBreakdown ?? {}).length > 0 && (
//                 <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
//                   <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
//                     Deductions Breakdown
//                   </p>
//                   <div className="space-y-2">
//                     {Object.entries(latest.deductionsBreakdown).map(
//                       ([key, val]) => (
//                         <div
//                           key={key}
//                           className="flex items-center justify-between"
//                         >
//                           <span className="text-sm text-gray-700 dark:text-gray-300">
//                             {key}
//                           </span>
//                           <span className="text-sm font-semibold text-red-600 dark:text-red-400">
//                             -{formatCurrency(val as number)}
//                           </span>
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/*  Full Payslip Table  */}
//       <div className="card overflow-hidden">
//         <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//             All Payslips
//           </h2>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             Click a row to see breakdown details
//           </p>
//         </div>
//         <TableRoot>
//           <TableHeader>
//             <TableRow>
//               {[
//                 "#",
//                 "Period",
//                 "Basic",
//                 "Gross",
//                 "Bonus",
//                 "Loan Ded.",
//                 "Net Salary",
//                 "Status",
//                 "Actions",
//               ].map((h, i) => (
//                 <TableHead
//                   key={i}
//                   className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${
//                     i >= 2 && i <= 6 ? "text-right" : "text-left"
//                   }`}
//                 >
//                   {h}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <SkeletonRow cols={9} />
//             ) : payslips.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={9} className="py-14 text-center">
//                   <XCircle className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     No payslips found
//                   </p>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               payslips.map((p, i) => {
//                 const isExpanded = expandedId === p.id;
//                 return (
//                   <>
//                     <TableRow
//                       key={p.id}
//                       onClick={() => toggleExpand(p.id)}
//                       className="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-3/50"
//                     >
//                       <TableCell className="text-center text-xs text-gray-400">
//                         {i + 1}
//                       </TableCell>
//                       <TableCell className="font-medium text-gray-900 dark:text-white">
//                         {getMonthName(p.payroll.month)} {p.payroll.year}
//                       </TableCell>
//                       <TableCell className="text-right text-gray-600 dark:text-gray-400">
//                         {formatCurrency(p.basicSalary)}
//                       </TableCell>
//                       <TableCell className="text-right text-gray-600 dark:text-gray-400">
//                         {formatCurrency(p.grossSalary)}
//                       </TableCell>
//                       <TableCell className="text-right text-purple-600 dark:text-purple-400">
//                         {p.bonusAmount
//                           ? `+${formatCurrency(p.bonusAmount)}`
//                           : ""}
//                       </TableCell>
//                       <TableCell className="text-right text-orange-600 dark:text-orange-400">
//                         {p.loanDeduction
//                           ? `-${formatCurrency(p.loanDeduction)}`
//                           : ""}
//                       </TableCell>
//                       <TableCell className="text-right font-bold text-gray-900 dark:text-white">
//                         {formatCurrency(p.netSalary)}
//                       </TableCell>
//                       <TableCell>
//                         <PayslipStatusBadge status={p.status} />
//                       </TableCell>
//                       <TableCell className="text-gray-400">
//                         <div className="flex items-center gap-2">
//                           {p.status === PayrollStatus.PAID ? (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDownload(p);
//                               }}
//                               disabled={isDownloading && downloadingId === p.id}
//                               className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:opacity-60"
//                             >
//                               {isDownloading && downloadingId === p.id ? (
//                                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                               ) : (
//                                 <Download className="h-3.5 w-3.5" />
//                               )}
//                               Download
//                             </button>
//                           ) : (
//                             <span className="text-xs text-gray-400">-</span>
//                           )}
//                           {isExpanded ? (
//                             <ChevronUp className="h-4 w-4" />
//                           ) : (
//                             <ChevronDown className="h-4 w-4" />
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                     {isExpanded && (
//                       <BreakdownRow
//                         key={`${p.id}-detail`}
//                         payslip={p}
//                         colSpan={9}
//                       />
//                     )}
//                   </>
//                 );
//               })
//             )}
//           </TableBody>
//         </TableRoot>
//       </div>
//     </div>
//   );
// }

"use client";

import { useDownloadMyPayslip, useMyPayslips } from "@/hooks/useMyData";
import { formatCurrency, getMonthName } from "@/utils/format";
import { PayrollStatus } from "@/types/enums";
import { MyPayslipItem } from "@/types/salary-structure";
import {
  Receipt,
  Wallet,
  BadgeCheck,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  ArrowUpRight,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function PayslipStatusBadge({ status }: { status: PayrollStatus }) {
  const map: Record<
    PayrollStatus,
    { cls: string; label: string; icon: React.ReactNode }
  > = {
    [PayrollStatus.PAID]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
      label: "Paid",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    [PayrollStatus.APPROVED]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
      label: "Approved",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    [PayrollStatus.DRAFT]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
      label: "Draft",
      icon: <Clock className="h-3 w-3" />,
    },
  };
  const { cls, label, icon } = map[status] ?? {
    cls: "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600",
    label: status,
    icon: null,
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

// ─── Inline Breakdown Row ────────────────────────────────────────────────────
function BreakdownRow({
  payslip,
  colSpan,
}: {
  payslip: MyPayslipItem;
  colSpan: number;
}) {
  const earnings = Object.entries(payslip.earningsBreakdown ?? {});
  const deductions = Object.entries(payslip.deductionsBreakdown ?? {});

  return (
    <tr className="bg-gray-50 dark:bg-dark-3/40">
      <td colSpan={colSpan} className="px-6 pb-5 pt-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {earnings.length > 0 && (
            <div className="rounded-xl border border-green-100 bg-white p-4 dark:border-green-500/20 dark:bg-gray-dark">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
                Earnings Breakdown
              </p>
              <div className="space-y-2">
                {earnings.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-dark-4 dark:text-dark-6">
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(val as number)}
                    </span>
                  </div>
                ))}
                {!!payslip.bonusAmount && (
                  <div className="flex items-center justify-between border-t border-green-100 pt-2 dark:border-green-500/20">
                    <span className="text-sm text-dark-4 dark:text-dark-6">
                      Bonus
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +{formatCurrency(payslip.bonusAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {deductions.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-white p-4 dark:border-red-500/20 dark:bg-gray-dark">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                Deductions Breakdown
              </p>
              <div className="space-y-2">
                {deductions.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-dark-4 dark:text-dark-6">
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{formatCurrency(val as number)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
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
  accent: "blue" | "green" | "purple" | "orange";
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
    purple: {
      bg: "bg-purple-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      ring: "ring-purple-500/20",
      badge:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
    orange: {
      bg: "bg-orange-500/10",
      icon: "text-orange-600 dark:text-orange-400",
      ring: "ring-orange-500/20",
      badge:
        "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
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
export default function MyPayslipsPage() {
  const { data: payslips = [], isLoading, isError, error } = useMyPayslips();
  const { mutate: downloadPayslip, isPending: isDownloading } =
    useDownloadMyPayslip();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const latest = payslips[0] ?? null;
  const paidCount = payslips.filter(
    (p) => p.status === PayrollStatus.PAID,
  ).length;
  const totalNetEarned = payslips
    .filter((p) => p.status === PayrollStatus.PAID)
    .reduce((s, p) => s + p.netSalary, 0);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleDownload = (payslip: MyPayslipItem) => {
    setDownloadingId(payslip.id);
    downloadPayslip(payslip.id, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const month = getMonthName(payslip.payroll.month).toLowerCase();
        link.href = url;
        link.download = `payslip-${month}-${payslip.payroll.year}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Payslip downloaded");
      },
      onError: () => toast.error("Failed to download payslip"),
      onSettled: () => setDownloadingId(null),
    });
  };

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            My Payslips
          </h2>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            View your monthly payroll breakdown and payment history
          </p>
        </div>
        {!isLoading && payslips.length > 0 && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <Receipt className="h-3.5 w-3.5" />
            {payslips.length} payslip{payslips.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────── */}
      {isError && (
        <div className="flex items-center gap-3 rounded-[10px] border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/30 dark:bg-red-500/10">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <strong>Failed to load payslips:</strong>{" "}
            {(error as Error)?.message ??
              "Unknown error. Check browser console for details."}
          </p>
        </div>
      )}

      {/* ── Metric Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Latest Net Salary"
          value={latest ? formatCurrency(latest.netSalary) : ""}
          subtitle={
            latest
              ? `${getMonthName(latest.payroll.month)} ${latest.payroll.year}`
              : "No payslips yet"
          }
          icon={Wallet}
          accent="blue"
          badge="Latest"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Paid Months"
          value={paidCount}
          subtitle={`of ${payslips.length} total payslip${payslips.length !== 1 ? "s" : ""}`}
          icon={Receipt}
          accent="green"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Earned"
          value={totalNetEarned > 0 ? formatCurrency(totalNetEarned) : ""}
          subtitle="Cumulative net (paid only)"
          icon={TrendingUp}
          accent="purple"
          badge="Net"
          isLoading={isLoading}
        />
        <MetricCard
          title="Latest Bonus"
          value={
            latest?.bonusAmount ? formatCurrency(latest.bonusAmount) : "None"
          }
          subtitle={
            latest
              ? `${getMonthName(latest.payroll.month)} ${latest.payroll.year}`
              : ""
          }
          icon={BadgeCheck}
          accent="orange"
          isLoading={isLoading}
        />
      </div>

      {/* ── Latest Payslip Detail Card ────────────────────────────────── */}
      {latest && !isLoading && (
        <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          {/* Card Header */}
          <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
            <Receipt className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <h3 className="text-base font-semibold text-dark dark:text-white">
              Latest Payslip
            </h3>
          </div>

          <div className="p-6">
            {/* Company + Period header */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-stroke bg-gray-50 p-5 dark:border-dark-3 dark:bg-dark-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-dark-4 dark:text-dark-6" />
                  <p className="text-base font-bold text-dark dark:text-white">
                    Pimjo
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                  <MapPin className="h-3 w-3 shrink-0" />
                  Level 2, House 03, Road 05, Baridhara J Block, Dhaka 1212
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                  <Phone className="h-3 w-3 shrink-0" />
                  +8801764801826
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="text-sm font-bold text-dark dark:text-white">
                  {getMonthName(latest.payroll.month)} {latest.payroll.year}
                </p>
                <PayslipStatusBadge status={latest.status} />
                {latest.status === PayrollStatus.PAID && (
                  <button
                    onClick={() => handleDownload(latest)}
                    disabled={isDownloading && downloadingId === latest.id}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {isDownloading && downloadingId === latest.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Download PDF
                  </button>
                )}
              </div>
            </div>

            {/* Salary metric tiles */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {[
                {
                  label: "Basic Salary",
                  value: formatCurrency(latest.basicSalary),
                  color: "text-dark dark:text-white",
                },
                {
                  label: "Gross Salary",
                  value: formatCurrency(latest.grossSalary),
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  label: "Bonus",
                  value: latest.bonusAmount
                    ? `+${formatCurrency(latest.bonusAmount)}`
                    : "—",
                  color: "text-purple-600 dark:text-purple-400",
                },
                {
                  label: "Total Earnings",
                  value: `+${formatCurrency((latest.totalEarnings ?? 0) + (latest.bonusAmount ?? 0))}`,
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  label: "Total Deductions",
                  value: `-${formatCurrency(latest.totalDeductions)}`,
                  color: "text-red-500 dark:text-red-400",
                },
                {
                  label: "Loan Deduction",
                  value: latest.loanDeduction
                    ? `-${formatCurrency(latest.loanDeduction)}`
                    : "None",
                  color: "text-orange-600 dark:text-orange-400",
                },
                {
                  label: "Net Salary",
                  value: formatCurrency(latest.netSalary),
                  color: "text-primary",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-xl border border-stroke bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3"
                >
                  <p className="text-xs text-dark-4 dark:text-dark-6">
                    {label}
                  </p>
                  <p className={`mt-1 text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Breakdown grids */}
            {(Object.keys(latest.earningsBreakdown ?? {}).length > 0 ||
              Object.keys(latest.deductionsBreakdown ?? {}).length > 0) && (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.keys(latest.earningsBreakdown ?? {}).length > 0 && (
                  <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
                      Earnings Breakdown
                    </p>
                    <div className="space-y-2">
                      {Object.entries(latest.earningsBreakdown).map(
                        ([key, val]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-dark-4 dark:text-dark-6">
                              {key}
                            </span>
                            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                              {formatCurrency(val as number)}
                            </span>
                          </div>
                        ),
                      )}
                      {!!latest.bonusAmount && (
                        <div className="flex items-center justify-between border-t border-green-100 pt-2 dark:border-green-500/20">
                          <span className="text-sm text-dark-4 dark:text-dark-6">
                            Bonus
                          </span>
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            +{formatCurrency(latest.bonusAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {Object.keys(latest.deductionsBreakdown ?? {}).length > 0 && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                      Deductions Breakdown
                    </p>
                    <div className="space-y-2">
                      {Object.entries(latest.deductionsBreakdown).map(
                        ([key, val]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-dark-4 dark:text-dark-6">
                              {key}
                            </span>
                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                              -{formatCurrency(val as number)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── All Payslips Table ────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <Receipt className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                All Payslips
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                Click a row to see breakdown details
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                {[
                  "#",
                  "Period",
                  "Basic",
                  "Gross",
                  "Bonus",
                  "Loan Ded.",
                  "Net Salary",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${
                      i >= 2 && i <= 6 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {isLoading ? (
                <SkeletonRow cols={9} />
              ) : payslips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                        <Receipt className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                        No payslips found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payslips.map((p, i) => {
                  const isExpanded = expandedId === p.id;
                  return (
                    <>
                      <tr
                        key={p.id}
                        onClick={() => toggleExpand(p.id)}
                        className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <td className="px-6 py-4 text-xs text-dark-4 dark:text-dark-6">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-dark dark:text-white">
                            {getMonthName(p.payroll.month)} {p.payroll.year}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-dark-4 dark:text-dark-6">
                          {formatCurrency(p.basicSalary)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-dark-4 dark:text-dark-6">
                          {formatCurrency(p.grossSalary)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-purple-600 dark:text-purple-400">
                          {p.bonusAmount
                            ? `+${formatCurrency(p.bonusAmount)}`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-orange-600 dark:text-orange-400">
                          {p.loanDeduction
                            ? `-${formatCurrency(p.loanDeduction)}`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-dark dark:text-white">
                          {formatCurrency(p.netSalary)}
                        </td>
                        <td className="px-6 py-4">
                          <PayslipStatusBadge status={p.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {p.status === PayrollStatus.PAID ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(p);
                                }}
                                disabled={
                                  isDownloading && downloadingId === p.id
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:opacity-60"
                              >
                                {isDownloading && downloadingId === p.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}
                                Download
                              </button>
                            ) : (
                              <span className="text-xs text-dark-4 dark:text-dark-6">
                                —
                              </span>
                            )}
                            <span className="text-dark-4 dark:text-dark-6">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <BreakdownRow
                          key={`${p.id}-detail`}
                          payslip={p}
                          colSpan={9}
                        />
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
