"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAssignBonus } from "@/hooks/useBonuses";
import { useEmployeesByDepartment } from "@/hooks/useEmployees";
import { Employee } from "@/types/employee";
import { BonusType } from "@/types/enums";
import { getErrorMessage } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gift, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────
const baseSchema = z.object({
  bonusType: z.nativeEnum(BonusType),
  amount: z.coerce.number().positive("Amount must be positive"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2100),
  reason: z.string().optional(),
});

const singleSchema = baseSchema.extend({
  employeeId: z.string().min(1, "Select an employee"),
});

type SingleFormValues = z.infer<typeof singleSchema>;
type DeptFormValues = z.infer<typeof baseSchema>;
type SingleFormInput = z.input<typeof singleSchema>;
type DeptFormInput = z.input<typeof baseSchema>;

// ─── Shared select/input class ────────────────────────────────────────────────
const selectCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none " +
  "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentName: string;
  /** Pre-selected employee (when user clicks assign from the employee row) */
  preselectedEmployee?: Employee | null;
}

// ─── Single Employee Tab ──────────────────────────────────────────────────────
function SingleTab({
  departmentId,
  preselectedEmployee,
  onClose,
}: {
  departmentId: string;
  preselectedEmployee?: Employee | null;
  onClose: () => void;
}) {
  const { data: employees = [] } = useEmployeesByDepartment(departmentId);
  const { mutateAsync: assign, isPending } = useAssignBonus();

  const now = new Date();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SingleFormInput, unknown, SingleFormValues>({
    resolver: zodResolver(singleSchema),
    defaultValues: {
      bonusType: BonusType.FESTIVAL,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      employeeId: preselectedEmployee?.id ?? "",
    },
  });

  useEffect(() => {
    if (preselectedEmployee)
      reset((v) => ({ ...v, employeeId: preselectedEmployee.id }));
  }, [preselectedEmployee, reset]);

  const onSubmit = async (data: SingleFormValues) => {
    try {
      await assign(data);
      const emp = employees.find((e) => e.id === data.employeeId);
      toast.success(`Bonus assigned to ${emp?.fullName ?? "employee"}`);
      reset();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Employee */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Employee
        </label>
        <select {...register("employeeId")} className={selectCls}>
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.fullName} — {e.designation}
            </option>
          ))}
        </select>
        {errors.employeeId && (
          <p className="mt-1 text-xs text-red-500">
            {errors.employeeId.message}
          </p>
        )}
      </div>

      <BonusFields register={register} errors={errors} />

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" isLoading={isPending}>
          Assign Bonus
        </Button>
      </div>
    </form>
  );
}

// ─── Whole Department Tab ─────────────────────────────────────────────────────
function DepartmentTab({
  departmentId,
  departmentName,
  onClose,
}: {
  departmentId: string;
  departmentName: string;
  onClose: () => void;
}) {
  const { data: employees = [] } = useEmployeesByDepartment(departmentId);
  const { mutateAsync: assign, isPending } = useAssignBonus();

  const now = new Date();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeptFormInput, unknown, DeptFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      bonusType: BonusType.FESTIVAL,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  });

  const onSubmit = async (data: DeptFormValues) => {
    if (employees.length === 0) {
      toast.error("No active employees found in this department");
      return;
    }
    try {
      await Promise.all(
        employees.map((emp) => assign({ ...data, employeeId: emp.id })),
      );
      toast.success(
        `Bonus assigned to all ${employees.length} employees in ${departmentName}`,
      );
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm dark:bg-indigo-500/10">
        <Users className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <p className="text-indigo-700 dark:text-indigo-300">
          This will assign the bonus to{" "}
          <span className="font-semibold">
            {employees.length} employee{employees.length !== 1 ? "s" : ""}
          </span>{" "}
          in <span className="font-semibold">{departmentName}</span>.
        </p>
      </div>

      <BonusFields register={register} errors={errors} />

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" isLoading={isPending}>
          Assign to Whole Department
        </Button>
      </div>
    </form>
  );
}

// ─── Shared bonus fields (type, amount, month, year, reason) ──────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BonusFields({ register, errors }: { register: any; errors: any }) {
  return (
    <>
      {/* Type + Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bonus Type
          </label>
          <select {...register("bonusType")} className={selectCls}>
            <option value={BonusType.FESTIVAL}>Festival</option>
            <option value={BonusType.PERFORMANCE}>Performance</option>
            <option value={BonusType.YEARLY}>Yearly</option>
            <option value={BonusType.ONE_TIME}>One Time</option>
          </select>
        </div>
        <div>
          <Input
            label="Amount"
            type="number"
            placeholder="e.g. 2500"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {/* Month + Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Month
          </label>
          <select {...register("month")} className={selectCls}>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input
            label="Year"
            type="number"
            placeholder="2026"
            {...register("year")}
          />
          {errors.year && (
            <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>
          )}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Reason <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          {...register("reason")}
          rows={2}
          placeholder="e.g. Eid bonus, great performance…"
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm
                     text-gray-900 placeholder:text-gray-400 outline-none
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                     dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
    </>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
type TabType = "single" | "department";

export default function AssignBonusModal({
  isOpen,
  onClose,
  departmentId,
  departmentName,
  preselectedEmployee,
}: Props) {
  const [tab, setTab] = useState<TabType>(
    preselectedEmployee ? "single" : "single",
  );

  useEffect(() => {
    if (preselectedEmployee) setTab("single");
  }, [preselectedEmployee]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white  dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Assign Bonus
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {departmentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-dark-3">
          {(["single", "department"] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition
                ${
                  tab === t
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {t === "single" ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Gift className="h-3.5 w-3.5" /> Single Employee
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Whole Department
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-6 py-5">
          {tab === "single" ? (
            <SingleTab
              departmentId={departmentId}
              preselectedEmployee={preselectedEmployee}
              onClose={onClose}
            />
          ) : (
            <DepartmentTab
              departmentId={departmentId}
              departmentName={departmentName}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
