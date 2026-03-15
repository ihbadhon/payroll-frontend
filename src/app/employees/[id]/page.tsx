"use client";

import { useEmployeeDetails } from "@/hooks/useEmployees";
import { EmployeeStatus, EmployeeType } from "@/types/enums";
import { formatDate, formatCurrency } from "@/utils/format";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  Landmark,
  CreditCard,
  PhoneCall,
  AlertTriangle,
  MapPin,
  Clock,
  IdCard,
  Wallet,
  TrendingDown,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EmployeeStatus | string }) {
  const s = status as EmployeeStatus;
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
    <span
      className={
        map[s] ??
        "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[s] ?? status}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: EmployeeType | string }) {
  const t = type as EmployeeType;
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
        map[t] ??
        "inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
      }
    >
      {labels[t] ?? type}
    </span>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  icon: Icon,
  children,
  accent = "default",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: "default" | "green" | "blue" | "orange" | "red";
}) {
  const iconCls = {
    default: "bg-primary/10 text-primary",
    green:
      "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  }[accent];

  return (
    <div className="rounded-[10px] border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
      <div className="flex items-center gap-2.5 border-b border-stroke px-6 py-4 dark:border-dark-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconCls}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-dark dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-dark-3">
          <Icon className="h-3.5 w-3.5 text-dark-4 dark:text-dark-6" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-dark-4 dark:text-dark-6">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-semibold text-dark dark:text-white">
          {value ?? (
            <span className="font-normal text-dark-4 dark:text-dark-6">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Salary Stat Tile ─────────────────────────────────────────────────────────
function SalaryTile({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
      <div
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs text-dark-4 dark:text-dark-6">{label}</p>
      <p className="mt-0.5 text-base font-bold text-dark dark:text-white">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-3" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[10px] bg-gray-100 dark:bg-dark-3"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeDetails(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-3" />
          <div className="h-8 w-40 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-3" />
        </div>
        <Skeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-base font-semibold text-dark dark:text-white">
          Failed to load employee details
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const {
    profile,
    userInfo,
    department,
    currentSalaryStructure,
    bankDetails,
    emergencyContacts,
  } = data;

  // ── Avatar initials ──
  const initials = profile.fullName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* ── Back Button + Hero Header ───────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stroke bg-white text-dark-4 transition hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:border-primary dark:hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Employee Profile
            </h2>
            <p className="mt-0.5 text-sm text-dark-4 dark:text-dark-6">
              Comprehensive profile for {profile.fullName}
            </p>
          </div>
        </div>

        {/* Status + ID chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-white px-3 py-1.5 text-xs font-mono font-semibold text-dark-4 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
            <IdCard className="h-3.5 w-3.5" />
            {profile.employeeId}
          </span>
          <StatusBadge status={profile.status} />
          <TypeBadge type={profile.employeeType} />
        </div>
      </div>

      {/* ── Hero Card ───────────────────────────────────────────────── */}
      <div className="rounded-[10px] border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
        <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary ring-2 ring-primary/20">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-dark dark:text-white">
              {profile.fullName}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-dark-4 dark:text-dark-6">
              {profile.designation}
            </p>
            <p className="mt-0.5 text-xs text-dark-4 dark:text-dark-6">
              {department.name}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 sm:justify-start">
              <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                  <Phone className="h-3.5 w-3.5" />
                  {profile.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined {formatDate(profile.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ── Profile Details ─────────────────────────────────────── */}
        <SectionCard title="Profile Information" icon={User} accent="default">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow
              label="Employee ID"
              value={<span className="font-mono">{profile.employeeId}</span>}
              icon={IdCard}
            />
            <InfoRow label="Full Name" value={profile.fullName} icon={User} />
            <InfoRow label="Email" value={profile.email} icon={Mail} />
            <InfoRow label="Phone" value={profile.phone} icon={Phone} />
            <InfoRow
              label="Designation"
              value={profile.designation}
              icon={Briefcase}
            />
            <InfoRow
              label="Employee Type"
              value={<TypeBadge type={profile.employeeType} />}
            />
            <InfoRow
              label="Status"
              value={<StatusBadge status={profile.status} />}
            />
            <InfoRow
              label="Join Date"
              value={formatDate(profile.joinDate)}
              icon={CalendarDays}
            />
            {profile.resignDate && (
              <InfoRow
                label="Resign Date"
                value={formatDate(profile.resignDate)}
                icon={CalendarDays}
              />
            )}
          </div>
        </SectionCard>

        {/* ── Account & System Info ────────────────────────────────── */}
        <SectionCard
          title="Account Information"
          icon={ShieldCheck}
          accent="blue"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow
              label="Role"
              value={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {userInfo.role?.name ?? "—"}
                </span>
              }
              icon={ShieldCheck}
            />
            <InfoRow
              label="Account Status"
              value={
                userInfo.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-0.5 text-xs font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />{" "}
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />{" "}
                    Inactive
                  </span>
                )
              }
            />
            <InfoRow
              label="Email Verified"
              value={
                userInfo.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <CheckCircle className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="text-xs font-medium text-warning">
                    Not Verified
                  </span>
                )
              }
              icon={BadgeCheck}
            />
            <InfoRow
              label="Last Login"
              value={userInfo.lastLogin ? formatDate(userInfo.lastLogin) : "—"}
              icon={Clock}
            />
            <InfoRow label="User Email" value={userInfo.email} icon={Mail} />
            {userInfo.phone && (
              <InfoRow label="User Phone" value={userInfo.phone} icon={Phone} />
            )}
          </div>
        </SectionCard>

        {/* ── Department ──────────────────────────────────────────── */}
        <SectionCard title="Department" icon={Building2} accent="orange">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow
              label="Department Name"
              value={department.name}
              icon={Building2}
            />
            {department.description && (
              <InfoRow label="Description" value={department.description} />
            )}
          </div>
        </SectionCard>

        {/* ── Bank Details ─────────────────────────────────────────── */}
        <SectionCard title="Bank Details" icon={Landmark} accent="green">
          {bankDetails ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow
                label="Bank Name"
                value={bankDetails.bankName}
                icon={Landmark}
              />
              <InfoRow
                label="Account Type"
                value={bankDetails.accountType}
                icon={CreditCard}
              />
              <InfoRow
                label="Account Holder"
                value={bankDetails.accountHolderName}
                icon={User}
              />
              <InfoRow
                label="Account Number"
                value={
                  <span className="font-mono tracking-wider">
                    {bankDetails.accountNumber}
                  </span>
                }
              />
              {bankDetails.routingNumber && (
                <InfoRow
                  label="Routing Number"
                  value={
                    <span className="font-mono">
                      {bankDetails.routingNumber}
                    </span>
                  }
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <Landmark className="h-8 w-8 text-gray-300 dark:text-dark-5" />
              <p className="text-sm text-dark-4 dark:text-dark-6">
                No bank details on file
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Salary Structure ─────────────────────────────────────────── */}
      <SectionCard
        title="Current Salary Structure"
        icon={Wallet}
        accent="green"
      >
        {currentSalaryStructure ? (
          <div className="space-y-5">
            {/* Status + effective date row */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  currentSalaryStructure.status === "APPROVED"
                    ? "bg-success-light text-success"
                    : "bg-warning-light text-warning"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {currentSalaryStructure.status}
              </span>
              {currentSalaryStructure.isActive && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                <CalendarDays className="h-3.5 w-3.5" />
                Effective {formatDate(currentSalaryStructure.effectiveFrom)}
              </span>
              {currentSalaryStructure.effectiveTo && (
                <span className="flex items-center gap-1.5 text-xs text-dark-4 dark:text-dark-6">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Until {formatDate(currentSalaryStructure.effectiveTo)}
                </span>
              )}
            </div>

            {/* Salary tiles */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <SalaryTile
                label="Gross Salary"
                value={currentSalaryStructure.grossSalary}
                icon={Wallet}
                color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
              />
              <SalaryTile
                label="Total Earnings"
                value={currentSalaryStructure.totalEarnings}
                icon={TrendingUp}
                color="bg-success-light text-success"
              />
              <SalaryTile
                label="Total Deductions"
                value={currentSalaryStructure.totalDeductions}
                icon={TrendingDown}
                color="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              />
              <SalaryTile
                label="Net Salary"
                value={currentSalaryStructure.netSalary}
                icon={CheckCircle}
                color="bg-primary/10 text-primary"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Wallet className="h-8 w-8 text-gray-300 dark:text-dark-5" />
            <p className="text-sm text-dark-4 dark:text-dark-6">
              No salary structure assigned
            </p>
          </div>
        )}
      </SectionCard>

      {/* ── Emergency Contacts ───────────────────────────────────────── */}
      <SectionCard title="Emergency Contacts" icon={PhoneCall} accent="red">
        {emergencyContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <PhoneCall className="h-8 w-8 text-gray-300 dark:text-dark-5" />
            <p className="text-sm text-dark-4 dark:text-dark-6">
              No emergency contacts on file
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {emergencyContacts.map(
              (
                contact: import("@/types/employee").EmployeeDetailsEmergencyContact,
                idx: number,
              ) => (
                <div
                  key={contact.id}
                  className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        {contact.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">
                          {contact.name}
                        </p>
                        <p className="text-xs capitalize text-dark-4 dark:text-dark-6">
                          {contact.relationship}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{contact.phone}</span>
                      {contact.alternatePhone && (
                        <span className="text-dark-4 dark:text-dark-6">
                          / {contact.alternatePhone}
                        </span>
                      )}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-2 text-xs text-dark-4 dark:text-dark-6">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{contact.address}</span>
                      </div>
                    )}
                    {contact.notes && (
                      <p className="mt-2 rounded-lg border border-stroke bg-white px-3 py-2 text-xs italic text-dark-4 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
                        &ldquo;{contact.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
