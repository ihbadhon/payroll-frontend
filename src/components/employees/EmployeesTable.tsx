// "use client";

// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import {
//   TableRoot,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/ui/Table";
// import EmployeeStatusMenu from "@/components/employees/EmployeeStatusMenu";
// import { Employee } from "@/types/employee";
// import { formatDate } from "@/utils/format";
// import {
//   getEmployeeStatusBadge,
//   getEmployeeTypeBadge,
// } from "@/utils/status-helpers";
// import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

// interface EmployeesTableProps {
//   employees: Employee[];
//   total: number;
//   page: number;
//   limit: number;
//   onPageChange: (page: number) => void;
//   onViewDetails: (employee: Employee) => void;
// }

// export default function EmployeesTable({
//   employees,
//   total,
//   page,
//   limit,
//   onPageChange,
//   onViewDetails,
// }: EmployeesTableProps) {
//   const totalPages = Math.ceil(total / limit);
//   const start = (page - 1) * limit + 1;
//   const end = Math.min(page * limit, total);

//   if (employees.length === 0) {
//     return (
//       <div className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
//         No employees found.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <TableRoot>
//         <TableHeader>
//           <TableRow>
//             {[
//               "Employee ID",
//               "Name",
//               "Department",
//               "Designation",
//               "Type",
//               "Status",
//               "Join Date",
//               "Actions",
//             ].map((h) => (
//               <TableHead key={h} className="whitespace-nowrap uppercase">
//                 {h}
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {employees.map((emp) => {
//             const statusBadge = getEmployeeStatusBadge(emp.status);
//             const typeBadge = getEmployeeTypeBadge(emp.employeeType);

//             return (
//               <TableRow
//                 key={emp.id}
//                 className="group transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
//               >
//                 <TableCell className="whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">
//                   {emp.employeeId}
//                 </TableCell>

//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     {/* Avatar */}
//                     <div
//                       className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
//                                    bg-primary/10 text-xs font-bold text-primary"
//                     >
//                       {emp.fullName
//                         .split(" ")
//                         .map((n) => n[0])
//                         .slice(0, 2)
//                         .join("")
//                         .toUpperCase()}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="truncate font-medium text-gray-900 dark:text-white">
//                         {emp.fullName}
//                       </p>
//                       <p className="truncate text-xs text-gray-400">
//                         {emp.email}
//                       </p>
//                     </div>
//                   </div>
//                 </TableCell>

//                 <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-300">
//                   {emp.department?.name ?? "—"}
//                 </TableCell>

//                 <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-300">
//                   {emp.designation}
//                 </TableCell>

//                 <TableCell>
//                   <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
//                 </TableCell>

//                 <TableCell>
//                   <Badge variant={statusBadge.variant}>
//                     {statusBadge.label}
//                   </Badge>
//                 </TableCell>

//                 <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-300">
//                   {formatDate(emp.joinDate)}
//                 </TableCell>

//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <EmployeeStatusMenu employee={emp} />
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-7 w-7 p-0"
//                       onClick={() => onViewDetails(emp)}
//                       title="View details"
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </TableRoot>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-dark-3">
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             Showing {start}–{end} of {total} employees
//           </p>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => onPageChange(page - 1)}
//               disabled={page === 1}
//               className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100
//                          disabled:opacity-40 disabled:cursor-not-allowed dark:hover:bg-dark-3"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </button>
//             <span className="px-3 text-xs font-medium text-gray-700 dark:text-gray-300">
//               {page} / {totalPages}
//             </span>
//             <button
//               onClick={() => onPageChange(page + 1)}
//               disabled={page === totalPages}
//               className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100
//                          disabled:opacity-40 disabled:cursor-not-allowed dark:hover:bg-dark-3"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import EmployeeStatusMenu from "@/components/employees/EmployeeStatusMenu";
import { Employee } from "@/types/employee";
import { EmployeeStatus, EmployeeType } from "@/types/enums";
import { formatDate } from "@/utils/format";
import { Eye, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  const map: Record<EmployeeStatus, string> = {
    [EmployeeStatus.ACTIVE]:
      "inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success",
    [EmployeeStatus.ON_LEAVE]:
      "inline-flex items-center gap-1.5 rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning",
    [EmployeeStatus.RESIGNED]:
      "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-dark-3 dark:text-gray-400",
    [EmployeeStatus.TERMINATED]:
      "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };
  const labels: Record<EmployeeStatus, string> = {
    [EmployeeStatus.ACTIVE]: "Active",
    [EmployeeStatus.ON_LEAVE]: "On Leave",
    [EmployeeStatus.RESIGNED]: "Resigned",
    [EmployeeStatus.TERMINATED]: "Terminated",
  };
  return (
    <span className={map[status] ?? ""}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status] ?? status}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function EmployeeTypeBadge({ type }: { type: EmployeeType }) {
  const map: Record<EmployeeType, string> = {
    [EmployeeType.FULL_TIME]:
      "inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    [EmployeeType.PART_TIME]:
      "inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    [EmployeeType.CONTRACT]:
      "inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    [EmployeeType.INTERN]:
      "inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  };
  const labels: Record<EmployeeType, string> = {
    [EmployeeType.FULL_TIME]: "Full Time",
    [EmployeeType.PART_TIME]: "Part Time",
    [EmployeeType.CONTRACT]: "Contract",
    [EmployeeType.INTERN]: "Intern",
  };
  return (
    <span
      className={
        map[type] ??
        "inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
      }
    >
      {labels[type] ?? type}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
      {initials}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface EmployeesTableProps {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onViewDetails: (employee: Employee) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EmployeesTable({
  employees,
  total,
  page,
  limit,
  onPageChange,
  onViewDetails,
}: EmployeesTableProps) {
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
          <UserCircle className="h-7 w-7 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
          No employees found
        </p>
        <p className="text-xs text-gray-400">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stroke dark:border-dark-3">
              {[
                "Employee ID",
                "Name",
                "Department",
                "Designation",
                "Type",
                "Status",
                "Join Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-4 dark:text-dark-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="group transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
              >
                {/* Employee ID */}
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-dark-4 dark:text-dark-6">
                    {emp.employeeId}
                  </span>
                </td>

                {/* Name + Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.fullName} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-dark dark:text-white">
                        {emp.fullName}
                      </p>
                      <p className="truncate text-xs text-dark-4 dark:text-dark-6">
                        {emp.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                  {emp.department?.name ?? "—"}
                </td>

                {/* Designation */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                  {emp.designation}
                </td>

                {/* Type */}
                <td className="px-6 py-4">
                  <EmployeeTypeBadge type={emp.employeeType} />
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <EmployeeStatusBadge status={emp.status} />
                </td>

                {/* Join Date */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-dark-4 dark:text-dark-6">
                  {formatDate(emp.joinDate)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <EmployeeStatusMenu employee={emp} />
                    <button
                      onClick={() => onViewDetails(emp)}
                      title="View details"
                      className="rounded-lg p-1.5 text-dark-4 transition hover:bg-blue-50 hover:text-blue-600 dark:text-dark-6 dark:hover:bg-blue-500/10"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-dark-3">
          <p className="text-xs text-dark-4 dark:text-dark-6">
            Showing{" "}
            <span className="font-semibold text-dark dark:text-white">
              {start}–{end}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-dark dark:text-white">
              {total}
            </span>{" "}
            employees
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="rounded-lg p-1.5 text-dark-4 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                      p === page
                        ? "bg-primary text-white "
                        : "text-dark-4 hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-3"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-lg p-1.5 text-dark-4 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
