// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import Button from "@/components/ui/Button";
// import Badge from "@/components/ui/Badge";
// import AssignBonusModal from "@/components/bonus/AssignBonusModal";
// import BonusTable from "@/components/bonus/BonusTable";
// import { useBonusSummary, useEmployeesWithBonuses } from "@/hooks/useBonuses";
// import { useDepartments, useEmployeesByDepartment } from "@/hooks/useEmployees";
// import { Employee } from "@/types/employee";
// import { BonusStatus } from "@/types/enums";
// import { formatCurrency, getMonthName } from "@/utils/format";
// import { Gift, Users, Building2, Plus, Calendar } from "lucide-react";
// import { useState } from "react";

// const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//   value: i + 1,
//   label: getMonthName(i + 1),
// }));

// const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

// export default function BonusPage() {
//   const now = new Date();
//   const [selectedDeptId, setSelectedDeptId] = useState<string>("");
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [year, setYear] = useState(now.getFullYear());
//   const [showModal, setShowModal] = useState(false);
//   const [preselectedEmployee, setPreselectedEmployee] =
//     useState<Employee | null>(null);

//   // Data
//   const { data: departments = [], isLoading: deptsLoading } = useDepartments();
//   const { data: globalSummary = { pending: 0, approved: 0, paid: 0 } } =
//     useBonusSummary({});

//   // Employees for the chip grid (all dept employees regardless of bonus)
//   const { data: allEmployees = [] } = useEmployeesByDepartment(selectedDeptId);

//   // Employees WITH their bonuses for the selected dept+month+year
//   const { data: employeesWithBonuses = [], isLoading: bonusLoading } =
//     useEmployeesWithBonuses(
//       { departmentId: selectedDeptId || undefined, month, year },
//       !!selectedDeptId,
//     );

//   // Flatten into a bonus list — inject employeeId from parent in case the API omits it on nested bonuses
//   const filteredBonuses = employeesWithBonuses.flatMap((e) =>
//     (e.bonuses ?? []).map((b) => ({ ...b, employeeId: b.employeeId ?? e.id })),
//   );
//   // Cast EmployeeWithBonuses as Employee[] for BonusTable lookup (uses id/fullName/designation)
//   const bonusEmployees = employeesWithBonuses as unknown as Employee[];

//   // Selected department object
//   const selectedDept = departments.find((d) => d.id === selectedDeptId);

//   // Summary stats — amounts from API summary; counts from current view
//   const totalBonusAmount =
//     globalSummary.pending + globalSummary.approved + globalSummary.paid;
//   const pendingCount = filteredBonuses.filter(
//     (b) => b.status === BonusStatus.PENDING,
//   ).length;
//   const approvedCount = filteredBonuses.filter(
//     (b) => b.status === BonusStatus.APPROVED,
//   ).length;
//   const paidCount = filteredBonuses.filter(
//     (b) => b.status === BonusStatus.PAID,
//   ).length;

//   const handleAssignSingle = (emp: Employee) => {
//     setPreselectedEmployee(emp);
//     setShowModal(true);
//   };

//   const handleOpenModal = () => {
//     setPreselectedEmployee(null);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setPreselectedEmployee(null);
//   };

//   const selectCls =
//     "rounded-lg border border-gray-300 bg-white py-1.5 pl-2.5 pr-7 text-xs text-gray-700 outline-none " +
//     "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
//     "dark:border-dark-3 dark:bg-dark-2 dark:text-gray-200";

//   return (
//     <>
//       <div className="space-y-6">
//         {/* Header */}
//         <PageHeader
//           title="Bonuses"
//           description="Assign and manage employee bonuses by department"
//           actions={
//             <Button
//               size="sm"
//               className="gap-2 text-gray-700 dark:text-gray-200"
//               onClick={handleOpenModal}
//               disabled={!selectedDeptId}
//               title={!selectedDeptId ? "Select a department first" : undefined}
//             >
//               <Plus className="h-4 w-4 text-green-600" />
//               Assign Bonus
//             </Button>
//           }
//         />

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//           <StatCard
//             title="Total Bonus Amount"
//             value={formatCurrency(totalBonusAmount)}
//             subtitle={`Pending · Approved · Paid${selectedDept ? ` — ${selectedDept.name}` : ""}`}
//             icon={Gift}
//             iconColor="text-purple-600"
//             iconBg="bg-purple-50 dark:bg-purple-500/10"
//           />
//           <StatCard
//             title="Paid Bonuses"
//             value={paidCount}
//             subtitle={`${approvedCount} approved · ${paidCount} paid`}
//             icon={Users}
//             iconColor="text-green-600"
//             iconBg="bg-green-50 dark:bg-green-500/10"
//             isLoading={bonusLoading}
//           />
//           <StatCard
//             title="Pending Bonuses"
//             value={pendingCount}
//             subtitle="Awaiting approval"
//             icon={Gift}
//             iconColor="text-yellow-600"
//             iconBg="bg-yellow-50 dark:bg-yellow-500/10"
//             isLoading={bonusLoading}
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
//           {/* ── Department sidebar ──────────────────────────────────── */}
//           <div className="card overflow-hidden xl:col-span-1">
//             <div className="border-b border-gray-200 px-4 py-3 dark:border-dark-3">
//               <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                 Departments
//               </h2>
//               <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                 Select to filter bonuses
//               </p>
//             </div>

//             <div className="divide-y divide-gray-100 dark:divide-dark-3">
//               {deptsLoading ? (
//                 <div className="space-y-2 p-3">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div
//                       key={i}
//                       className="h-9 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 departments.map((dept) => {
//                   const isSelected = selectedDeptId === dept.id;
//                   return (
//                     <button
//                       key={dept.id}
//                       onClick={() => setSelectedDeptId(dept.id)}
//                       className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition
//                         hover:bg-gray-50 dark:hover:bg-dark-3/50
//                         ${isSelected ? "bg-primary/5 font-semibold text-primary" : "text-gray-700 dark:text-gray-300"}`}
//                     >
//                       <span
//                         className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold
//                           ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-gray-400"}`}
//                       >
//                         {dept.name[0].toUpperCase()}
//                       </span>
//                       <span className="flex-1 truncate">{dept.name}</span>
//                       {!dept.isActive && (
//                         <Badge
//                           variant="danger"
//                           className="shrink-0 text-[10px]"
//                         >
//                           Off
//                         </Badge>
//                       )}
//                     </button>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* ── Right Panel ───────────────────────────────────────── */}
//           <div className="space-y-4 xl:col-span-3">
//             {/* ─ Empty state when no dept selected ─ */}
//             {!selectedDeptId && (
//               <div className="card flex flex-col items-center justify-center gap-3 py-20 text-center">
//                 <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600" />
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Select a department to view and assign bonuses
//                 </p>
//               </div>
//             )}

//             {selectedDeptId && (
//               <>
//                 {/* Employee chip grid */}
//                 {allEmployees.length > 0 && (
//                   <div className="card overflow-hidden">
//                     <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-dark-3">
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                         {selectedDept?.name} Employees
//                       </h3>
//                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                         {allEmployees.length} member
//                         {allEmployees.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap gap-2 p-4">
//                       {allEmployees.map((emp) => (
//                         <div
//                           key={emp.id}
//                           className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50
//                                      px-3 py-2 dark:border-dark-3 dark:bg-dark-3"
//                         >
//                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
//                             {emp.fullName
//                               .split(" ")
//                               .map((n) => n[0])
//                               .slice(0, 2)
//                               .join("")
//                               .toUpperCase()}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
//                               {emp.fullName}
//                             </p>
//                             <p className="truncate text-[10px] text-gray-400">
//                               {emp.designation}
//                             </p>
//                           </div>
//                           <button
//                             onClick={() => handleAssignSingle(emp)}
//                             className="ml-1 rounded-lg p-1 text-primary transition hover:bg-primary/10"
//                             title={`Assign bonus to ${emp.fullName}`}
//                           >
//                             <Gift className="h-3.5 w-3.5" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Bonus list table */}
//                 <div className="card overflow-hidden">
//                   <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-dark-3">
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                         {selectedDept?.name} — Bonuses
//                       </h3>
//                       <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                         {filteredBonuses.length} bonus record
//                         {filteredBonuses.length !== 1 ? "s" : ""}
//                       </p>
//                     </div>

//                     {/* Month / Year pickers */}
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
//                       <select
//                         value={month}
//                         onChange={(e) => setMonth(Number(e.target.value))}
//                         className={selectCls}
//                       >
//                         {MONTHS.map((m) => (
//                           <option key={m.value} value={m.value}>
//                             {m.label}
//                           </option>
//                         ))}
//                       </select>
//                       <select
//                         value={year}
//                         onChange={(e) => setYear(Number(e.target.value))}
//                         className={selectCls}
//                       >
//                         {YEARS.map((y) => (
//                           <option key={y} value={y}>
//                             {y}
//                           </option>
//                         ))}
//                       </select>
//                       <Button
//                         size="sm"
//                         className="gap-1.5 text-gray-700 dark:text-gray-200"
//                         onClick={handleOpenModal}
//                       >
//                         <Plus className="h-3.5 w-3.5" />
//                         Assign
//                       </Button>
//                     </div>
//                   </div>

//                   <BonusTable
//                     bonuses={filteredBonuses}
//                     employees={bonusEmployees}
//                     isLoading={bonusLoading}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && selectedDept && (
//         <AssignBonusModal
//           isOpen={showModal}
//           onClose={handleCloseModal}
//           departmentId={selectedDeptId}
//           departmentName={selectedDept.name}
//           preselectedEmployee={preselectedEmployee}
//         />
//       )}
//     </>
//   );
// }

"use client";

import AssignBonusModal from "@/components/bonus/AssignBonusModal";
import BonusTable from "@/components/bonus/BonusTable";
import { useBonusSummary, useEmployeesWithBonuses } from "@/hooks/useBonuses";
import { useDepartments, useEmployeesByDepartment } from "@/hooks/useEmployees";
import { Employee } from "@/types/employee";
import { BonusStatus } from "@/types/enums";
import { formatCurrency, getMonthName } from "@/utils/format";
import {
  Gift,
  Users,
  Building2,
  Plus,
  Calendar,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const now = new Date();
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1),
}));
const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

const selectCls =
  "appearance-none rounded-xl border border-stroke bg-gray-50 py-2 pl-3 pr-8 text-xs text-dark outline-none transition " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "dark:border-dark-3 dark:bg-dark-3 dark:text-white";

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
  accent: "purple" | "green" | "yellow";
  isLoading?: boolean;
}) {
  const a = {
    purple: {
      bg: "bg-purple-500/10",
      icon: "text-purple-600 dark:text-purple-400",
      ring: "ring-purple-500/20",
      badge:
        "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    },
    green: {
      bg: "bg-green-500/10",
      icon: "text-green-600 dark:text-green-400",
      ring: "ring-green-500/20",
      badge:
        "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
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
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${a.badge}`}
        >
          <ArrowUpRight className="h-3 w-3" />
          Live
        </span>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <>
            <div className="h-7 w-24 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
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
export default function BonusPage() {
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [preselectedEmployee, setPreselectedEmployee] =
    useState<Employee | null>(null);

  const { data: departments = [], isLoading: deptsLoading } = useDepartments();
  const { data: globalSummary = { pending: 0, approved: 0, paid: 0 } } =
    useBonusSummary({});
  const { data: allEmployees = [] } = useEmployeesByDepartment(selectedDeptId);
  const { data: employeesWithBonuses = [], isLoading: bonusLoading } =
    useEmployeesWithBonuses(
      { departmentId: selectedDeptId || undefined, month, year },
      !!selectedDeptId,
    );

  const filteredBonuses = employeesWithBonuses.flatMap((e) =>
    (e.bonuses ?? []).map((b) => ({ ...b, employeeId: b.employeeId ?? e.id })),
  );
  const bonusEmployees = employeesWithBonuses as unknown as Employee[];
  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  const totalBonusAmount =
    globalSummary.pending + globalSummary.approved + globalSummary.paid;
  const pendingCount = filteredBonuses.filter(
    (b) => b.status === BonusStatus.PENDING,
  ).length;
  const approvedCount = filteredBonuses.filter(
    (b) => b.status === BonusStatus.APPROVED,
  ).length;
  const paidCount = filteredBonuses.filter(
    (b) => b.status === BonusStatus.PAID,
  ).length;

  const handleAssignSingle = (emp: Employee) => {
    setPreselectedEmployee(emp);
    setShowModal(true);
  };
  const handleOpenModal = () => {
    setPreselectedEmployee(null);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setPreselectedEmployee(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Bonuses
            </h2>
            <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
              Assign and manage employee bonuses by department
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            disabled={!selectedDeptId}
            title={!selectedDeptId ? "Select a department first" : undefined}
            className="inline-flex w-fit items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Assign Bonus
          </button>
        </div>

        {/* ── Metric Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MetricCard
            title="Total Bonus Amount"
            value={formatCurrency(totalBonusAmount)}
            subtitle={`Pending · Approved · Paid${selectedDept ? ` — ${selectedDept.name}` : ""}`}
            icon={Gift}
            accent="purple"
          />
          <MetricCard
            title="Paid Bonuses"
            value={paidCount}
            subtitle={`${approvedCount} approved · ${paidCount} paid`}
            icon={Users}
            accent="green"
            isLoading={bonusLoading}
          />
          <MetricCard
            title="Pending Bonuses"
            value={pendingCount}
            subtitle="Awaiting approval"
            icon={Gift}
            accent="yellow"
            isLoading={bonusLoading}
          />
        </div>

        {/* ── Main Layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          {/* Department Sidebar */}
          <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card xl:col-span-1">
            <div className="flex items-center gap-2.5 border-b border-stroke px-5 py-4 dark:border-dark-3">
              <Building2 className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <div>
                <h3 className="text-base font-semibold text-dark dark:text-white">
                  Departments
                </h3>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  Select to filter bonuses
                </p>
              </div>
            </div>

            <div className="p-2">
              {deptsLoading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-3"
                    />
                  ))}
                </div>
              ) : departments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10">
                  <Building2 className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                  <p className="text-xs text-dark-4 dark:text-dark-6">
                    No departments
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {departments.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    return (
                      <button
                        key={dept.id}
                        onClick={() => setSelectedDeptId(dept.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          isSelected
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-dark-4 hover:bg-gray-50 dark:text-dark-6 dark:hover:bg-dark-3/50"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-gray-400"
                          }`}
                        >
                          {dept.name[0].toUpperCase()}
                        </span>
                        <span className="flex-1 truncate">{dept.name}</span>
                        {!dept.isActive && (
                          <span className="shrink-0 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500 dark:bg-red-500/10">
                            Off
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-5 xl:col-span-3">
            {/* Empty state — no department selected */}
            {!selectedDeptId && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-stroke bg-white py-20 text-center dark:border-dark-3 dark:bg-dark-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                  <Building2 className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                  Select a department to view and assign bonuses
                </p>
              </div>
            )}

            {selectedDeptId && (
              <>
                {/* Employee Chip Grid */}
                {allEmployees.length > 0 && (
                  <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
                    <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-dark-3">
                      <div className="flex items-center gap-2.5">
                        <Users className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
                        <h3 className="text-base font-semibold text-dark dark:text-white">
                          {selectedDept?.name} Employees
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-dark-4 dark:bg-dark-3 dark:text-dark-6">
                        {allEmployees.length} member
                        {allEmployees.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5 p-5">
                      {allEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center gap-2.5 rounded-xl border border-stroke bg-gray-50 px-3 py-2 dark:border-dark-3 dark:bg-dark-3"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/20">
                            {emp.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-dark dark:text-white">
                              {emp.fullName}
                            </p>
                            <p className="truncate text-[10px] text-dark-4 dark:text-dark-6">
                              {emp.designation}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAssignSingle(emp)}
                            title={`Assign bonus to ${emp.fullName}`}
                            className="ml-1 rounded-lg p-1.5 text-primary transition hover:bg-primary/10"
                          >
                            <Gift className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bonus Table Card */}
                <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke px-5 py-4 dark:border-dark-3">
                    <div className="flex items-center gap-2.5">
                      <Gift className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
                      <div>
                        <h3 className="text-base font-semibold text-dark dark:text-white">
                          {selectedDept?.name} — Bonuses
                        </h3>
                        <p className="text-xs text-dark-4 dark:text-dark-6">
                          {filteredBonuses.length} bonus record
                          {filteredBonuses.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Month / Year pickers + Assign button */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-dark-4 dark:text-dark-6" />
                      <div className="relative">
                        <select
                          value={month}
                          onChange={(e) => setMonth(Number(e.target.value))}
                          className={selectCls}
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      </div>
                      <div className="relative">
                        <select
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className={selectCls}
                        >
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      </div>
                      <button
                        onClick={handleOpenModal}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Assign
                      </button>
                    </div>
                  </div>

                  <BonusTable
                    bonuses={filteredBonuses}
                    employees={bonusEmployees}
                    isLoading={bonusLoading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Assign Bonus Modal ──────────────────────────────────────────── */}
      {showModal && selectedDept && (
        <AssignBonusModal
          isOpen={showModal}
          onClose={handleCloseModal}
          departmentId={selectedDeptId}
          departmentName={selectedDept.name}
          preselectedEmployee={preselectedEmployee}
        />
      )}
    </>
  );
}
