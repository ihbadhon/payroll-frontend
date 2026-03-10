// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import StatCard from "@/components/ui/StatCard";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import PageLoader from "@/components/shared/PageLoader";
// import EmployeesTable from "@/components/employees/EmployeesTable";
// import EmployeeDetailSheet from "@/components/employees/EmployeeDetailSheet";
// import CreateEmployeeModal from "@/components/employees/CreateEmployeeModal";
// import { useEmployeeCount, useEmployees } from "@/hooks/useEmployees";
// import { Employee, EmployeeSearchParams } from "@/types/employee";
// import { EmployeeStatus, EmployeeType } from "@/types/enums";
// import { Users, UserPlus, Search, SlidersHorizontal } from "lucide-react";
// import { useState } from "react";

// const LIMIT = 15;

// export default function EmployeesPage() {
//   // ── Filters ──────────────────────────────────────────────────────────────────
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "">("");
//   const [typeFilter, setTypeFilter] = useState<EmployeeType | "">("");

//   // ── UI state ──────────────────────────────────────────────────────────────────
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
//     null,
//   );
//   const [showCreate, setShowCreate] = useState(false);

//   // ── Query params ─────────────────────────────────────────────────────────────
//   const params: EmployeeSearchParams = {
//     search: search || undefined,
//     status: statusFilter || undefined,
//     employeeType: typeFilter || undefined,
//     page,
//     limit: LIMIT,
//   };

//   // ── Data ──────────────────────────────────────────────────────────────────────
//   const { data: totalCount, isLoading: countLoading } = useEmployeeCount();
//   const { data: employeeData, isLoading: listLoading } = useEmployees(params);

//   const employees = employeeData?.data ?? [];
//   const total = employeeData?.total ?? 0;

//   console.log("employess page:", employees);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setStatusFilter(e.target.value as EmployeeStatus | "");
//     setPage(1);
//   };

//   const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setTypeFilter(e.target.value as EmployeeType | "");
//     setPage(1);
//   };

//   if (countLoading) return <PageLoader />;

//   return (
//     <>
//       <div className="space-y-6">
//         {/* ── Header ──────────────────────────────────────────────────── */}
//         <PageHeader
//           title="Employees"
//           description="Manage your workforce — view, filter, and update employee records"
//           actions={
//             <Button
//               size="sm"
//               className="gap-2 text-gray-700 dark:text-gray-200"
//               onClick={() => setShowCreate(true)}
//             >
//               <UserPlus className="h-4 w-4 text-green-500" />
//               Add Employee
//             </Button>
//           }
//         />

//         {/* ── Stat Card ───────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//           <StatCard
//             title="Total Employees"
//             value={(totalCount ?? 0).toLocaleString()}
//             subtitle="All registered employees"
//             icon={Users}
//             iconColor="text-primary"
//             iconBg="bg-primary/10"
//             isLoading={countLoading}
//           />
//         </div>

//         {/* ── Filters ─────────────────────────────────────────────────── */}
//         <div className="card p-4">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email or ID…"
//                 value={search}
//                 onChange={handleSearch}
//                 className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm
//                            text-gray-900 placeholder:text-gray-400 outline-none
//                            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
//                            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
//               />
//             </div>

//             {/* Status filter */}
//             <div className="flex items-center gap-2">
//               <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
//               <select
//                 value={statusFilter}
//                 onChange={handleStatusFilter}
//                 className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none
//                            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
//                            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
//               >
//                 <option value="">All Status</option>
//                 <option value={EmployeeStatus.ACTIVE}>Active</option>
//                 <option value={EmployeeStatus.ON_LEAVE}>On Leave</option>
//                 <option value={EmployeeStatus.RESIGNED}>Resigned</option>
//                 <option value={EmployeeStatus.TERMINATED}>Terminated</option>
//               </select>
//             </div>

//             {/* Type filter */}
//             <select
//               value={typeFilter}
//               onChange={handleTypeFilter}
//               className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none
//                          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
//                          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
//             >
//               <option value="">All Types</option>
//               <option value={EmployeeType.FULL_TIME}>Full Time</option>
//               <option value={EmployeeType.PART_TIME}>Part Time</option>
//               <option value={EmployeeType.CONTRACT}>Contract</option>
//               <option value={EmployeeType.INTERN}>Intern</option>
//             </select>
//           </div>
//         </div>

//         {/* ── Table ────────────────────────────────────────────────────── */}
//         <div className="card overflow-hidden">
//           <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
//             <div>
//               <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                 Employee Directory
//               </h2>
//               <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                 {listLoading
//                   ? "Loading…"
//                   : `${total} employee${total !== 1 ? "s" : ""} found`}
//               </p>
//             </div>
//           </div>

//           {listLoading ? (
//             <div className="flex items-center justify-center py-20">
//               <PageLoader />
//             </div>
//           ) : (
//             <EmployeesTable
//               employees={employees}
//               total={total}
//               page={page}
//               limit={LIMIT}
//               onPageChange={setPage}
//               onViewDetails={setSelectedEmployee}
//             />
//           )}
//         </div>
//       </div>

//       {/* ── Detail Sheet ─────────────────────────────────────────────────── */}
//       <EmployeeDetailSheet
//         employee={selectedEmployee}
//         onClose={() => setSelectedEmployee(null)}
//       />

//       {/* ── Create Modal ─────────────────────────────────────────────────── */}
//       <CreateEmployeeModal
//         isOpen={showCreate}
//         onClose={() => setShowCreate(false)}
//       />
//     </>
//   );
// }

"use client";

import EmployeesTable from "@/components/employees/EmployeesTable";
import EmployeeDetailSheet from "@/components/employees/EmployeeDetailSheet";
import CreateEmployeeModal from "@/components/employees/CreateEmployeeModal";
import { useEmployeeCount, useEmployees } from "@/hooks/useEmployees";
import { Employee, EmployeeSearchParams } from "@/types/employee";
import { EmployeeStatus, EmployeeType } from "@/types/enums";
import {
  Users,
  UserPlus,
  Search,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const LIMIT = 15;

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-6  dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <ArrowUpRight className="h-3 w-3" />
          Total
        </span>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <>
            <div className="h-7 w-20 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
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

// ─── Select Input ─────────────────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="rounded-xl border border-stroke bg-gray-50 px-3 py-2.5 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
    >
      {children}
    </select>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<EmployeeType | "">("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showCreate, setShowCreate] = useState(false);

  const params: EmployeeSearchParams = {
    search: search || undefined,
    status: statusFilter || undefined,
    employeeType: typeFilter || undefined,
    page,
    limit: LIMIT,
  };

  const { data: totalCount, isLoading: countLoading } = useEmployeeCount();
  const { data: employeeData, isLoading: listLoading } = useEmployees(params);

  const employees = employeeData?.data ?? [];
  const total = employeeData?.total ?? 0;

  const hasFilters = !!(search || statusFilter || typeFilter);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as EmployeeStatus | "");
    setPage(1);
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as EmployeeType | "");
    setPage(1);
  };

  return (
    <>
      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Employees
            </h2>
            <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
              Manage your workforce — view, filter, and update employee records
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex w-fit items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </button>
        </div>

        {/* ── Stat Card ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MetricCard
            title="Total Employees"
            value={(totalCount ?? 0).toLocaleString()}
            subtitle="All registered employees"
            icon={Users}
            isLoading={countLoading}
          />
        </div>

        {/* ── Filters Bar ────────────────────────────────────────────── */}
        <div className="rounded-[10px] border border-stroke bg-white p-4  dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or ID…"
                value={search}
                onChange={handleSearch}
                className="w-full rounded-xl border border-stroke bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-dark dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-dark-4 dark:text-dark-6" />
              <FilterSelect value={statusFilter} onChange={handleStatusFilter}>
                <option value="">All Status</option>
                <option value={EmployeeStatus.ACTIVE}>Active</option>
                <option value={EmployeeStatus.ON_LEAVE}>On Leave</option>
                <option value={EmployeeStatus.RESIGNED}>Resigned</option>
                <option value={EmployeeStatus.TERMINATED}>Terminated</option>
              </FilterSelect>
            </div>

            {/* Type filter */}
            <FilterSelect value={typeFilter} onChange={handleTypeFilter}>
              <option value="">All Types</option>
              <option value={EmployeeType.FULL_TIME}>Full Time</option>
              <option value={EmployeeType.PART_TIME}>Part Time</option>
              <option value={EmployeeType.CONTRACT}>Contract</option>
              <option value={EmployeeType.INTERN}>Intern</option>
            </FilterSelect>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-stroke px-3 py-2.5 text-xs font-medium text-dark-4 transition hover:border-red-300 hover:text-red-500 dark:border-dark-3 dark:text-dark-6"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stroke pt-3 dark:border-dark-3">
              <span className="text-xs text-dark-4 dark:text-dark-6">
                Active filters:
              </span>
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  Search: "{search}"
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  Status: {statusFilter}
                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setPage(1);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                  Type: {typeFilter.replace("_", " ")}
                  <button
                    onClick={() => {
                      setTypeFilter("");
                      setPage(1);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Employee Table ─────────────────────────────────────────── */}
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex items-center gap-2.5">
              <Users className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <div>
                <h3 className="text-base font-semibold text-dark dark:text-white">
                  Employee Directory
                </h3>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  {listLoading ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                    </span>
                  ) : (
                    `${total} employee${total !== 1 ? "s" : ""} found`
                  )}
                </p>
              </div>
            </div>

            {/* Result count badge */}
            {!listLoading && total > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-dark-4 dark:bg-dark-3 dark:text-dark-6">
                {total} result{total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Table */}
          {listLoading ? (
            <div className="space-y-0 divide-y divide-stroke dark:divide-dark-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
                </div>
              ))}
            </div>
          ) : (
            <EmployeesTable
              employees={employees}
              total={total}
              page={page}
              limit={LIMIT}
              onPageChange={setPage}
              onViewDetails={setSelectedEmployee}
            />
          )}
        </div>
      </div>

      {/* ── Detail Sheet ───────────────────────────────────────────────── */}
      <EmployeeDetailSheet
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      {/* ── Create Modal ───────────────────────────────────────────────── */}
      <CreateEmployeeModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
}
