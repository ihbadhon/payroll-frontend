"use client";

import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/shared/EmptyState";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useAuth } from "@/store/auth.context";
import { ROLES } from "@/config/permissions";
import {
  useUnassignedEmployees,
  useSalaryStructures,
  usePendingSalaryStructures,
  useAssignSalary,
  useUpdateSalaryStructure,
  useApproveSalaryStructures,
  useRejectSalaryStructure,
  useSalaryHistory,
} from "@/hooks/useSalaryStructure";
import { Employee } from "@/types/employee";
import {
  SalaryStructure,
  ActiveSalaryEmployee,
} from "@/types/salary-structure";
import { formatCurrency } from "@/utils/format";
import {
  Users,
  Banknote,
  ShieldCheck,
  X,
  XCircle,
  Loader2,
  CheckCircle2,
  ClipboardList,
  UserCheck,
  Pencil,
  Clock,
  History,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ─── Assign Salary Modal ──────────────────────────────────────────────────────
function AssignSalaryModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  const [grossSalary, setGrossSalary] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const { mutate: assignSalary, isPending } = useAssignSalary();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseFloat(grossSalary);
    if (!salary || isNaN(salary) || salary <= 0) return;
    if (!effectiveFrom) return;
    assignSalary(
      {
        employeeId: employee.id,
        grossSalary: salary,
        effectiveFrom,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Assign Salary Structure
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Set gross salary for{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {employee.fullName}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {employee.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {employee.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {employee.employeeId} &middot; {employee.designation}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            label="Gross Salary (BDT)"
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 30000"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            required
          />
          <Input
            label="Effective From"
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isPending}
              disabled={!grossSalary || !effectiveFrom || isPending}
            >
              <Banknote className="h-4 w-4" />
              Assign Salary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Salary Modal ────────────────────────────────────────────────────────
function EditSalaryModal({
  employee,
  onClose,
}: {
  employee: ActiveSalaryEmployee;
  onClose: () => void;
}) {
  const salaryStructure = employee.salaryStructures[0];
  const [grossSalary, setGrossSalary] = useState(
    String(parseFloat(salaryStructure.grossSalary)),
  );
  const { mutate: updateSalary, isPending } = useUpdateSalaryStructure();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(grossSalary);
    if (!amount || isNaN(amount) || amount <= 0) return;
    updateSalary(
      { id: salaryStructure.id, payload: { grossSalary: amount } },
      { onSuccess: onClose },
    );
  };

  const displayName = employee.fullName ?? employee.employeeId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Edit Salary Structure
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Update gross salary for{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {displayName}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3/50">
          <div>
            <p className="text-xs text-gray-400">Current Gross</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(salaryStructure.grossSalary)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Department</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {employee.department.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            label="New Gross Salary (BDT)"
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 35000"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isPending}
              disabled={!grossSalary || isPending}
              className="text-gray-500 cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-gray-500" />
              Update Salary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({
  structure,
  onClose,
}: {
  structure: SalaryStructure;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const { mutate: rejectStructure, isPending } = useRejectSalaryStructure();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    rejectStructure(
      { id: structure.id, payload: { reason: reason.trim() } },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6  dark:bg-dark-2">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Reject Salary Structure
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Provide a reason for rejection
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason
            </label>
            <textarea
              rows={3}
              placeholder="Enter rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-200"
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isPending}
              disabled={!reason.trim() || isPending}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Salary History Modal ─────────────────────────────────────────────────────
function SalaryHistoryModal({
  employeeId,
  employeeName,
  onClose,
}: {
  employeeId: string;
  employeeName: string;
  onClose: () => void;
}) {
  const { data: history = [], isLoading } = useSalaryHistory(employeeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-dark-2 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Salary History
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {employeeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-96 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <History className="h-10 w-10 text-gray-300 dark:text-dark-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No salary history found
              </p>
            </div>
          ) : (
            <ol className="relative border-l border-gray-200 dark:border-dark-3">
              {history.map((entry, i) => (
                <li key={i} className="mb-6 ml-4 last:mb-0">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-primary dark:border-dark-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.effectiveFrom).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(entry.grossSalary)}
                  </p>
                  {i === 0 && (
                    <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Current
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-dark-3" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function Tab({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 border-b-2 px-4 pb-3 pt-1 text-sm font-medium transition-colors ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
    >
      {children}
      {count !== undefined && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs ${
            active
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-gray-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SalaryStructurePage() {
  const { user } = useAuth();
  const isAdmin =
    user?.role?.name === ROLES.SUPER_ADMIN || user?.role?.name === ROLES.HR;

  const [tab, setTab] = useState<"unassigned" | "structures" | "pending">(
    "unassigned",
  );
  const [assignTarget, setAssignTarget] = useState<Employee | null>(null);
  const [editTarget, setEditTarget] = useState<ActiveSalaryEmployee | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<SalaryStructure | null>(
    null,
  );
  const [historyTarget, setHistoryTarget] =
    useState<ActiveSalaryEmployee | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const { data: unassigned = [], isLoading: unassignedLoading } =
    useUnassignedEmployees();

  const { data: structures = [], isLoading: structuresLoading } =
    useSalaryStructures();

  const { data: pendingStructures = [], isLoading: pendingLoading } =
    usePendingSalaryStructures();

  const { mutate: approveStructures, isPending: approving } =
    useApproveSalaryStructures();

  const handleApprove = (structure: SalaryStructure) => {
    setApprovingId(structure.id);
    approveStructures(
      { structureIds: [structure.id] },
      { onSettled: () => setApprovingId(null) },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Structure"
        description="Assign and manage employee salary structures"
      />

      <div className="card overflow-hidden">
        {/* Tab bar */}
        <div className="border-b border-gray-200 px-5 dark:border-dark-3">
          <nav className="flex gap-2">
            <Tab
              active={tab === "unassigned"}
              onClick={() => setTab("unassigned")}
              count={unassigned.length}
            >
              <Users className="h-4 w-4" />
              Unassigned Employees
            </Tab>
            <Tab
              active={tab === "structures"}
              onClick={() => setTab("structures")}
              count={structures.length}
            >
              <ClipboardList className="h-4 w-4" />
              Active Salary
            </Tab>
            <Tab
              active={tab === "pending"}
              onClick={() => setTab("pending")}
              count={pendingStructures.length}
            >
              <Clock className="h-4 w-4" />
              Pending Salary
            </Tab>
          </nav>
        </div>

        {/* ── Unassigned Employees ──────────────────────────────────────── */}
        {tab === "unassigned" && (
          <>
            <div className="border-b border-gray-200 px-5 py-3 dark:border-dark-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Employees without an assigned salary structure.
                {isAdmin && " Click Assign to set their gross salary."}
              </p>
            </div>
            <TableRoot>
              <TableHeader className="bg-gray-50 dark:bg-dark-3">
                <TableRow>
                  {[
                    "#",
                    "Employee ID",
                    "Name",
                    "Designation",
                    "Type",
                    ...(isAdmin ? ["Action"] : []),
                  ].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`uppercase ${i === 5 ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {unassignedLoading ? (
                  <TableSkeleton cols={isAdmin ? 6 : 5} />
                ) : unassigned.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 6 : 5} className="py-14">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <UserCheck className="mx-auto h-10 w-10 text-green-400" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          All employees have salary structures
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  unassigned.map((emp, i) => (
                    <TableRow
                      key={emp.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                    >
                      <TableCell className="text-center text-xs text-gray-400">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          {emp.employeeId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {emp.fullName.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {emp.fullName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {emp.designation}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs capitalize text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          {emp.employeeType.replace("_", " ").toLowerCase()}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-center">
                          <button
                            onClick={() => setAssignTarget(emp)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20"
                          >
                            <Banknote className="h-3.5 w-3.5" />
                            Assign
                          </button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </TableRoot>
          </>
        )}

        {/* ── Salary Structures ─────────────────────────────────────────── */}
        {tab === "structures" && (
          <>
            <div className="border-b border-gray-200 px-5 py-3 dark:border-dark-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active salary structures.
                {isAdmin && " Use Edit to update an employee's gross salary."}
              </p>
            </div>
            <TableRoot>
              <TableHeader className="bg-gray-50 dark:bg-dark-3">
                <TableRow>
                  {[
                    "#",
                    "Employee ID",
                    "Name",
                    "Department",
                    "Gross Salary",
                    "History",
                    ...(isAdmin ? ["Actions"] : []),
                  ].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`uppercase ${
                        i === 4 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {structuresLoading ? (
                  <TableSkeleton cols={isAdmin ? 6 : 5} />
                ) : structures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="py-14">
                      <EmptyState
                        title="No salary structures"
                        description="Assign a salary to an employee to get started."
                        icon={Banknote}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  structures.map((emp, i) => {
                    const salary = emp.salaryStructures[0];
                    return (
                      <TableRow
                        key={emp.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <TableCell className="text-center text-xs text-gray-400">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            {emp.employeeId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {emp.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {emp.fullName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {emp.designation}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {emp.department.name}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(salary.grossSalary)}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => setHistoryTarget(emp)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:bg-dark-3 dark:text-gray-300 dark:hover:bg-dark-3/80"
                          >
                            <History className="h-3.5 w-3.5" />
                            History
                          </button>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditTarget(emp)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </TableRoot>
          </>
        )}

        {/* ── Pending Salary Structures ─────────────────────────────────── */}
        {tab === "pending" && (
          <>
            <div className="border-b border-gray-200 px-5 py-3 dark:border-dark-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Salary structures awaiting approval.
                {isAdmin && " Approve or reject pending requests here."}
              </p>
            </div>
            <TableRoot>
              <TableHeader className="bg-gray-50 dark:bg-dark-3">
                <TableRow>
                  {[
                    "#",
                    "Employee",
                    "Basic Salary",
                    "Gross Salary",
                    "Components",
                    "Submitted",
                    ...(isAdmin ? ["Actions"] : []),
                  ].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`uppercase ${
                        i === 2 || i === 3 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingLoading ? (
                  <TableSkeleton cols={isAdmin ? 7 : 6} />
                ) : pendingStructures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="py-14">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          No pending salary structures
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingStructures.map((s, i) => {
                    const isBusy = approvingId === s.id && approving;
                    return (
                      <TableRow
                        key={s.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-dark-3/50"
                      >
                        <TableCell className="text-center text-xs text-gray-400">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                              {(s.fullName ?? s.employeeId)
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {s.fullName ?? "—"}
                              </p>
                              <p className="font-mono text-xs text-gray-400">
                                {s.employeeId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(s.basicSalary)}
                        </TableCell>
                        <TableCell className="text-right text-gray-700 dark:text-gray-300">
                          {formatCurrency(s.grossSalary)}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {s.components?.length
                            ? `${s.components.length} component${s.components.length > 1 ? "s" : ""}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(s.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <button
                                disabled={isBusy}
                                onClick={() => handleApprove(s)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-60 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                              >
                                {isBusy ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                )}
                                Approve
                              </button>
                              <button
                                disabled={isBusy}
                                onClick={() => setRejectTarget(s)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </TableRoot>
          </>
        )}
      </div>

      {/* ── Modals ─*/}
      {assignTarget && (
        <AssignSalaryModal
          employee={assignTarget}
          onClose={() => setAssignTarget(null)}
        />
      )}
      {editTarget && (
        <EditSalaryModal
          employee={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      {rejectTarget && (
        <RejectModal
          structure={rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
      )}
      {historyTarget && (
        <SalaryHistoryModal
          employeeId={historyTarget.id}
          employeeName={historyTarget.fullName ?? historyTarget.employeeId}
          onClose={() => setHistoryTarget(null)}
        />
      )}
    </div>
  );
}
