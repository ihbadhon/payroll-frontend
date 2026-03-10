"use client";

import Badge from "@/components/ui/Badge";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { TotalMonthlySalary } from "@/types/payroll";
import { formatCurrency, formatDate, getMonthName } from "@/utils/format";
import { getPayrollStatusBadge } from "@/utils/status-helpers";
import Link from "next/link";

interface RecentPayrollsTableProps {
  payrolls: TotalMonthlySalary[];
}

export default function RecentPayrollsTable({
  payrolls,
}: RecentPayrollsTableProps) {
  if (payrolls.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        No payroll records found.
      </div>
    );
  }

  return (
    <TableRoot>
      <TableHeader>
        <TableRow>
          {["Period", "Employees", "Total Amount", "Status", "Generated"].map(
            (h) => (
              <TableHead key={h} className="uppercase">
                {h}
              </TableHead>
            ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrolls.map((p) => {
          const { label, variant } = getPayrollStatusBadge(p.status);
          return (
            <TableRow
              key={p.id}
              className="group transition-colors hover:bg-gray-50 dark:hover:bg-dark-3/40"
            >
              <TableCell className="font-medium text-gray-900 dark:text-white">
                <Link
                  href={`/payroll/${p.id}`}
                  className="hover:text-primary dark:hover:text-primary-300"
                >
                  {getMonthName(p.month)} {p.year}
                </Link>
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {p.totalEmployees}
              </TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(p.totalAmount)}
              </TableCell>
              <TableCell>
                <Badge variant={variant}>{label}</Badge>
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400">
                {formatDate(p.generatedAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
}
