"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  useDepartments,
  useCreateEmployee,
  useRoles,
} from "@/hooks/useEmployees";
import { EmployeeType } from "@/types/enums";
import { getErrorMessage } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  roleId: z.string().min(1, "Role is required"),
  designation: z.string().min(1, "Designation is required"),
  employeeType: z.nativeEnum(EmployeeType),
  joinDate: z.string().min(1, "Join date is required"),
});

type FormValues = z.infer<typeof schema>;

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEmployeeModal({
  isOpen,
  onClose,
}: CreateEmployeeModalProps) {
  // Only fetch when the modal is actually open
  const { data: departments = [], isLoading: deptsLoading } =
    useDepartments(isOpen);
  const { data: roles = [], isLoading: rolesLoading } = useRoles(isOpen);
  const { mutateAsync: createEmployee, isPending } = useCreateEmployee();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { employeeType: EmployeeType.FULL_TIME },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await createEmployee({
        ...data,
        phone: data.phone || undefined,
      });
      toast.success("Employee created successfully");
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white  dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Create New Employee
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fill in the details below to add a new employee
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="john@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <Input
              label="Phone (optional)"
              placeholder="+880 1700 000000"
              {...register("phone")}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Department
            </label>
            <select
              {...register("departmentId")}
              disabled={deptsLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                         disabled:cursor-not-allowed disabled:opacity-60
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">
                {deptsLoading ? "Loading departments…" : "Select department"}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Role
            </label>
            <select
              {...register("roleId")}
              disabled={rolesLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                         disabled:cursor-not-allowed disabled:opacity-60
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">
                {rolesLoading ? "Loading roles…" : "Select role"}
              </option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.roleId.message}
              </p>
            )}
          </div>

          {/* Designation + Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                label="Designation"
                placeholder="Software Engineer"
                {...register("designation")}
              />
              {errors.designation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.designation.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Employee Type
              </label>
              <select
                {...register("employeeType")}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                           focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value={EmployeeType.FULL_TIME}>Full Time</option>
                <option value={EmployeeType.PART_TIME}>Part Time</option>
                <option value={EmployeeType.CONTRACT}>Contract</option>
                <option value={EmployeeType.INTERN}>Intern</option>
              </select>
            </div>
          </div>

          {/* Join Date */}
          <div>
            <Input label="Join Date" type="date" {...register("joinDate")} />
            {errors.joinDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.joinDate.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isPending}>
              Create Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
