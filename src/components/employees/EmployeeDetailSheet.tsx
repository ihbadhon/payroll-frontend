"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Employee } from "@/types/employee";
import { formatDate } from "@/utils/format";
import {
  getEmployeeStatusBadge,
  getEmployeeTypeBadge,
} from "@/utils/status-helpers";
import {
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CalendarDays,
  IdCard,
} from "lucide-react";

interface EmployeeDetailSheetProps {
  employee: Employee | null;
  onClose: () => void;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-dark-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white break-words">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeDetailSheet({
  employee,
  onClose,
}: EmployeeDetailSheetProps) {
  const isOpen = !!employee;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto
          bg-white  transition-transform duration-300 dark:bg-dark-2
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {!employee ? null : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Employee Details
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  #{employee.employeeId}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-6">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {employee.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {employee.fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {employee.designation}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {(() => {
                      const s = getEmployeeStatusBadge(employee.status);
                      return <Badge variant={s.variant}>{s.label}</Badge>;
                    })()}
                    {(() => {
                      const t = getEmployeeTypeBadge(employee.employeeType);
                      return <Badge variant={t.variant}>{t.label}</Badge>;
                    })()}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Contact Information
                </p>
                <DetailRow icon={Mail} label="Email" value={employee.email} />
                <DetailRow icon={Phone} label="Phone" value={employee.phone} />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Employment Details
                </p>
                <DetailRow
                  icon={IdCard}
                  label="Employee ID"
                  value={employee.employeeId}
                />
                <DetailRow
                  icon={Building2}
                  label="Department"
                  value={employee.department?.name}
                />
                <DetailRow
                  icon={Briefcase}
                  label="Designation"
                  value={employee.designation}
                />
                <DetailRow
                  icon={Briefcase}
                  label="Employee Type"
                  value={(() => {
                    const t = getEmployeeTypeBadge(employee.employeeType);
                    return <Badge variant={t.variant}>{t.label}</Badge>;
                  })()}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Join Date"
                  value={formatDate(employee.joinDate)}
                />
                {employee.resignDate && (
                  <DetailRow
                    icon={CalendarDays}
                    label="Resign Date"
                    value={formatDate(employee.resignDate)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  System
                </p>
                <DetailRow
                  icon={CalendarDays}
                  label="Created At"
                  value={formatDate(employee.createdAt)}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Last Updated"
                  value={formatDate(employee.updatedAt)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 dark:border-dark-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
