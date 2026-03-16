// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import Button from "@/components/ui/Button";
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
//   usePayrollPreview,
//   useGeneratePayroll,
//   usePayrolls,
//   useApprovePayroll,
//   useMarkPayrollPaid,
//   useRevokePayrollApproval,
//   useGeneratePayslips,
// } from "@/hooks/usePayroll";
// import { PayrollPreviewItem, TotalMonthlySalary } from "@/types/payroll";
// import { PayrollStatus } from "@/types/enums";
// import { formatCurrency, getMonthName } from "@/utils/format";
// import { useAuth } from "@/store/auth.context";
// import { ROLES } from "@/config/permissions";
// import {
//   Users,
//   Banknote,
//   TrendingDown,
//   RefreshCcw,
//   Calculator,
//   CheckCircle,
//   FileText,
//   ChevronDown,
//   Loader2,
//   ShieldCheck,
//   CreditCard,
//   ClipboardList,
//   RotateCcw,
//   FileOutput,
//   X,
// } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const now = new Date();
// const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//   value: i + 1,
//   label: getMonthName(i + 1),
// }));
// const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

// // ─── Preview Table Row ────────────────────────────────────────────────────────
// function PreviewRow({
//   item,
//   index,
// }: {
//   item: PayrollPreviewItem;
//   index: number;
// }) {
//   return (
//     <TableRow className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50">
//       <TableCell className="text-center text-xs text-gray-400">
//         {index + 1}
//       </TableCell>
//       <TableCell>
//         <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
//           {item.employeeId}
//         </span>
//       </TableCell>
//       <TableCell>
//         <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
//       </TableCell>
//       <TableCell className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
//         {formatCurrency(item.grossSalary)}
//       </TableCell>
//       <TableCell className="text-right text-sm text-purple-600 dark:text-purple-400">
//         {formatCurrency(item.bonuses)}
//       </TableCell>
//       <TableCell className="text-right text-sm text-red-500 dark:text-red-400">
//         {formatCurrency(item.deductions)}
//       </TableCell>
//       <TableCell className="text-right text-sm text-orange-500 dark:text-orange-400">
//         {formatCurrency(item.loansEmi)}
//       </TableCell>
//       <TableCell className="text-right text-sm font-semibold text-gray-900 dark:text-white">
//         {formatCurrency(item.netSalary)}
//       </TableCell>
//     </TableRow>
//   );
// }

// // ─── Skeleton rows ─────────────────────────────────────────────────────────────
// function SkeletonRows() {
//   return (
//     <>
//       {[1, 2, 3, 4, 5].map((i) => (
//         <TableRow key={i}>
//           {Array.from({ length: 8 }).map((_, j) => (
//             <TableCell key={j}>
//               <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-dark-3" />
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </>
//   );
// }

// const selectCls =
//   "appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none " +
//   "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
//   "dark:border-dark-3 dark:bg-dark-2 dark:text-gray-200";

// // ─── Payroll Status Badge ─────────────────────────────────────────────────────
// const STATUS_STYLE: Record<PayrollStatus, string> = {
//   [PayrollStatus.DRAFT]:
//     "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//   [PayrollStatus.APPROVED]:
//     "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//   [PayrollStatus.PAID]:
//     "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
// };

// function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600"}`}
//     >
//       {status.toLowerCase()}
//     </span>
//   );
// }

// // ─── Record Skeleton rows ─────────────────────────────────────────────────────
// function RecordSkeletonRows() {
//   return (
//     <>
//       {[1, 2, 3].map((i) => (
//         <TableRow key={i}>
//           {Array.from({ length: 8 }).map((_, j) => (
//             <TableCell key={j}>
//               <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-dark-3" />
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </>
//   );
// }

// // ─── Payslip Confirm Modal ────────────────────────────────────────────────────
// function PayslipConfirmModal({
//   record,
//   onClose,
//   onConfirm,
//   isPending,
// }: {
//   record: TotalMonthlySalary;
//   onClose: () => void;
//   onConfirm: () => void;
//   isPending: boolean;
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/10">
//               <FileOutput className="h-5 w-5 text-purple-600" />
//             </div>
//             <div>
//               <h3 className="text-base font-semibold text-gray-900 dark:text-white">
//                 Generate Payslips
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {getMonthName(record.month)} {record.year}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-dark-3 dark:bg-dark-3">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-gray-500 dark:text-gray-400">Employees</span>
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {record.totalEmployees}
//             </span>
//           </div>
//           <div className="mt-1.5 flex items-center justify-between text-sm">
//             <span className="text-gray-500 dark:text-gray-400">
//               Total Payroll
//             </span>
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {formatCurrency(record.totalAmount)}
//             </span>
//           </div>
//           <div className="mt-1.5 flex items-center justify-between text-sm">
//             <span className="text-gray-500 dark:text-gray-400">Status</span>
//             <PayrollStatusBadge status={record.status} />
//           </div>
//         </div>

//         <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
//           This will generate individual payslips for all{" "}
//           <strong>{record.totalEmployees} employees</strong> in this payroll
//           period.
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
//             className="gap-1.5 bg-purple-600 text-white hover:bg-purple-700"
//             disabled={isPending}
//             onClick={onConfirm}
//           >
//             {isPending ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <FileOutput className="h-4 w-4" />
//             )}
//             {isPending ? "Generating…" : "Generate Payslips"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function PayrollPage() {
//   const { user } = useAuth();
//   const isAdmin =
//     user?.role?.name === ROLES.SUPER_ADMIN || user?.role?.name === ROLES.HR;
//   const isFinance = user?.role?.name === ROLES.FINANCE;

//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [year, setYear] = useState(now.getFullYear());
//   const [previewEnabled, setPreviewEnabled] = useState(false);
//   const [generated, setGenerated] = useState(false);
//   const [filterStatus, setFilterStatus] = useState<PayrollStatus | "">("");

//   const {
//     data: preview,
//     isLoading: previewLoading,
//     isFetching,
//     error: previewError,
//   } = usePayrollPreview({ month, year }, previewEnabled);

//   const { mutate: generatePayroll, isPending: generating } =
//     useGeneratePayroll();

//   const { data: payrollList = [], isLoading: recordsLoading } = usePayrolls(
//     filterStatus ? { status: filterStatus } : {},
//   );
//   const { mutate: approvePayroll, isPending: approving } = useApprovePayroll();
//   const { mutate: markPaid, isPending: markingPaid } = useMarkPayrollPaid();
//   const { mutate: revokeApproval, isPending: revoking } =
//     useRevokePayrollApproval();
//   const { mutate: generatePayslips, isPending: generatingPayslips } =
//     useGeneratePayslips();
//   const [actionId, setActionId] = useState<string | null>(null);
//   const [payslipActionId, setPayslipActionId] = useState<string | null>(null);
//   const [payslipConfirmRecord, setPayslipConfirmRecord] =
//     useState<TotalMonthlySalary | null>(null);
//   const [payslipSuccessRecord, setPayslipSuccessRecord] =
//     useState<TotalMonthlySalary | null>(null);

//   const handleGeneratePayslips = (record: TotalMonthlySalary) => {
//     setPayslipActionId(record.id);
//     generatePayslips(record.id, {
//       onSuccess: () => {
//         setPayslipConfirmRecord(null);
//         setPayslipSuccessRecord(record);
//         toast.success(
//           `Payslips generated for ${record.totalEmployees} employees`,
//         );
//         setTimeout(() => setPayslipSuccessRecord(null), 5000);
//       },
//       onError: () => {
//         toast.error("Failed to generate payslips. Please try again.");
//       },
//       onSettled: () => setPayslipActionId(null),
//     });
//   };

//   const items = preview?.items ?? [];
//   const summary = preview?.summary;

//   const handleLoadPreview = () => {
//     setGenerated(false);
//     setPreviewEnabled(true);
//   };

//   const handleMonthYearChange = () => {
//     setPreviewEnabled(false);
//     setGenerated(false);
//   };

//   const handleGenerate = () => {
//     // Ensure month and year are integers
//     const monthInt = Math.floor(Number(month));
//     const yearInt = Math.floor(Number(year));

//     // Validate ranges
//     if (monthInt < 1 || monthInt > 12) {
//       alert("Month must be between 1 and 12");
//       return;
//     }
//     if (yearInt < 2020) {
//       alert("Year must be 2020 or later");
//       return;
//     }

//     generatePayroll(
//       { month: monthInt, year: yearInt, allowFuture: false },
//       {
//         onSuccess: () => {
//           setGenerated(true);
//         },
//       },
//     );
//   };

//   const handleApprove = (record: TotalMonthlySalary) => {
//     setActionId(record.id);
//     approvePayroll(record.id, { onSettled: () => setActionId(null) });
//   };

//   const handleMarkPaid = (record: TotalMonthlySalary) => {
//     setActionId(record.id);
//     markPaid(record.id, { onSettled: () => setActionId(null) });
//   };

//   const handleRevokeApproval = (record: TotalMonthlySalary) => {
//     setActionId(record.id);
//     revokeApproval(record.id, { onSettled: () => setActionId(null) });
//   };

//   const periodLabel = `${getMonthName(month)} ${year}`;

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Payroll Processing"
//         description="Generate monthly payroll for all active employees"
//       />

//       {/* ── Payslip Success Toast ──────────────────────────────────────── */}
//       {payslipSuccessRecord && (
//         <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-500/20 dark:bg-green-500/10">
//           <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
//           <div className="flex-1">
//             <p className="text-sm font-semibold text-green-800 dark:text-green-300">
//               Payslips Generated Successfully
//             </p>
//             <p className="text-xs text-green-700 dark:text-green-400">
//               Payslips for {getMonthName(payslipSuccessRecord.month)}{" "}
//               {payslipSuccessRecord.year} have been generated for{" "}
//               {payslipSuccessRecord.totalEmployees} employees.
//             </p>
//           </div>
//           <button
//             onClick={() => setPayslipSuccessRecord(null)}
//             className="rounded-lg p-1 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-500/20"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* ── Period Selector ─────────────────────────────────────────────── */}
//       <div className="card p-5">
//         <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
//           Select Payroll Period
//         </h2>
//         <div className="flex flex-wrap items-end gap-4">
//           {/* Month */}
//           <div className="space-y-1.5">
//             <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
//               Month
//             </label>
//             <div className="relative">
//               <select
//                 value={month}
//                 onChange={(e) => {
//                   setMonth(Math.floor(Number(e.target.value)));
//                   handleMonthYearChange();
//                 }}
//                 className={selectCls}
//               >
//                 {MONTHS.map((m) => (
//                   <option key={m.value} value={m.value}>
//                     {m.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>

//           {/* Year */}
//           <div className="space-y-1.5">
//             <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
//               Year
//             </label>
//             <div className="relative">
//               <select
//                 value={year}
//                 onChange={(e) => {
//                   setYear(Math.floor(Number(e.target.value)));
//                   handleMonthYearChange();
//                 }}
//                 className={selectCls}
//               >
//                 {YEARS.map((y) => (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>

//           {/* Load Preview button */}
//           <Button
//             size="sm"
//             className="gap-2"
//             onClick={handleLoadPreview}
//             disabled={previewLoading || isFetching}
//           >
//             {previewLoading || isFetching ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Calculator className="h-4 w-4" />
//             )}
//             {previewLoading || isFetching ? "Loading…" : "Load Preview"}
//           </Button>
//         </div>
//       </div>

//       {/* ── Preview Table ─────────────────────────────────────────────────── */}
//       {previewEnabled && (
//         <>
//           <div className="card overflow-hidden">
//             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark-3">
//               <div>
//                 <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                   Salary Preview — {periodLabel}
//                 </h2>
//                 <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                   Calculated breakdown for all active employees
//                 </p>
//               </div>
//               {!previewLoading && items.length > 0 && (
//                 <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
//                   {items.length} employees
//                 </span>
//               )}
//             </div>

//             {previewError ? (
//               <div className="p-8 text-center text-sm text-red-500">
//                 Failed to load preview. Please try again.
//               </div>
//             ) : previewLoading ? (
//               <TableRoot>
//                 <TableHeader>
//                   <TableRow>
//                     {[
//                       "#",
//                       "Employee ID",
//                       "Name",
//                       "Gross Salary",
//                       "Bonuses",
//                       "Deductions",
//                       "Loan EMI",
//                       "Net Salary",
//                     ].map((h) => (
//                       <TableHead
//                         key={h}
//                         className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 last:text-right"
//                       >
//                         {h}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <SkeletonRows />
//                 </TableBody>
//               </TableRoot>
//             ) : items.length === 0 ? (
//               <EmptyState
//                 title="No employees found"
//                 description="No active employees found for the selected period."
//                 icon={Users}
//               />
//             ) : (
//               <TableRoot>
//                 <TableHeader>
//                   <TableRow>
//                     {[
//                       "#",
//                       "Employee ID",
//                       "Name",
//                       "Gross Salary",
//                       "Bonuses",
//                       "Deductions",
//                       "Loan EMI",
//                       "Net Salary",
//                     ].map((h, i) => (
//                       <TableHead
//                         key={i}
//                         className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${i >= 3 ? "text-right" : "text-left"}`}
//                       >
//                         {h}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {items.map((item, i) => (
//                     <PreviewRow key={item.employeeId} item={item} index={i} />
//                   ))}
//                 </TableBody>
//               </TableRoot>
//             )}
//           </div>

//           {/* ── Summary Cards ──────────────────────────────────────────── */}
//           {!previewLoading && summary && (
//             <>
//               <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//                 <StatCard
//                   title="Employees"
//                   value={summary.totalEmployees}
//                   icon={Users}
//                   iconColor="text-primary"
//                   iconBg="bg-primary/10"
//                 />
//                 <StatCard
//                   title="Gross Salary"
//                   value={formatCurrency(summary.totalGrossSalary)}
//                   icon={Banknote}
//                   iconColor="text-blue-600"
//                   iconBg="bg-blue-50 dark:bg-blue-500/10"
//                 />
//                 <StatCard
//                   title="Bonuses"
//                   value={formatCurrency(summary.totalBonuses)}
//                   icon={FileText}
//                   iconColor="text-purple-600"
//                   iconBg="bg-purple-50 dark:bg-purple-500/10"
//                 />
//                 <StatCard
//                   title="Deductions"
//                   value={formatCurrency(summary.totalDeductions)}
//                   icon={TrendingDown}
//                   iconColor="text-red-600"
//                   iconBg="bg-red-50 dark:bg-red-500/10"
//                 />
//                 <StatCard
//                   title="Loan Recovery"
//                   value={formatCurrency(summary.totalLoanRecovery)}
//                   icon={RefreshCcw}
//                   iconColor="text-orange-600"
//                   iconBg="bg-orange-50 dark:bg-orange-500/10"
//                 />
//                 <StatCard
//                   title="Net Payable"
//                   value={formatCurrency(summary.totalNetPayable)}
//                   icon={CheckCircle}
//                   iconColor="text-green-600"
//                   iconBg="bg-green-50 dark:bg-green-500/10"
//                 />
//               </div>

//               {/* ── Generate Button ─────────────────────────────────── */}
//               <div className="flex items-center justify-between rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-dark-3 dark:bg-dark-2">
//                 <div>
//                   <p className="font-semibold text-gray-900 dark:text-white">
//                     {generated
//                       ? "Payroll Generated!"
//                       : `Ready to generate payroll for ${periodLabel}?`}
//                   </p>
//                   <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
//                     {generated
//                       ? "Payroll has been submitted for approval."
//                       : `This will create payroll records for ${summary.totalEmployees} employees.`}
//                   </p>
//                 </div>
//                 {generated ? (
//                   <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
//                     <CheckCircle className="h-5 w-5" />
//                     Generated
//                   </div>
//                 ) : (
//                   <Button
//                     size="md"
//                     className="gap-2 bg-green-600 text-white hover:bg-green-700"
//                     disabled={generating || items.length === 0}
//                     onClick={handleGenerate}
//                   >
//                     {generating ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Banknote className="h-4 w-4" />
//                     )}
//                     {generating ? "Generating…" : "Generate Payroll"}
//                   </Button>
//                 )}
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {!previewEnabled && (
//         <div className="card flex flex-col items-center justify-center py-20 text-center">
//           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
//             <Calculator className="h-8 w-8 text-primary" />
//           </div>
//           <p className="text-base font-semibold text-gray-900 dark:text-white">
//             Select a period to start
//           </p>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Choose a month and year above, then click{" "}
//             <strong>Load Preview</strong> to see salary calculations.
//           </p>
//         </div>
//       )}

//       {/* ── Payroll Records ─────────────────────────────────────────────── */}
//       {(isAdmin || isFinance) && (
//         <div className="card overflow-hidden">
//           {/* Header */}
//           <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-dark-3">
//             <div className="flex items-center gap-2">
//               <ClipboardList className="h-4 w-4 text-primary" />
//               <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                 Payroll Records
//               </h2>
//             </div>

//             {/* Status filter tabs */}
//             <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-dark-3 ">
//               {(
//                 [
//                   { label: "All", value: "" },
//                   { label: "Draft", value: PayrollStatus.DRAFT },
//                   { label: "Approved", value: PayrollStatus.APPROVED },
//                   { label: "Paid", value: PayrollStatus.PAID },
//                 ] as { label: string; value: PayrollStatus | "" }[]
//               ).map((tab) => (
//                 <button
//                   key={tab.value}
//                   onClick={() => setFilterStatus(tab.value)}
//                   className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
//                     filterStatus === tab.value
//                       ? "bg-primary text-gray-200 "
//                       : ""
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Table */}
//           <TableRoot>
//             <TableHeader>
//               <TableRow>
//                 {[
//                   "Period",
//                   "Employees",
//                   "Gross Salary",
//                   "Earnings",
//                   "Deductions",
//                   "Generated By",
//                   "Status",
//                   "Actions",
//                 ].map((h, i) => (
//                   <TableHead
//                     key={h}
//                     className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${
//                       i === 0 || i === 5 || i === 6 || i === 7
//                         ? "text-left"
//                         : "text-right"
//                     }`}
//                   >
//                     {h}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {recordsLoading ? (
//                 <RecordSkeletonRows />
//               ) : payrollList.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={8}
//                     className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
//                   >
//                     No payroll records found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 payrollList.map((record) => {
//                   const isBusy =
//                     actionId === record.id &&
//                     (approving || markingPaid || revoking);
//                   return (
//                     <TableRow
//                       key={record.id}
//                       className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
//                     >
//                       <TableCell className="font-medium text-gray-900 dark:text-white">
//                         {getMonthName(record.month)} {record.year}
//                       </TableCell>
//                       <TableCell className="text-right text-gray-700 dark:text-gray-300">
//                         {record.totalEmployees}
//                       </TableCell>
//                       <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
//                         {formatCurrency(record.totalAmount)}
//                       </TableCell>
//                       <TableCell className="text-right text-green-600 dark:text-green-400">
//                         {formatCurrency(record.totalEarnings)}
//                       </TableCell>
//                       <TableCell className="text-right text-red-500 dark:text-red-400">
//                         {formatCurrency(record.totalDeductions)}
//                       </TableCell>
//                       <TableCell>
//                         <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
//                           {record.generatedBy?.name ?? "—"}
//                         </p>
//                         <p className="text-xs text-gray-400 dark:text-gray-500">
//                           {record.generatedBy?.email ?? ""}
//                         </p>
//                       </TableCell>
//                       <TableCell>
//                         <PayrollStatusBadge status={record.status} />
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           {/* Admin: Approve DRAFT records */}
//                           {isAdmin && record.status === PayrollStatus.DRAFT && (
//                             <button
//                               disabled={isBusy}
//                               onClick={() => handleApprove(record)}
//                               className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-60 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
//                             >
//                               {isBusy && approving ? (
//                                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                               ) : (
//                                 <ShieldCheck className="h-3.5 w-3.5" />
//                               )}
//                               Approve
//                             </button>
//                           )}

//                           {/* Finance + Admin: Mark Paid on APPROVED records */}
//                           {(isAdmin || isFinance) &&
//                             record.status === PayrollStatus.APPROVED && (
//                               <button
//                                 disabled={isBusy}
//                                 onClick={() => handleMarkPaid(record)}
//                                 className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-60 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
//                               >
//                                 {isBusy && markingPaid ? (
//                                   <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                                 ) : (
//                                   <CreditCard className="h-3.5 w-3.5" />
//                                 )}
//                                 Mark Paid
//                               </button>
//                             )}

//                           {/* Admin: Revoke Approval on APPROVED records */}
//                           {isAdmin &&
//                             record.status === PayrollStatus.APPROVED && (
//                               <button
//                                 disabled={isBusy}
//                                 onClick={() => handleRevokeApproval(record)}
//                                 className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
//                               >
//                                 {isBusy && revoking ? (
//                                   <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                                 ) : (
//                                   <RotateCcw className="h-3.5 w-3.5" />
//                                 )}
//                                 Revoke
//                               </button>
//                             )}

//                           {/* Admin/Finance: Generate Payslips on APPROVED or PAID records */}
//                           {(isAdmin || isFinance) &&
//                             (record.status === PayrollStatus.APPROVED ||
//                               record.status === PayrollStatus.PAID) && (
//                               <button
//                                 disabled={
//                                   payslipActionId === record.id &&
//                                   generatingPayslips
//                                 }
//                                 onClick={() => setPayslipConfirmRecord(record)}
//                                 className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 disabled:opacity-60 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20"
//                               >
//                                 {payslipActionId === record.id &&
//                                 generatingPayslips ? (
//                                   <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                                 ) : (
//                                   <FileOutput className="h-3.5 w-3.5" />
//                                 )}
//                                 Gen. Payslips
//                               </button>
//                             )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </TableRoot>
//         </div>
//       )}
//       {/* Payslip Confirm Modal */}
//       {payslipConfirmRecord && (
//         <PayslipConfirmModal
//           record={payslipConfirmRecord}
//           onClose={() => setPayslipConfirmRecord(null)}
//           onConfirm={() => handleGeneratePayslips(payslipConfirmRecord)}
//           isPending={
//             payslipActionId === payslipConfirmRecord.id && generatingPayslips
//           }
//         />
//       )}
//     </div>
//   );
// }

"use client";

import {
  usePayrollPreview,
  useGeneratePayroll,
  usePayrolls,
  useApprovePayroll,
  useRevokePayrollApproval,
  useGeneratePayslips,
  useExportPayrollCsv,
} from "@/hooks/usePayroll";
import { TotalMonthlySalary } from "@/types/payroll";
import { PayrollStatus } from "@/types/enums";
import { formatCurrency, getMonthName } from "@/utils/format";
import { useAuth } from "@/store/auth.context";
import { ROLES } from "@/config/permissions";
import {
  Users,
  Banknote,
  TrendingDown,
  RefreshCcw,
  Calculator,
  CheckCircle,
  FileText,
  ChevronDown,
  Loader2,
  ShieldCheck,
  CreditCard,
  ClipboardList,
  RotateCcw,
  FileOutput,
  Download,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const now = new Date();
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1),
}));
const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

// ─── Shared select style ──────────────────────────────────────────────────────
const selectCls =
  "appearance-none rounded-xl border border-stroke bg-gray-50 py-2.5 pl-3.5 pr-8 text-sm text-dark outline-none transition " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "dark:border-dark-3 dark:bg-dark-3 dark:text-white";

// ─── Payroll Status Badge ─────────────────────────────────────────────────────
function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const map: Record<PayrollStatus, string> = {
    [PayrollStatus.DRAFT]:
      "inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
    [PayrollStatus.APPROVED]:
      "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
    [PayrollStatus.PAID]:
      "inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
  };
  return (
    <span
      className={
        map[status] ??
        "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ─── Summary Metric Tile ──────────────────────────────────────────────────────
function SummaryTile({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  accent: "primary" | "blue" | "purple" | "red" | "orange" | "green";
}) {
  const a = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      ring: "ring-primary/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      icon: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      ring: "ring-purple-500/20",
    },
    red: {
      bg: "bg-red-500/10",
      icon: "text-red-600 dark:text-red-400",
      ring: "ring-red-500/20",
    },
    orange: {
      bg: "bg-orange-500/10",
      icon: "text-orange-600 dark:text-orange-400",
      ring: "ring-orange-500/20",
    },
    green: {
      bg: "bg-green-500/10",
      icon: "text-green-600 dark:text-green-400",
      ring: "ring-green-500/20",
    },
  }[accent];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.bg} ring-1 ${a.ring}`}
      >
        <Icon className={`h-5 w-5 ${a.icon}`} />
      </div>
      <div className="mt-3">
        <p className="text-base font-bold text-dark dark:text-white">{value}</p>
        <p className="mt-0.5 text-xs text-dark-4 dark:text-dark-6">{title}</p>
      </div>
    </div>
  );
}

// ─── Skeleton Rows ────────────────────────────────────────────────────────────
function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
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

// ─── Payslip Confirm Modal ────────────────────────────────────────────────────
function PayslipConfirmModal({
  record,
  onClose,
  onConfirm,
  isPending,
}: {
  record: TotalMonthlySalary;
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
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/10">
              <FileOutput className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Generate Payslips
              </h3>
              <p className="text-sm text-dark-4 dark:text-dark-6">
                {getMonthName(record.month)} {record.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-4 transition hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2 rounded-xl border border-stroke bg-gray-50 px-4 py-3 dark:border-dark-3 dark:bg-dark-3">
          {[
            { label: "Employees", value: record.totalEmployees },
            {
              label: "Total Payroll",
              value: formatCurrency(record.totalAmount),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-dark-4 dark:text-dark-6">{label}</span>
              <span className="font-semibold text-dark dark:text-white">
                {value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-4 dark:text-dark-6">Status</span>
            <PayrollStatusBadge status={record.status} />
          </div>
        </div>

        <p className="mt-3 text-xs text-dark-4 dark:text-dark-6">
          This will generate individual payslips for all{" "}
          <strong className="text-dark dark:text-white">
            {record.totalEmployees} employees
          </strong>{" "}
          in this payroll period.
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileOutput className="h-4 w-4" />
            )}
            {isPending ? "Generating…" : "Generate Payslips"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PayrollPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin =
    user?.role?.name === ROLES.SUPER_ADMIN || user?.role?.name === ROLES.HR;
  const isFinance = user?.role?.name === ROLES.FINANCE;

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [filterStatus, setFilterStatus] = useState<PayrollStatus | "">("");

  const {
    data: preview,
    isLoading: previewLoading,
    isFetching,
    error: previewError,
  } = usePayrollPreview({ month, year }, previewEnabled);
  const { mutate: generatePayroll, isPending: generating } =
    useGeneratePayroll();
  const { data: payrollList = [], isLoading: recordsLoading } = usePayrolls(
    filterStatus ? { status: filterStatus } : {},
  );
  const { mutate: approvePayroll, isPending: approving } = useApprovePayroll();
  const { mutate: revokeApproval, isPending: revoking } =
    useRevokePayrollApproval();
  const { mutate: generatePayslips, isPending: generatingPayslips } =
    useGeneratePayslips();
  const { mutateAsync: exportCsv, isPending: exportingCsv } =
    useExportPayrollCsv();

  const [actionId, setActionId] = useState<string | null>(null);
  const [payslipActionId, setPayslipActionId] = useState<string | null>(null);
  const [exportingCsvId, setExportingCsvId] = useState<string | null>(null);
  const [payslipConfirmRecord, setPayslipConfirmRecord] =
    useState<TotalMonthlySalary | null>(null);
  const [payslipSuccessRecord, setPayslipSuccessRecord] =
    useState<TotalMonthlySalary | null>(null);

  const items = preview?.items ?? [];
  const summary = preview?.summary;
  const periodLabel = `${getMonthName(month)} ${year}`;

  const handleLoadPreview = () => {
    setGenerated(false);
    setPreviewEnabled(true);
  };
  const handleMonthYearChange = () => {
    setPreviewEnabled(false);
    setGenerated(false);
  };

  const handleGenerate = () => {
    const monthInt = Math.floor(Number(month));
    const yearInt = Math.floor(Number(year));
    if (monthInt < 1 || monthInt > 12) {
      alert("Month must be between 1 and 12");
      return;
    }
    if (yearInt < 2020) {
      alert("Year must be 2020 or later");
      return;
    }
    generatePayroll(
      { month: monthInt, year: yearInt, allowFuture: false },
      { onSuccess: () => setGenerated(true) },
    );
  };

  const handleApprove = (record: TotalMonthlySalary) => {
    setActionId(record.id);
    approvePayroll(record.id, { onSettled: () => setActionId(null) });
  };
  const handleMarkPaid = (record: TotalMonthlySalary) => {
    router.push(`/payroll/${record.id}/transfer`);
  };
  const handleRevokeApproval = (record: TotalMonthlySalary) => {
    setActionId(record.id);
    revokeApproval(record.id, { onSettled: () => setActionId(null) });
  };
  const handleGeneratePayslips = (record: TotalMonthlySalary) => {
    setPayslipActionId(record.id);
    generatePayslips(record.id, {
      onSuccess: () => {
        setPayslipConfirmRecord(null);
        setPayslipSuccessRecord(record);
        toast.success(
          `Payslips generated for ${record.totalEmployees} employees`,
        );
        setTimeout(() => setPayslipSuccessRecord(null), 5000);
      },
      onError: () =>
        toast.error("Failed to generate payslips. Please try again."),
      onSettled: () => setPayslipActionId(null),
    });
  };

  const handleExportPayslipsCsv = async (record: TotalMonthlySalary) => {
    setExportingCsvId(record.id);
    try {
      const blob = await exportCsv(record.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const monthLabel = String(record.month).padStart(2, "0");

      a.href = url;
      a.download = `payslips-${record.year}-${monthLabel}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(
        `CSV exported for ${getMonthName(record.month)} ${record.year}`,
      );
    } catch {
      toast.error("Failed to export payslip CSV. Please try again.");
    } finally {
      setExportingCsvId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Payroll Processing
          </h2>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            Generate monthly payroll for all active employees
          </p>
        </div>
      </div>

      {/* ── Payslip Success Banner ────────────────────────────────────── */}
      {payslipSuccessRecord && (
        <div className="flex items-center gap-3 rounded-[10px] border border-green-200 bg-green-50 px-5 py-4 dark:border-green-500/20 dark:bg-green-500/10">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Payslips Generated Successfully
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              Payslips for {getMonthName(payslipSuccessRecord.month)}{" "}
              {payslipSuccessRecord.year} have been generated for{" "}
              {payslipSuccessRecord.totalEmployees} employees.
            </p>
          </div>
          <button
            onClick={() => setPayslipSuccessRecord(null)}
            className="rounded-lg p-1 text-green-600 transition hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Period Selector ───────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
          <Calculator className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
          <h3 className="text-base font-semibold text-dark dark:text-white">
            Select Payroll Period
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Month */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark-4 dark:text-dark-6">
                Month
              </label>
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(Math.floor(Number(e.target.value)));
                    handleMonthYearChange();
                  }}
                  className={selectCls}
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dark-4 dark:text-dark-6">
                Year
              </label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(Math.floor(Number(e.target.value)));
                    handleMonthYearChange();
                  }}
                  className={selectCls}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleLoadPreview}
              disabled={previewLoading || isFetching}
              className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {previewLoading || isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4" />
              )}
              {previewLoading || isFetching ? "Loading…" : "Load Preview"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Empty/Idle State ──────────────────────────────────────────── */}
      {!previewEnabled && (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-stroke bg-white py-20 text-center dark:border-dark-3 dark:bg-dark-2">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <p className="text-base font-semibold text-dark dark:text-white">
            Select a period to start
          </p>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            Choose a month and year above, then click{" "}
            <strong>Load Preview</strong> to see salary calculations.
          </p>
        </div>
      )}

      {/* ── Preview Section ───────────────────────────────────────────── */}
      {previewEnabled && (
        <>
          {/* Preview Table */}
          <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
                <div>
                  <h3 className="text-base font-semibold text-dark dark:text-white">
                    Salary Preview — {periodLabel}
                  </h3>
                  <p className="text-xs text-dark-4 dark:text-dark-6">
                    Calculated breakdown for all active employees
                  </p>
                </div>
              </div>
              {!previewLoading && items.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Users className="h-3 w-3" />
                  {items.length} employees
                </span>
              )}
            </div>

            {previewError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm text-dark-4 dark:text-dark-6">
                  Failed to load preview. Please try again.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      {[
                        "#",
                        "Employee ID",
                        "Name",
                        "Gross Salary",
                        "Bonuses",
                        "Deductions",
                        "Loan EMI",
                        "Net Salary",
                      ].map((h, i) => (
                        <th
                          key={i}
                          className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${i >= 3 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke dark:divide-dark-3">
                    {previewLoading ? (
                      <SkeletonRows cols={8} />
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                              <Users className="h-7 w-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                              No active employees found
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      items.map((item, i) => (
                        <tr
                          key={item.employeeId}
                          className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                        >
                          <td className="px-6 py-4 text-xs text-dark-4 dark:text-dark-6">
                            {i + 1}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-dark-4 dark:text-dark-6">
                              {item.employeeId}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-dark dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-dark dark:text-white">
                            {formatCurrency(item.grossSalary)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-purple-600 dark:text-purple-400">
                            {formatCurrency(item.bonuses)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-red-500 dark:text-red-400">
                            {formatCurrency(item.deductions)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-orange-500 dark:text-orange-400">
                            {formatCurrency(item.loansEmi)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-dark dark:text-white">
                            {formatCurrency(item.netSalary)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Summary Tiles + Generate CTA ─────────────────────────── */}
          {!previewLoading && summary && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <SummaryTile
                  title="Employees"
                  value={summary.totalEmployees}
                  icon={Users}
                  accent="primary"
                />
                <SummaryTile
                  title="Gross Salary"
                  value={formatCurrency(summary.totalGrossSalary)}
                  icon={Banknote}
                  accent="blue"
                />
                <SummaryTile
                  title="Bonuses"
                  value={formatCurrency(summary.totalBonuses)}
                  icon={FileText}
                  accent="purple"
                />
                <SummaryTile
                  title="Deductions"
                  value={formatCurrency(summary.totalDeductions)}
                  icon={TrendingDown}
                  accent="red"
                />
                <SummaryTile
                  title="Loan Recovery"
                  value={formatCurrency(summary.totalLoanRecovery)}
                  icon={RefreshCcw}
                  accent="orange"
                />
                <SummaryTile
                  title="Net Payable"
                  value={formatCurrency(summary.totalNetPayable)}
                  icon={CheckCircle}
                  accent="green"
                />
              </div>

              {/* Generate CTA */}
              <div
                className={`flex flex-col gap-4 rounded-[10px] border p-6 sm:flex-row sm:items-center sm:justify-between ${
                  generated
                    ? "border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10"
                    : "border-dashed border-stroke bg-white dark:border-dark-3 dark:bg-dark-2"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      generated
                        ? "bg-green-100 dark:bg-green-500/20"
                        : "bg-primary/10 ring-1 ring-primary/20"
                    }`}
                  >
                    {generated ? (
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Sparkles className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-dark dark:text-white">
                      {generated
                        ? "Payroll Generated!"
                        : `Ready to generate payroll for ${periodLabel}?`}
                    </p>
                    <p className="mt-0.5 text-sm text-dark-4 dark:text-dark-6">
                      {generated
                        ? "Payroll has been submitted for approval."
                        : `This will create payroll records for ${summary.totalEmployees} employees.`}
                    </p>
                  </div>
                </div>

                {generated ? (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Generated
                  </span>
                ) : (
                  <button
                    disabled={generating || items.length === 0}
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Banknote className="h-4 w-4" />
                    )}
                    {generating ? "Generating…" : "Generate Payroll"}
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Payroll Records ───────────────────────────────────────────── */}
      {(isAdmin || isFinance) && (
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Payroll Records
              </h3>
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-0.5 rounded-xl border border-stroke bg-gray-50 p-1 dark:border-dark-3 dark:bg-dark-3">
              {(
                [
                  { label: "All", value: "" },
                  { label: "Draft", value: PayrollStatus.DRAFT },
                  { label: "Approved", value: PayrollStatus.APPROVED },
                  { label: "Paid", value: PayrollStatus.PAID },
                ] as { label: string; value: PayrollStatus | "" }[]
              ).map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    filterStatus === tab.value
                      ? "bg-primary text-white "
                      : "text-dark-4 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  {[
                    "Period",
                    "Employees",
                    "Gross Salary",
                    "Earnings",
                    "Deductions",
                    "Generated By",
                    "Status",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${
                        i === 0 || i === 5 || i === 6 || i === 7
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-dark-3">
                {recordsLoading ? (
                  <SkeletonRows cols={8} />
                ) : payrollList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                          <ClipboardList className="h-7 w-7 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                          No payroll records found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payrollList.map((record) => {
                    const isBusy =
                      actionId === record.id && (approving || revoking);
                    return (
                      <tr
                        key={record.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <td className="px-6 py-4 font-semibold text-dark dark:text-white">
                          {getMonthName(record.month)} {record.year}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-dark-4 dark:text-dark-6">
                          {record.totalEmployees}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-dark dark:text-white">
                          {formatCurrency(record.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(record.totalEarnings)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-red-500 dark:text-red-400">
                          {formatCurrency(record.totalDeductions)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-dark dark:text-white">
                            {record.generatedBy?.name ?? "—"}
                          </p>
                          <p className="text-xs text-dark-4 dark:text-dark-6">
                            {record.generatedBy?.email ?? ""}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <PayrollStatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {isAdmin &&
                              record.status === PayrollStatus.DRAFT && (
                                <button
                                  disabled={isBusy}
                                  onClick={() => handleApprove(record)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:opacity-60"
                                >
                                  {isBusy && approving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                  )}
                                  Approve
                                </button>
                              )}
                            {(isAdmin || isFinance) &&
                              record.status === PayrollStatus.APPROVED && (
                                <button
                                  onClick={() => handleMarkPaid(record)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-success-light px-2.5 py-1.5 text-xs font-medium text-success transition hover:opacity-80"
                                >
                                  <CreditCard className="h-3.5 w-3.5" />
                                  Transfer
                                </button>
                              )}
                            {isAdmin &&
                              record.status === PayrollStatus.APPROVED && (
                                <button
                                  disabled={isBusy}
                                  onClick={() => handleRevokeApproval(record)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60 dark:bg-red-500/10 dark:text-red-400"
                                >
                                  {isBusy && revoking ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <RotateCcw className="h-3.5 w-3.5" />
                                  )}
                                  Revoke
                                </button>
                              )}
                            {(isAdmin || isFinance) &&
                              (record.status === PayrollStatus.APPROVED ||
                                record.status === PayrollStatus.PAID) && (
                                <button
                                  disabled={
                                    exportingCsv || exportingCsvId === record.id
                                  }
                                  onClick={() =>
                                    handleExportPayslipsCsv(record)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-60 dark:bg-blue-500/10 dark:text-blue-400"
                                >
                                  {exportingCsvId === record.id &&
                                  exportingCsv ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Download className="h-3.5 w-3.5" />
                                  )}
                                  Export CSV
                                </button>
                              )}
                            {(isAdmin || isFinance) &&
                              (record.status === PayrollStatus.APPROVED ||
                                record.status === PayrollStatus.PAID) && (
                                <button
                                  disabled={
                                    payslipActionId === record.id &&
                                    generatingPayslips
                                  }
                                  onClick={() =>
                                    setPayslipConfirmRecord(record)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 disabled:opacity-60 dark:bg-purple-500/10 dark:text-purple-400"
                                >
                                  {payslipActionId === record.id &&
                                  generatingPayslips ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <FileOutput className="h-3.5 w-3.5" />
                                  )}
                                  Gen. Payslips
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Payslip Confirm Modal  */}
      {payslipConfirmRecord && (
        <PayslipConfirmModal
          record={payslipConfirmRecord}
          onClose={() => setPayslipConfirmRecord(null)}
          onConfirm={() => handleGeneratePayslips(payslipConfirmRecord)}
          isPending={
            payslipActionId === payslipConfirmRecord.id && generatingPayslips
          }
        />
      )}
    </div>
  );
}
