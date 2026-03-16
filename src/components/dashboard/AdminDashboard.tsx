// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import PayrollChart from "@/components/charts/PayrollChart";
// import StatCard from "@/components/ui/StatCard";
// import RecentPayrollsTable from "@/components/tables/RecentPayrollsTable";
// import Button from "@/components/ui/Button";
// import { useAuth } from "@/store/auth.context";
// import { useEmployeeCount, EMPLOYEE_KEYS } from "@/hooks/useEmployees";
// import { usePayrolls } from "@/hooks/usePayroll";
// import { useLoanStatusCount } from "@/hooks/useLoans";
// import { PAYROLL_KEYS } from "@/hooks/usePayroll";
// import { LOAN_KEYS } from "@/hooks/useLoans";
// import { PayrollStatus } from "@/types/enums";
// import { formatCurrency } from "@/utils/format";
// import { Users, DollarSign, CreditCard, Clock, RefreshCw } from "lucide-react";
// import { useQueryClient } from "@tanstack/react-query";
// import PageLoader from "@/components/shared/PageLoader";

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const {
//     data: employeeData,
//     isLoading: empLoading,
//     isError: empError,
//   } = useEmployeeCount();

//   const {
//     data: payrolls,
//     isLoading: payrollLoading,
//     isError: payrollError,
//   } = usePayrolls({});

//   const { data: loanStatusCount, isLoading: loanLoading } =
//     useLoanStatusCount();

//   // ── Derived stats ──────────────────────────────────────────────────────────
//   const totalEmployees = employeeData ?? 0;
//   const pendingLoanTotal = loanStatusCount?.pending ?? 0;

//   const paidPayrolls = (payrolls ?? []).filter(
//     (p) => p.status === PayrollStatus.PAID,
//   );
//   const latestPaidPayroll =
//     [...paidPayrolls].sort((a, b) =>
//       b.year !== a.year ? b.year - a.year : b.month - a.month,
//     )[0] ?? null;

//   const pendingApprovalPayrolls = (payrolls ?? []).filter(
//     (p) => p.status === PayrollStatus.DRAFT,
//   ).length;

//   const recentPayrolls = [...(payrolls ?? [])]
//     .sort((a, b) => (b.year !== a.year ? b.year - a.year : b.month - a.month))
//     .slice(0, 5);

//   const handleRefresh = () => {
//     queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
//     queryClient.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
//     queryClient.invalidateQueries({ queryKey: LOAN_KEYS.all });
//   };

//   const isLoading = empLoading || payrollLoading || loanLoading;
//   if (isLoading) return <PageLoader />;

//   return (
//     <div className="space-y-6">
//       {/* ── Header ────────────────────────────────────────────────────── */}
//       <PageHeader
//         title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"} 👋`}
//         description={`Logged in as ${user?.role?.name} · Here's your payroll system overview.`}
//         actions={
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={handleRefresh}
//             className="gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </Button>
//         }
//       />

//       {/* ── Stat Cards ───────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Total Employees"
//           value={empError ? "—" : totalEmployees.toLocaleString()}
//           subtitle="All registered employees"
//           icon={Users}
//           iconColor="text-primary"
//           iconBg="bg-primary/10"
//           isLoading={empLoading}
//         />
//         <StatCard
//           title="Last Payroll Amount"
//           value={
//             payrollError || !latestPaidPayroll
//               ? "—"
//               : formatCurrency(latestPaidPayroll.totalAmount)
//           }
//           subtitle={
//             latestPaidPayroll
//               ? `${new Date(2000, latestPaidPayroll.month - 1).toLocaleString("en", { month: "long" })} ${latestPaidPayroll.year}`
//               : "No paid payroll yet"
//           }
//           icon={DollarSign}
//           iconColor="text-green-600"
//           iconBg="bg-green-50 dark:bg-green-500/10"
//           isLoading={payrollLoading}
//         />
//         <StatCard
//           title="Pending Loans"
//           value={pendingLoanTotal.toLocaleString()}
//           subtitle="Awaiting review"
//           icon={CreditCard}
//           iconColor="text-orange-600"
//           iconBg="bg-orange-50 dark:bg-orange-500/10"
//           isLoading={loanLoading}
//         />
//         <StatCard
//           title="Pending Payrolls"
//           value={pendingApprovalPayrolls.toLocaleString()}
//           subtitle="Awaiting approval"
//           icon={Clock}
//           iconColor="text-yellow-600"
//           iconBg="bg-yellow-50 dark:bg-yellow-500/10"
//           isLoading={payrollLoading}
//         />
//       </div>

//       {/* ── Chart + Summary ───────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//         <div className="card p-6 xl:col-span-2">
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//                 Payroll Overview
//               </h2>
//               <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                 Net payroll & deductions — last 6 months
//               </p>
//             </div>
//             <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
//                 Net
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded-sm bg-red-300" />
//                 Deductions
//               </span>
//             </div>
//           </div>
//           {payrollError ? (
//             <div className="flex h-64 items-center justify-center text-sm text-red-400">
//               Failed to load payroll data.
//             </div>
//           ) : (
//             <PayrollChart
//               data={paidPayrolls.map((p) => ({
//                 month: p.month,
//                 year: p.year,
//                 totalAmount: String(p.totalAmount),
//                 totalEarnings: String(p.totalEarnings),
//                 totalDeductions: String(p.totalDeductions),
//               }))}
//             />
//           )}
//         </div>

//         <div className="card p-6">
//           <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
//             Payroll Summary
//           </h2>
//           <div className="space-y-3">
//             {[
//               {
//                 label: "Total Payrolls",
//                 value: (payrolls ?? []).length,
//                 color: "text-primary",
//               },
//               {
//                 label: "Paid",
//                 value: paidPayrolls.length,
//                 color: "text-green-600 dark:text-green-400",
//               },
//               {
//                 label: "Draft / Pending",
//                 value: pendingApprovalPayrolls,
//                 color: "text-yellow-600 dark:text-yellow-400",
//               },
//               {
//                 label: "Pending Loans",
//                 value: pendingLoanTotal,
//                 color: "text-orange-600 dark:text-orange-400",
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-dark-3"
//               >
//                 <span className="text-sm text-gray-600 dark:text-gray-400">
//                   {item.label}
//                 </span>
//                 <span className={`text-sm font-bold ${item.color}`}>
//                   {item.value}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Recent Payrolls Table ─────────────────────────────────────── */}
//       <div className="card p-6">
//         <div className="mb-5 flex items-center justify-between">
//           <div>
//             <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//               Recent Payrolls
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//               Latest 5 payroll runs
//             </p>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => (window.location.href = "/payroll")}
//           >
//             View all →
//           </Button>
//         </div>
//         {payrollError ? (
//           <div className="py-8 text-center text-sm text-red-400">
//             Failed to load payroll records.
//           </div>
//         ) : (
//           <RecentPayrollsTable payrolls={recentPayrolls} />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import RecentPayrollsTable from "@/components/tables/RecentPayrollsTable";
import PayrollChart from "@/components/charts/PayrollChart";
import { useAuth } from "@/store/auth.context";
import { useEmployeeCount, EMPLOYEE_KEYS } from "@/hooks/useEmployees";
import { usePayrolls, PAYROLL_KEYS } from "@/hooks/usePayroll";
import { useLoanStatusCount, LOAN_KEYS } from "@/hooks/useLoans";
import { PayrollStatus } from "@/types/enums";
import { formatCurrency } from "@/utils/format";
import {
  Users,
  DollarSign,
  CreditCard,
  Clock,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Activity,
  Sparkles,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

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
  accent: "primary" | "green" | "orange" | "yellow";
  badge?: string;
  isLoading?: boolean;
}) {
  const a = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      ring: "ring-primary/20",
      badge: "bg-primary/10 text-primary",
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
    yellow: {
      bg: "bg-yellow-500/10",
      icon: "text-yellow-600 dark:text-yellow-400",
      ring: "ring-yellow-500/20",
      badge:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: employeeData,
    isLoading: empLoading,
    isError: empError,
  } = useEmployeeCount();
  const {
    data: payrolls,
    isLoading: payrollLoading,
    isError: payrollError,
  } = usePayrolls({});
  const { data: loanStatusCount, isLoading: loanLoading } =
    useLoanStatusCount();

  const totalEmployees = employeeData ?? 0;
  const pendingLoanTotal = loanStatusCount?.pending ?? 0;

  const paidPayrolls = (payrolls ?? []).filter(
    (p) => p.status === PayrollStatus.PAID,
  );
  const latestPaidPayroll =
    [...paidPayrolls].sort((a, b) =>
      b.year !== a.year ? b.year - a.year : b.month - a.month,
    )[0] ?? null;

  const pendingApprovalPayrolls = (payrolls ?? []).filter(
    (p) => p.status === PayrollStatus.DRAFT,
  ).length;

  const recentPayrolls = [...(payrolls ?? [])]
    .sort((a, b) => (b.year !== a.year ? b.year - a.year : b.month - a.month))
    .slice(0, 5);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
    queryClient.invalidateQueries({ queryKey: PAYROLL_KEYS.all });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.all });
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initials = (user?.name ?? "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-primary to-primary/80 px-6 py-7 shadow-md md:px-8">
        <span className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <span className="absolute -bottom-12 right-24 h-56 w-56 rounded-full bg-white/5" />
        <span className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white shadow-inner ring-2 ring-white/30">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">
                Welcome back 👋
              </p>
              <h1 className="text-xl font-bold text-white">{firstName}!</h1>
              <p className="mt-0.5 text-xs text-white/60">
                {user?.role?.name} · Payroll system overview
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link
              href="/payroll"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              <BarChart3 className="h-4 w-4" />
              Manage Payroll
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Employees"
          value={empError ? "—" : totalEmployees.toLocaleString()}
          subtitle="All registered employees"
          icon={Users}
          accent="primary"
          badge="Active"
          isLoading={empLoading}
        />
        <MetricCard
          title="Last Payroll Amount"
          value={
            payrollError || !latestPaidPayroll
              ? "—"
              : formatCurrency(latestPaidPayroll.totalAmount)
          }
          subtitle={
            latestPaidPayroll
              ? `${new Date(2000, latestPaidPayroll.month - 1).toLocaleString("en", { month: "long" })} ${latestPaidPayroll.year}`
              : "No paid payroll yet"
          }
          icon={DollarSign}
          accent="green"
          badge="Paid"
          isLoading={payrollLoading}
        />
        <MetricCard
          title="Pending Loans"
          value={pendingLoanTotal.toLocaleString()}
          subtitle="Awaiting review"
          icon={CreditCard}
          accent="orange"
          isLoading={loanLoading}
        />
        <MetricCard
          title="Pending Payrolls"
          value={pendingApprovalPayrolls.toLocaleString()}
          subtitle="Awaiting approval"
          icon={Clock}
          accent="yellow"
          isLoading={payrollLoading}
        />
      </div>

      {/* ── Chart + Summary ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Payroll Chart */}
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <div>
                <h3 className="text-base font-semibold text-dark dark:text-white">
                  Payroll Overview
                </h3>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  Net payroll & deductions — last 6 months
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-dark-4 dark:text-dark-6">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                Net
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-300 dark:bg-red-400" />
                Deductions
              </span>
            </div>
          </div>
          <div className="p-6">
            {payrollError ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm text-dark-4 dark:text-dark-6">
                  Failed to load payroll data.
                </p>
              </div>
            ) : (
              <PayrollChart
                data={paidPayrolls.map((p) => ({
                  month: p.month,
                  year: p.year,
                  totalAmount: String(p.totalAmount),
                  totalEarnings: String(p.totalEarnings),
                  totalDeductions: String(p.totalDeductions),
                }))}
              />
            )}
          </div>
        </div>

        {/* Payroll Summary Panel */}
        <div className="flex flex-col gap-5">
          {/* Summary stats */}
          <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
            <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
              <BarChart3 className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Payroll Summary
              </h3>
            </div>
            <div className="p-5">
              <div className="space-y-2.5">
                {[
                  {
                    label: "Total Payrolls",
                    value: (payrolls ?? []).length,
                    color: "text-primary",
                    bg: "bg-primary/5 border-primary/20",
                  },
                  {
                    label: "Paid",
                    value: paidPayrolls.length,
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-50 border-green-200 dark:bg-green-500/5 dark:border-green-500/20",
                  },
                  {
                    label: "Draft / Pending",
                    value: pendingApprovalPayrolls,
                    color: "text-yellow-600 dark:text-yellow-400",
                    bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-500/5 dark:border-yellow-500/20",
                  },
                  {
                    label: "Pending Loans",
                    value: pendingLoanTotal,
                    color: "text-orange-600 dark:text-orange-400",
                    bg: "bg-orange-50 border-orange-200 dark:bg-orange-500/5 dark:border-orange-500/20",
                  },
                ].map(({ label, value, color, bg }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${bg}`}
                  >
                    <span className="text-sm text-dark-4 dark:text-dark-6">
                      {label}
                    </span>
                    <span className={`text-sm font-bold ${color}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick action banner */}
          <div className="flex flex-1 flex-col justify-center rounded-[10px] bg-gradient-to-br from-primary/90 to-primary p-5 ">
            <Sparkles className="mb-3 h-6 w-6 text-white/70" />
            <p className="text-sm font-bold text-white">
              Stay on top of payroll
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70">
              Approve pending payrolls, review loan requests, and manage your
              team&apos;s compensation from one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/payroll"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/30"
              >
                Payroll <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/loans"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/30"
              >
                Loans <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Payrolls Table ─────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Recent Payrolls
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                Latest 5 payroll runs
              </p>
            </div>
          </div>
          <Link
            href="/payroll"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary/80"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="p-6">
          {payrollError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm text-dark-4 dark:text-dark-6">
                Failed to load payroll records.
              </p>
            </div>
          ) : (
            <RecentPayrollsTable payrolls={recentPayrolls} />
          )}
        </div>
      </div>

      {/* ── Quick Stats Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Employees",
            desc: "Manage your workforce",
            href: "/employees",
            icon: Users,
            value: totalEmployees,
            accent: "bg-primary/10 text-primary ring-primary/20",
          },
          {
            label: "Loan Requests",
            desc: `${pendingLoanTotal} pending approval`,
            href: "/loans",
            icon: CreditCard,
            value: pendingLoanTotal,
            accent:
              "bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400",
          },
          {
            label: "Payroll Runs",
            desc: `${paidPayrolls.length} completed`,
            href: "/payroll",
            icon: CheckCircle2,
            value: paidPayrolls.length,
            accent:
              "bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400",
          },
        ].map(({ label, desc, href, icon: Icon, value, accent }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-[10px] border border-stroke bg-white p-5  transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2 dark:shadow-card"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${accent}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-dark dark:text-white">{value}</p>
              <p className="text-sm font-semibold text-dark dark:text-white">
                {label}
              </p>
              <p className="text-xs text-dark-4 dark:text-dark-6">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-dark-4 transition group-hover:translate-x-0.5 group-hover:text-primary dark:text-dark-6" />
          </Link>
        ))}
      </div>
    </div>
  );
}
