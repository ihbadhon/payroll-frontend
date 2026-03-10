"use client";

import { useUpdateEmployee } from "@/hooks/useEmployees";
import { Employee } from "@/types/employee";
import { EmployeeStatus } from "@/types/enums";
import { getErrorMessage } from "@/utils/error-handler";
import { getEmployeeStatusBadge } from "@/utils/status-helpers";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const STATUS_OPTIONS: { value: EmployeeStatus; label: string }[] = [
  { value: EmployeeStatus.ACTIVE, label: "Active" },
  { value: EmployeeStatus.ON_LEAVE, label: "On Leave" },
  { value: EmployeeStatus.RESIGNED, label: "Resigned" },
  { value: EmployeeStatus.TERMINATED, label: "Terminated" },
];

const dotColors: Record<EmployeeStatus, string> = {
  [EmployeeStatus.ACTIVE]: "bg-green-500",
  [EmployeeStatus.ON_LEAVE]: "bg-blue-500",
  [EmployeeStatus.RESIGNED]: "bg-yellow-500",
  [EmployeeStatus.TERMINATED]: "bg-red-500",
};

interface EmployeeStatusMenuProps {
  employee: Employee;
}

export default function EmployeeStatusMenu({
  employee,
}: EmployeeStatusMenuProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: update, isPending } = useUpdateEmployee();
  const ref = useRef<HTMLDivElement>(null);
  const badge = getEmployeeStatusBadge(employee.status);

  const handleSelect = async (status: EmployeeStatus) => {
    if (status === employee.status) {
      setOpen(false);
      return;
    }
    setOpen(false);
    try {
      await update({ id: employee.id, payload: { status } });
      toast.success(`Status updated to ${status.replace("_", " ")}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200
                   bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm
                   transition hover:bg-gray-50 disabled:opacity-50
                   dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300 dark:hover:bg-dark-3"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[employee.status]}`}
        />
        {badge.label}
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </button>

      {open && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full z-20 mt-1 w-36 rounded-xl border border-gray-200
                       bg-white py-1 shadow-lg dark:border-dark-3 dark:bg-dark-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition
                  hover:bg-gray-50 dark:hover:bg-dark-3
                  ${opt.value === employee.status ? "font-semibold text-primary" : "text-gray-700 dark:text-gray-300"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${dotColors[opt.value]}`}
                />
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
