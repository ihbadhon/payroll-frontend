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
// import { useMyBonuses } from "@/hooks/useMyData";
// import { formatCurrency, getMonthName, formatDate } from "@/utils/format";
// import { BonusStatus, BonusType } from "@/types/enums";
// import {
//   BadgeDollarSign,
//   Clock,
//   CheckCircle2,
//   Banknote,
//   Star,
//   Gift,
//   Calendar,
//   Zap,
// } from "lucide-react";

// // ─── Status Badge ─────────────────────────────────────────────────────────────
// function BonusStatusBadge({ status }: { status: BonusStatus }) {
//   const styles: Record<BonusStatus, string> = {
//     [BonusStatus.PENDING]:
//       "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
//     [BonusStatus.APPROVED]:
//       "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//     [BonusStatus.PAID]:
//       "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
//   };
//   const icons: Record<BonusStatus, React.ReactNode> = {
//     [BonusStatus.PENDING]: <Clock className="h-3 w-3" />,
//     [BonusStatus.APPROVED]: <CheckCircle2 className="h-3 w-3" />,
//     [BonusStatus.PAID]: <Banknote className="h-3 w-3" />,
//   };
//   const labels: Record<BonusStatus, string> = {
//     [BonusStatus.PENDING]: "Pending",
//     [BonusStatus.APPROVED]: "Approved",
//     [BonusStatus.PAID]: "Paid",
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

// // ─── Bonus Type Badge ──────────────────────────────────────────────────────────
// function BonusTypeBadge({ type }: { type: BonusType }) {
//   const config: Record<
//     BonusType,
//     { label: string; icon: React.ReactNode; cls: string }
//   > = {
//     [BonusType.PERFORMANCE]: {
//       label: "Performance",
//       icon: <Star className="h-3 w-3" />,
//       cls: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
//     },
//     [BonusType.FESTIVAL]: {
//       label: "Festival",
//       icon: <Gift className="h-3 w-3" />,
//       cls: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
//     },
//     [BonusType.YEARLY]: {
//       label: "Yearly",
//       icon: <Calendar className="h-3 w-3" />,
//       cls: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//     },
//     [BonusType.ONE_TIME]: {
//       label: "One-Time",
//       icon: <Zap className="h-3 w-3" />,
//       cls: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
//     },
//   };
//   const { label, icon, cls } = config[type] ?? {
//     label: type,
//     icon: null,
//     cls: "bg-gray-100 text-gray-600",
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

// export default function MyBonusesPage() {
//   const { data: bonuses = [], isLoading } = useMyBonuses();

//   const totalPaid = bonuses
//     .filter((b) => b.status === BonusStatus.PAID)
//     .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
//   const pendingBonuses = bonuses.filter(
//     (b) =>
//       b.status === BonusStatus.PENDING || b.status === BonusStatus.APPROVED,
//   );
//   const pendingAmount = pendingBonuses.reduce(
//     (sum, b) => sum + parseFloat(b.amount || "0"),
//     0,
//   );
//   const latestBonus = bonuses[0] ?? null;

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="My Bonuses"
//         description="View your bonus history and pending payments"
//       />

//       {/* ── Stat Cards ──────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Total Bonuses"
//           value={bonuses.length}
//           subtitle="All time bonus records"
//           icon={BadgeDollarSign}
//           iconBg="bg-purple-50 dark:bg-purple-500/10"
//           iconColor="text-purple-600 dark:text-purple-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Total Earned"
//           value={formatCurrency(totalPaid)}
//           subtitle="Paid bonuses total"
//           icon={Banknote}
//           iconBg="bg-green-50 dark:bg-green-500/10"
//           iconColor="text-green-600 dark:text-green-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Pending Bonuses"
//           value={pendingBonuses.length}
//           subtitle={
//             pendingBonuses.length > 0
//               ? `${formatCurrency(pendingAmount)} awaiting payment`
//               : "Nothing pending"
//           }
//           icon={Clock}
//           iconBg="bg-yellow-50 dark:bg-yellow-500/10"
//           iconColor="text-yellow-600 dark:text-yellow-400"
//           isLoading={isLoading}
//         />
//         <StatCard
//           title="Latest Bonus"
//           value={latestBonus ? formatCurrency(latestBonus.amount) : "—"}
//           subtitle={
//             latestBonus
//               ? `${getMonthName(latestBonus.month, true)} ${latestBonus.year}`
//               : "No bonuses yet"
//           }
//           icon={Star}
//           iconBg="bg-orange-50 dark:bg-orange-500/10"
//           iconColor="text-orange-600 dark:text-orange-400"
//           isLoading={isLoading}
//         />
//       </div>

//       {/* ── Bonus Summary by Type ─────────────────────────────────────────── */}
//       {!isLoading && bonuses.length > 0 && (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//           {Object.values(BonusType).map((type) => {
//             const typeTotal = bonuses
//               .filter(
//                 (b) => b.bonusType === type && b.status === BonusStatus.PAID,
//               )
//               .reduce((s, b) => s + parseFloat(b.amount || "0"), 0);
//             const typeCount = bonuses.filter(
//               (b) => b.bonusType === type,
//             ).length;
//             if (typeCount === 0) return null;
//             return (
//               <div key={type} className="card flex items-center gap-3 p-4">
//                 <div>
//                   <BonusTypeBadge type={type} />
//                   <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
//                     {formatCurrency(typeTotal)}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {typeCount} bonus{typeCount > 1 ? "es" : ""}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Bonus Table ──────────────────────────────────────────────────── */}
//       <div className="card overflow-hidden">
//         <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-3">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//             Bonus History
//           </h2>
//           <p className="text-xs text-gray-400">
//             All bonus records assigned to you
//           </p>
//         </div>
//         <TableRoot>
//           <TableHeader>
//             <TableRow>
//               {[
//                 "#",
//                 "Period",
//                 "Type",
//                 "Amount",
//                 "Reason",
//                 "Status",
//                 "Date",
//               ].map((h, i) => (
//                 <TableHead
//                   key={h}
//                   className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${
//                     i === 3 ? "text-right" : "text-left"
//                   }`}
//                 >
//                   {h}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <SkeletonRow cols={7} />
//             ) : bonuses.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="py-14 text-center">
//                   <Gift className="mx-auto mb-2 h-8 w-8 text-gray-300" />
//                   <p className="text-sm text-gray-400">
//                     No bonuses assigned yet
//                   </p>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               bonuses.map((bonus, i) => (
//                 <TableRow
//                   key={bonus.id}
//                   className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
//                 >
//                   <TableCell className="text-center text-xs text-gray-400">
//                     {i + 1}
//                   </TableCell>
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {getMonthName(bonus.month, true)} {bonus.year}
//                   </TableCell>
//                   <TableCell>
//                     <BonusTypeBadge type={bonus.bonusType} />
//                   </TableCell>
//                   <TableCell className="text-right font-bold text-gray-900 dark:text-white">
//                     {formatCurrency(bonus.amount)}
//                   </TableCell>
//                   <TableCell className="max-w-[180px] truncate text-xs text-gray-500 dark:text-gray-400">
//                     {bonus.reason ?? "—"}
//                   </TableCell>
//                   <TableCell>
//                     <BonusStatusBadge status={bonus.status} />
//                   </TableCell>
//                   <TableCell className="text-xs text-gray-500 dark:text-gray-400">
//                     {formatDate(bonus.createdAt)}
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

import { useMyBonuses } from "@/hooks/useMyData";
import { formatCurrency, getMonthName, formatDate } from "@/utils/format";
import { BonusStatus, BonusType } from "@/types/enums";
import {
  BadgeDollarSign,
  Clock,
  CheckCircle2,
  Banknote,
  Star,
  Gift,
  Calendar,
  Zap,
  ArrowUpRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function BonusStatusBadge({ status }: { status: BonusStatus }) {
  const map: Record<
    BonusStatus,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    [BonusStatus.PENDING]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
      icon: <Clock className="h-3 w-3" />,
      label: "Pending",
    },
    [BonusStatus.APPROVED]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Approved",
    },
    [BonusStatus.PAID]: {
      cls: "inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
      icon: <Banknote className="h-3 w-3" />,
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

// ─── Type Badge ───────────────────────────────────────────────────────────────
function BonusTypeBadge({ type }: { type: BonusType }) {
  const config: Record<
    BonusType,
    { label: string; icon: React.ReactNode; cls: string }
  > = {
    [BonusType.PERFORMANCE]: {
      label: "Performance",
      icon: <Star className="h-3 w-3" />,
      cls: "inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    },
    [BonusType.FESTIVAL]: {
      label: "Festival",
      icon: <Gift className="h-3 w-3" />,
      cls: "inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
    },
    [BonusType.YEARLY]: {
      label: "Yearly",
      icon: <Calendar className="h-3 w-3" />,
      cls: "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
    [BonusType.ONE_TIME]: {
      label: "One-Time",
      icon: <Zap className="h-3 w-3" />,
      cls: "inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    },
  };
  const { label, icon, cls } = config[type] ?? {
    label: type,
    icon: null,
    cls: "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600",
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
  accent: "purple" | "green" | "yellow" | "orange";
  badge?: string;
  isLoading?: boolean;
}) {
  const a = {
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
    yellow: {
      bg: "bg-yellow-500/10",
      icon: "text-yellow-600 dark:text-yellow-400",
      ring: "ring-yellow-500/20",
      badge:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
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

// ─── Type config for summary tiles ───────────────────────────────────────────
const typeConfig: Record<
  BonusType,
  { icon: React.ElementType; bg: string; icon_cls: string; ring: string }
> = {
  [BonusType.PERFORMANCE]: {
    icon: Star,
    bg: "bg-purple-500/10",
    icon_cls: "text-purple-600 dark:text-purple-400",
    ring: "ring-purple-500/20",
  },
  [BonusType.FESTIVAL]: {
    icon: Gift,
    bg: "bg-pink-500/10",
    icon_cls: "text-pink-600 dark:text-pink-400",
    ring: "ring-pink-500/20",
  },
  [BonusType.YEARLY]: {
    icon: Calendar,
    bg: "bg-blue-500/10",
    icon_cls: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
  },
  [BonusType.ONE_TIME]: {
    icon: Zap,
    bg: "bg-orange-500/10",
    icon_cls: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-500/20",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MyBonusesPage() {
  const { data: bonuses = [], isLoading } = useMyBonuses();

  const totalPaid = bonuses
    .filter((b) => b.status === BonusStatus.PAID)
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
  const pendingBonuses = bonuses.filter(
    (b) =>
      b.status === BonusStatus.PENDING || b.status === BonusStatus.APPROVED,
  );
  const pendingAmount = pendingBonuses.reduce(
    (sum, b) => sum + parseFloat(b.amount || "0"),
    0,
  );
  const latestBonus = bonuses[0] ?? null;

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            My Bonuses
          </h2>
          <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
            View your bonus history and pending payments
          </p>
        </div>
        {!isLoading && bonuses.length > 0 && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
            <TrendingUp className="h-3.5 w-3.5" />
            {bonuses.length} total record{bonuses.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Metric Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Bonuses"
          value={isLoading ? "—" : bonuses.length}
          subtitle="All time bonus records"
          icon={BadgeDollarSign}
          accent="purple"
          badge="All"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Earned"
          value={formatCurrency(totalPaid)}
          subtitle="Paid bonuses total"
          icon={Banknote}
          accent="green"
          badge="Paid"
          isLoading={isLoading}
        />
        <MetricCard
          title="Pending Bonuses"
          value={isLoading ? "—" : pendingBonuses.length}
          subtitle={
            pendingBonuses.length > 0
              ? `${formatCurrency(pendingAmount)} awaiting payment`
              : "Nothing pending"
          }
          icon={Clock}
          accent="yellow"
          isLoading={isLoading}
        />
        <MetricCard
          title="Latest Bonus"
          value={latestBonus ? formatCurrency(latestBonus.amount) : "—"}
          subtitle={
            latestBonus
              ? `${getMonthName(latestBonus.month, true)} ${latestBonus.year}`
              : "No bonuses yet"
          }
          icon={Star}
          accent="orange"
          isLoading={isLoading}
        />
      </div>

      {/* ── Bonus Type Summary Tiles ─────────────────────────────────── */}
      {!isLoading && bonuses.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.values(BonusType).map((type) => {
            const typeTotal = bonuses
              .filter(
                (b) => b.bonusType === type && b.status === BonusStatus.PAID,
              )
              .reduce((s, b) => s + parseFloat(b.amount || "0"), 0);
            const typeCount = bonuses.filter(
              (b) => b.bonusType === type,
            ).length;
            if (typeCount === 0) return null;
            const { icon: TIcon, bg, icon_cls, ring } = typeConfig[type];
            return (
              <div
                key={type}
                className="rounded-[10px] border border-stroke bg-white p-5  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ring-1 ${ring}`}
                >
                  <TIcon className={`h-5 w-5 ${icon_cls}`} />
                </div>
                <BonusTypeBadge type={type} />
                <p className="mt-2.5 text-base font-bold text-dark dark:text-white">
                  {formatCurrency(typeTotal)}
                </p>
                <p className="mt-0.5 text-xs text-dark-4 dark:text-dark-6">
                  {typeCount} bonus{typeCount > 1 ? "es" : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bonus History Table ──────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <BadgeDollarSign className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
            <div>
              <h3 className="text-base font-semibold text-dark dark:text-white">
                Bonus History
              </h3>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                All bonus records assigned to you
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
                  "Type",
                  "Amount",
                  "Reason",
                  "Status",
                  "Date",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6 ${
                      i === 3 ? "text-right" : "text-left"
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
              ) : bonuses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                        <Gift className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                        No bonuses assigned yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                bonuses.map((bonus, i) => (
                  <tr
                    key={bonus.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                  >
                    <td className="px-6 py-4 text-xs text-dark-4 dark:text-dark-6">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark dark:text-white">
                        {getMonthName(bonus.month, true)} {bonus.year}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <BonusTypeBadge type={bonus.bonusType} />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-dark dark:text-white">
                      {formatCurrency(bonus.amount)}
                    </td>
                    <td className="px-6 py-4 max-w-[180px] truncate text-sm text-dark-4 dark:text-dark-6">
                      {bonus.reason ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <BonusStatusBadge status={bonus.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                      {formatDate(bonus.createdAt)}
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
