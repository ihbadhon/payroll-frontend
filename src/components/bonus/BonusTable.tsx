"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useDeleteBonus } from "@/hooks/useBonuses";
import { Bonus } from "@/types/bonus";
import { Employee } from "@/types/employee";
import { formatCurrency, getMonthName } from "@/utils/format";
import { getBonusStatusBadge } from "@/utils/status-helpers";
import { getErrorMessage } from "@/utils/error-handler";
import { Gift, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const BONUS_TYPE_LABELS: Record<string, string> = {
  FESTIVAL: "Festival",
  PERFORMANCE: "Performance",
  YEARLY: "Yearly",
  ONE_TIME: "One Time",
};

interface BonusTableProps {
  bonuses: Bonus[];
  employees: Employee[];
  isLoading?: boolean;
}

export default function BonusTable({
  bonuses,
  employees,
  isLoading,
}: BonusTableProps) {
  const { mutateAsync: deleteBonus, isPending: deleting } = useDeleteBonus();

  const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));

  const handleDelete = async (id: string, empName: string) => {
    if (!confirm(`Remove bonus for ${empName}?`)) return;
    try {
      await deleteBonus(id);
      toast.success("Bonus removed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3"
          />
        ))}
      </div>
    );
  }

  if (bonuses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Gift className="h-8 w-8 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No bonuses found for this department
        </p>
      </div>
    );
  }

  return (
    <TableRoot>
      <TableHeader>
        <TableRow>
          {["Employee", "Type", "Amount", "Period", "Reason", "Status", ""].map(
            (h) => (
              <TableHead key={h} className="whitespace-nowrap uppercase">
                {h}
              </TableHead>
            ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bonuses.map((bonus) => {
          const emp = empMap[bonus.employeeId];
          const statusBadge = getBonusStatusBadge(bonus.status);
          return (
            <TableRow
              key={bonus.id}
              className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
            >
              <TableCell>
                {emp ? (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {emp.fullName}
                    </p>
                    <p className="text-xs text-gray-400">{emp.designation}</p>
                  </div>
                ) : (
                  <span className="font-mono text-xs text-gray-400">
                    {bonus.employeeId
                      ? String(bonus.employeeId).slice(0, 8) + "…"
                      : "Unknown"}
                  </span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="purple">
                  {BONUS_TYPE_LABELS[bonus.bonusType] ?? bonus.bonusType}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                {formatCurrency(bonus.amount)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-300">
                {getMonthName(bonus.month, true)} {bonus.year}
              </TableCell>
              <TableCell className="max-w-[160px] truncate text-gray-500 dark:text-gray-400">
                {bonus.reason ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-400 hover:bg-red-50 hover:text-red-600
                             dark:hover:bg-red-500/10"
                  onClick={() =>
                    handleDelete(bonus.id, emp?.fullName ?? "this employee")
                  }
                  disabled={deleting}
                  title="Remove bonus"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
}
