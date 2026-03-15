"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  usePayrollItems,
  useMarkPayrollPaid,
  useMarkSingleEmployeePaid,
} from "@/hooks/usePayroll";
import {
  MarkPaidEmployee,
  MarkPaidResponse,
  TransactionEntry,
} from "@/types/payroll";
import { formatCurrency, getMonthName } from "@/utils/format";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle,
  CreditCard,
  Landmark,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "bank", label: "Bank" },
  { value: "card", label: "Card" },
] as const;

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );
}

function EmployeePayRow({
  emp,
  currentStatus,
  txRef,
  paymentMethod,
  onChange,
  onPaymentMethodChange,
  onMarkPaid,
  isPaying,
}: {
  emp: MarkPaidEmployee;
  currentStatus: string;
  txRef: string;
  paymentMethod: string;
  onChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onMarkPaid: () => void;
  isPaying: boolean;
}) {
  const bank = emp.bankDetails;
  const status = currentStatus.toUpperCase();
  const statusCls =
    status === "PAID"
      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
      : status === "APPROVED"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        : "bg-gray-100 text-gray-700 dark:bg-dark-3 dark:text-dark-6";

  return (
    <div className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Employee ID
          </p>
          <p className="font-mono text-xs text-dark dark:text-white">
            {emp.employeeId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Name
          </p>
          <p className="text-sm font-semibold text-dark dark:text-white">
            {emp.name}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Gross Salary
          </p>
          <p className="text-xs font-medium text-dark dark:text-white">
            {formatCurrency(emp.grossSalary)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Bonuses
          </p>
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            {formatCurrency(emp.bonuses)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Deductions
          </p>
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {formatCurrency(emp.deductions)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Loan EMI
          </p>
          <p className="text-xs font-medium text-orange-500 dark:text-orange-400">
            {formatCurrency(emp.loansEmi)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Net Salary
          </p>
          <p className="text-xs font-semibold text-dark dark:text-white">
            {formatCurrency(emp.netSalary)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Status
          </p>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusCls}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-dark-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
            Bank Details
          </p>
          {bank ? (
            <div className="space-y-1.5 text-xs text-dark dark:text-white">
              <p className="flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-dark-4 dark:text-dark-6" />
                <span>{bank.bankName}</span>
              </p>
              <p>
                <span className="text-dark-4 dark:text-dark-6">
                  Account Number:
                </span>{" "}
                <span className="font-mono">{bank.accountNumber}</span>
              </p>
              <p>
                <span className="text-dark-4 dark:text-dark-6">
                  Holder Name:
                </span>{" "}
                {bank.accountHolderName}
              </p>
            </div>
          ) : (
            <p className="text-xs text-red-500 dark:text-red-400">
              No bank account details found for this employee.
            </p>
          )}
        </div>

        <div className="rounded-lg bg-gray-50 p-3 dark:bg-dark-3">
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                Transaction Reference
              </label>
              <input
                type="text"
                value={txRef}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. TXN-2026031200123"
                className="w-full rounded-xl border border-stroke bg-white px-4 py-2.5 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-white px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={isPaying || status === "PAID"}
              onClick={onMarkPaid}
              className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {status === "PAID" ? "Paid" : isPaying ? "Paying..." : "Paid"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({
  result,
  onBack,
}: {
  result: MarkPaidResponse;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-500/20 dark:bg-green-500/10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">
              Payroll Transfer Complete
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
              {result.message}
            </p>
            <p className="mt-1 text-xs text-green-700/90 dark:text-green-400/90">
              Period: {getMonthName(result.month)} {result.year}
            </p>
          </div>
        </div>
      </div>

      {result.summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryTile
            label="Employees"
            value={String(result.summary.totalEmployees)}
            accent="border-primary/20 bg-primary/5 text-primary"
          />
          <SummaryTile
            label="Gross Salary"
            value={formatCurrency(result.summary.totalGrossSalary)}
            accent="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
          />
          <SummaryTile
            label="Net Payable"
            value={formatCurrency(result.summary.totalNetPayable)}
            accent="border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
          />
        </div>
      )}

      {result.data && result.data.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">
            Employee Details
          </h3>
          {result.data.map((emp) => {
            const status = (emp.status ?? "PAID").toString().toUpperCase();
            const statusCls =
              status === "PAID"
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                : status === "APPROVED"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-dark-3 dark:text-dark-6";

            return (
              <div
                key={emp.employeeId}
                className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Employee ID
                    </p>
                    <p className="font-mono text-xs text-dark dark:text-white">
                      {emp.employeeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Name
                    </p>
                    <p className="text-sm font-semibold text-dark dark:text-white">
                      {emp.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Gross Salary
                    </p>
                    <p className="text-xs font-medium text-dark dark:text-white">
                      {formatCurrency(emp.grossSalary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Bonuses
                    </p>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(emp.bonuses)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Deductions
                    </p>
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                      {formatCurrency(emp.deductions)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Loan EMI
                    </p>
                    <p className="text-xs font-medium text-orange-500 dark:text-orange-400">
                      {formatCurrency(emp.loansEmi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Net Salary
                    </p>
                    <p className="text-xs font-semibold text-dark dark:text-white">
                      {formatCurrency(emp.netSalary)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-4 dark:text-dark-6">
                      Status
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusCls}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-stroke px-5 py-2.5 text-sm font-semibold text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payroll
        </button>
      </div>
    </div>
  );
}

export default function MarkPaidPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: employees = [], isLoading, isError } = usePayrollItems(id);
  const { mutate: markPaid, isPending } = useMarkPayrollPaid();
  const { mutate: markSinglePaid, isPending: isSinglePaying } =
    useMarkSingleEmployeePaid();

  const [txRefs, setTxRefs] = useState<Record<string, string>>({});
  const [paymentMethods, setPaymentMethods] = useState<Record<string, string>>(
    {},
  );
  const [employeeStatuses, setEmployeeStatuses] = useState<
    Record<string, string>
  >({});
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const [result, setResult] = useState<MarkPaidResponse | null>(null);
  const [serverError, setServerError] = useState("");

  const handleTxChange = (employeeId: string, value: string) => {
    setTxRefs((prev) => ({ ...prev, [employeeId]: value }));
  };

  const handlePaymentMethodChange = (employeeId: string, value: string) => {
    setPaymentMethods((prev) => ({ ...prev, [employeeId]: value }));
  };

  const handleSinglePaid = (emp: MarkPaidEmployee) => {
    if (!emp.employeeUUID) {
      toast.error(`Employee UUID is missing for ${emp.name}.`);
      return;
    }

    setActiveEmployeeId(emp.employeeId);

    const bankTransactionId = txRefs[emp.employeeId]?.trim();
    const paymentMethod =
      paymentMethods[emp.employeeId] ?? (emp.bankDetails ? "bank" : "cash");

    markSinglePaid(
      {
        employeeUUID: emp.employeeUUID,
        payload: {
          payrollId: id,
          amount: emp.netSalary,
          description: `Payroll payment via ${paymentMethod} for ${emp.name}`,
          paymentMethod,
          ...(bankTransactionId ? { bankTransactionId } : {}),
        },
      },
      {
        onSuccess: (response) => {
          setEmployeeStatuses((prev) => ({
            ...prev,
            [emp.employeeId]: "PAID",
          }));
          toast.success(response.message ?? `${emp.name} marked as paid.`);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? `Failed to mark ${emp.name} as paid.`;
          toast.error(msg);
        },
        onSettled: () => setActiveEmployeeId(null),
      },
    );
  };

  const handleSubmit = () => {
    setServerError("");

    const transactions: TransactionEntry[] = employees.map((emp) => ({
      employeeId: emp.employeeId,
      ...(txRefs[emp.employeeId]?.trim()
        ? { transactionRef: txRefs[emp.employeeId].trim() }
        : {}),
    }));

    markPaid(
      { id, transactions },
      {
        onSuccess: (data) => setResult(data),
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to mark payroll as paid.";
          setServerError(msg);
        },
      },
    );
  };

  if (result) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/payroll")}
          className="inline-flex items-center gap-1.5 text-sm text-dark-4 transition hover:text-dark dark:text-dark-6 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payroll
        </button>
        <SuccessScreen result={result} onBack={() => router.push("/payroll")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke text-dark-4 transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Mark Payroll as Paid
          </h1>
          <p className="mt-0.5 text-sm text-dark-4 dark:text-dark-6">
            Review employee payroll details, bank details, and transaction
            references.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {serverError}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-stroke bg-white py-20 dark:border-dark-3 dark:bg-dark-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-dark-4 dark:text-dark-6">
            Loading payroll employees...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Failed to load employees. Please go back and try again.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:text-red-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go Back
          </button>
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-stroke bg-white py-20 text-center dark:border-dark-3 dark:bg-dark-2">
          <AlertCircle className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-dark-4 dark:text-dark-6">
            No employees found for this payroll.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryTile
              label="Employees"
              value={String(employees.length)}
              accent="border-primary/20 bg-primary/5 text-primary"
            />
            <SummaryTile
              label="Gross Salary"
              value={formatCurrency(
                employees.reduce((sum, emp) => sum + emp.grossSalary, 0),
              )}
              accent="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
            />
            <SummaryTile
              label="Deductions"
              value={formatCurrency(
                employees.reduce(
                  (sum, emp) => sum + emp.deductions + emp.loansEmi,
                  0,
                ),
              )}
              accent="border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            />
            <SummaryTile
              label="Net Payable"
              value={formatCurrency(
                employees.reduce((sum, emp) => sum + emp.netSalary, 0),
              )}
              accent="border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
            />
          </div>

          <div className="space-y-4">
            {employees.map((emp) => {
              const currentStatus = (
                employeeStatuses[emp.employeeId] ??
                emp.status ??
                "UNKNOWN"
              )
                .toString()
                .toUpperCase();
              const currentPaymentMethod =
                paymentMethods[emp.employeeId] ??
                (emp.bankDetails ? "bank" : "cash");

              return (
                <EmployeePayRow
                  key={emp.employeeId}
                  emp={emp}
                  currentStatus={currentStatus}
                  txRef={txRefs[emp.employeeId] ?? ""}
                  paymentMethod={currentPaymentMethod}
                  onChange={(value) => handleTxChange(emp.employeeId, value)}
                  onPaymentMethodChange={(value) =>
                    handlePaymentMethodChange(emp.employeeId, value)
                  }
                  onMarkPaid={() => handleSinglePaid(emp)}
                  isPaying={
                    isSinglePaying && activeEmployeeId === emp.employeeId
                  }
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-stroke bg-white p-5 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/10">
                <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">
                  Confirm payment for {employees.length} employee
                  {employees.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  Total net payable:{" "}
                  <strong>
                    {formatCurrency(
                      employees.reduce((sum, emp) => sum + emp.netSalary, 0),
                    )}
                  </strong>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="rounded-xl border border-stroke px-4 py-2.5 text-sm font-semibold text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {isPending ? "Processing..." : "Transfer All"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
