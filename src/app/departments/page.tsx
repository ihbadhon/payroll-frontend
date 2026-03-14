// "use client";

// import PageHeader from "@/components/layout/PageHeader";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import StatCard from "@/components/ui/StatCard";
// import Badge from "@/components/ui/Badge";
// import PageLoader from "@/components/shared/PageLoader";
// import { useDepartments, useCreateDepartment } from "@/hooks/useEmployees";
// import { Department } from "@/types/employee";
// import { getErrorMessage } from "@/utils/error-handler";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Building2, Plus, X, CheckCircle2, Users } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";

// // ─── Create Modal ─────────────────────────────────────────────────────────────
// const schema = z.object({
//   name: z.string().min(2, "Department name must be at least 2 characters"),
//   description: z.string().optional(),
// });
// type FormValues = z.infer<typeof schema>;

// function CreateDepartmentModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const { mutateAsync: create, isPending } = useCreateDepartment();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormValues>({ resolver: zodResolver(schema) });

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const onSubmit = async (data: FormValues) => {
//     try {
//       await create({
//         name: data.name,
//         description: data.description || undefined,
//       });
//       toast.success(`Department "${data.name}" created`);
//       handleClose();
//     } catch (err) {
//       toast.error(getErrorMessage(err));
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={handleClose}
//       />
//       <div className="relative z-10 w-full max-w-md rounded-2xl bg-white  dark:bg-dark-2">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
//           <div>
//             <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//               Add Department
//             </h2>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               Create a new department for your organisation
//             </p>
//           </div>
//           <button
//             onClick={handleClose}
//             className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
//           <div>
//             <Input
//               label="Department Name"
//               placeholder="e.g. Engineering, Human Resources"
//               {...register("name")}
//             />
//             {errors.name && (
//               <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
//             )}
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Description{" "}
//               <span className="font-normal text-gray-400">(optional)</span>
//             </label>
//             <textarea
//               {...register("description")}
//               rows={3}
//               placeholder="Brief description of this department…"
//               className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
//                          placeholder:text-gray-400 outline-none resize-none
//                          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
//                          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
//             />
//           </div>
//           <div className="flex justify-end gap-3 pt-1">
//             <Button
//               type="button"
//               className="text-red-500 dark:text-red-500"
//               variant="secondary"
//               size="sm"
//               onClick={handleClose}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="text-green-700 dark:text-gray-200"
//               type="submit"
//               size="sm"
//               isLoading={isPending}
//             >
//               Create Department
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ─── Department Card ──────────────────────────────────────────────────────────
// function DepartmentCard({ dept }: { dept: Department }) {
//   return (
//     <div className="card p-5 flex items-start gap-4 transition hover:shadow-md">
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
//         <Building2 className="h-5 w-5 text-primary" />
//       </div>
//       <div className="min-w-0 flex-1">
//         <div className="flex items-center gap-2">
//           <p className="font-semibold text-gray-900 dark:text-white truncate">
//             {dept.name}
//           </p>
//           <Badge variant={dept.isActive ? "success" : "danger"}>
//             {dept.isActive ? "Active" : "Inactive"}
//           </Badge>
//         </div>
//         {dept.description && (
//           <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
//             {dept.description}
//           </p>
//         )}
//         <p className="mt-1 text-xs text-gray-400 font-mono">
//           ID: {dept.id.slice(0, 8)}…
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function DepartmentsPage() {
//   const [showCreate, setShowCreate] = useState(false);
//   const [search, setSearch] = useState("");

//   const { data: departments = [], isLoading } = useDepartments();

//   const filtered = departments.filter((d) =>
//     d.name.toLowerCase().includes(search.toLowerCase()),
//   );
//   const activeCount = departments.filter((d) => d.isActive).length;

//   if (isLoading) return <PageLoader />;

//   return (
//     <>
//       <div className="space-y-6">
//         {/* Header */}
//         <PageHeader
//           title="Departments"
//           description="Manage your organisation's departments"
//           actions={
//             <Button
//               size="sm"
//               className="gap-2 text-gray-700 dark:text-gray-200"
//               onClick={() => setShowCreate(true)}
//             >
//               <Plus className="h-4 w-4 text-green-600" />
//               Add Department
//             </Button>
//           }
//         />

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//           <StatCard
//             title="Total Departments"
//             value={departments.length}
//             subtitle="All departments"
//             icon={Building2}
//             iconColor="text-primary"
//             iconBg="bg-primary/10"
//           />
//           <StatCard
//             title="Active"
//             value={activeCount}
//             subtitle="Currently active departments"
//             icon={CheckCircle2}
//             iconColor="text-green-600"
//             iconBg="bg-green-50 dark:bg-green-500/10"
//           />
//           <StatCard
//             title="Inactive"
//             value={departments.length - activeCount}
//             subtitle="Deactivated departments"
//             icon={Users}
//             iconColor="text-gray-400"
//             iconBg="bg-gray-100 dark:bg-dark-3"
//           />
//         </div>

//         {/* Search + List */}
//         <div className="card overflow-hidden">
//           <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-dark-3">
//             <div>
//               <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                 Department List
//               </h2>
//               <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                 {filtered.length} of {departments.length} departments
//               </p>
//             </div>
//             {/* Search */}
//             <div className="relative w-56">
//               <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search departments…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm
//                            text-gray-900 placeholder:text-gray-400 outline-none
//                            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
//                            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
//               />
//             </div>
//           </div>

//           {filtered.length === 0 ? (
//             <div className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
//               {search
//                 ? `No departments match "${search}"`
//                 : "No departments yet. Add your first one!"}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
//               {filtered.map((dept) => (
//                 <DepartmentCard key={dept.id} dept={dept} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <CreateDepartmentModal
//         isOpen={showCreate}
//         onClose={() => setShowCreate(false)}
//       />
//     </>
//   );
// }

"use client";

import { useDepartments, useCreateDepartment } from "@/hooks/useEmployees";
import { Department } from "@/types/employee";
import { getErrorMessage } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Plus,
  X,
  CheckCircle2,
  Users,
  Search,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// ─── Create Modal ─────────────────────────────────────────────────────────────
function CreateDepartmentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: create, isPending } = useCreateDepartment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await create({
        name: data.name,
        description: data.description || undefined,
      });
      toast.success(`Department "${data.name}" created`);
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white  dark:bg-dark-2">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-dark dark:text-white">
                Add Department
              </h2>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                Create a new department for your organisation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-dark-4 transition hover:bg-gray-100 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark dark:text-white">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Engineering, Human Resources"
              className="w-full rounded-xl border border-stroke bg-gray-50 px-4 py-2.5 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500"
            />
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" /> {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark dark:text-white">
              Description{" "}
              <span className="font-normal text-dark-4 dark:text-dark-6">
                (optional)
              </span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Brief description of this department…"
              className="w-full resize-none rounded-xl border border-stroke bg-gray-50 px-4 py-2.5 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark-4 transition hover:bg-gray-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isPending ? "Creating…" : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Department Card ──────────────────────────────────────────────────────────
function DepartmentCard({ dept }: { dept: Department }) {
  return (
    <div className="group rounded-[10px] border border-stroke bg-white p-5  transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-dark dark:text-white">
              {dept.name}
            </p>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                dept.isActive
                  ? "bg-success-light text-success"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {dept.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {dept.description && (
            <p className="mt-1 line-clamp-2 text-sm text-dark-4 dark:text-dark-6">
              {dept.description}
            </p>
          )}
          <p className="mt-2 font-mono text-xs text-gray-400 dark:text-gray-500">
            ID: {dept.id.slice(0, 8)}…
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  accent: "primary" | "green" | "gray";
}) {
  const a = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      ring: "ring-primary/20",
      badge: "bg-primary/10 text-primary",
    },
    green: {
      bg: "bg-green-500/10",
      icon: "text-green-600 dark:text-green-400",
      ring: "ring-green-500/20",
      badge:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    gray: {
      bg: "bg-gray-100 dark:bg-dark-3",
      icon: "text-gray-500 dark:text-gray-400",
      ring: "ring-gray-200 dark:ring-dark-3",
      badge: "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-gray-400",
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
          {value}
        </span>
      </div>
      <div className="mt-4">
        <h4 className="text-xl font-bold text-dark dark:text-white">{value}</h4>
        <p className="mt-1 text-sm font-medium text-dark-4 dark:text-dark-6">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DepartmentsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const { data: departments = [], isLoading } = useDepartments();

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );
  const activeCount = departments.filter((d) => d.isActive).length;

  return (
    <>
      <div className="space-y-6">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Departments
            </h2>
            <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
              Manage your organisation's departments
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex w-fit items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </div>

        {/* ── Metric Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] border border-stroke bg-white p-6  dark:border-dark-3 dark:bg-dark-2"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-3" />
                <div className="mt-4 space-y-2">
                  <div className="h-7 w-16 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
                  <div className="h-4 w-28 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                </div>
              </div>
            ))
          ) : (
            <>
              <MetricCard
                title="Total Departments"
                value={departments.length}
                subtitle="All departments"
                icon={Building2}
                accent="primary"
              />
              <MetricCard
                title="Active"
                value={activeCount}
                subtitle="Currently active departments"
                icon={CheckCircle2}
                accent="green"
              />
              <MetricCard
                title="Inactive"
                value={departments.length - activeCount}
                subtitle="Deactivated departments"
                icon={Users}
                accent="gray"
              />
            </>
          )}
        </div>

        {/* ── Department List ─────────────────────────────────────────── */}
        <div className="rounded-[10px] border border-stroke bg-white  dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
          {/* Card Header */}
          <div className="flex flex-col gap-3 border-b border-stroke px-6 py-4 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4.5 w-4.5 text-dark-4 dark:text-dark-6" />
              <div>
                <h3 className="text-base font-semibold text-dark dark:text-white">
                  Department List
                </h3>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  {isLoading
                    ? "Loading…"
                    : `${filtered.length} of ${departments.length} departments`}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-dark dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[10px] border border-stroke p-5 dark:border-dark-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-3" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                      <div className="h-3 w-48 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                      <div className="h-3 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                <Building2 className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
                {search
                  ? `No departments match "${search}"`
                  : "No departments yet"}
              </p>
              {!search && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add your first department
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((dept) => (
                <DepartmentCard key={dept.id} dept={dept} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateDepartmentModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
}
