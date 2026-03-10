"use client";

import { useState } from "react";
import { useRequestLoan } from "@/hooks/useLoans";
import { RequestLoanPayload } from "@/services/loans/loans.service";
import toast from "react-hot-toast";
import { X, Loader2, AlertCircle } from "lucide-react";

interface LoanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoanRequestModal({
  isOpen,
  onClose,
}: LoanRequestModalProps) {
  const [formData, setFormData] = useState({
    loanAmount: "",
    totalInstallments: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: requestLoanMutation, isPending } = useRequestLoan();

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const loanAmount = parseFloat(formData.loanAmount);
    if (!formData.loanAmount) {
      newErrors.loanAmount = "Loan amount is required";
    } else if (isNaN(loanAmount) || loanAmount <= 0) {
      newErrors.loanAmount = "Loan amount must be a positive number";
    } else if (loanAmount < 10000) {
      newErrors.loanAmount = "Minimum loan amount is 10,000";
    }

    const totalInstallments = parseInt(formData.totalInstallments);
    if (!formData.totalInstallments) {
      newErrors.totalInstallments = "Number of installments is required";
    } else if (isNaN(totalInstallments) || totalInstallments <= 0) {
      newErrors.totalInstallments = "Must be a positive number";
    } else if (totalInstallments > 60) {
      newErrors.totalInstallments = "Maximum 60 installments allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: RequestLoanPayload = {
      loanAmount: parseFloat(formData.loanAmount),
      totalInstallments: parseInt(formData.totalInstallments),
      reason: formData.reason || undefined,
    };

    requestLoanMutation(payload, {
      onSuccess: () => {
        toast.success("Loan request submitted successfully!");
        setFormData({ loanAmount: "", totalInstallments: "", reason: "" });
        onClose();
      },
      onError: (error) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to submit loan request";
        toast.error(errorMessage);
      },
    });
  };

  const monthlyEMI =
    formData.loanAmount && formData.totalInstallments
      ? Math.round(
          parseFloat(formData.loanAmount) /
            parseInt(formData.totalInstallments),
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white  dark:bg-dark-2">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Request a Loan
            </h2>
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Fill in the details below to submit your loan request
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {/* Loan Amount */}
          <div>
            <label
              htmlFor="loanAmount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Loan Amount (BDT)
            </label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              placeholder="50000"
              min="10000"
              step="1000"
              disabled={isPending}
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary"
            />
            {errors.loanAmount && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.loanAmount}
              </p>
            )}
          </div>

          {/* Total Installments */}
          <div>
            <label
              htmlFor="totalInstallments"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Number of Installments
            </label>
            <input
              type="number"
              id="totalInstallments"
              name="totalInstallments"
              value={formData.totalInstallments}
              onChange={handleInputChange}
              placeholder="10"
              min="1"
              max="60"
              disabled={isPending}
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary"
            />
            {errors.totalInstallments && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.totalInstallments}
              </p>
            )}
          </div>

          {/* Monthly EMI Preview */}
          {monthlyEMI > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-500/10">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Estimated Monthly EMI:{" "}
                <span className="font-semibold">
                  BDT {monthlyEMI.toLocaleString()}
                </span>
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Brief description of loan purpose..."
              rows={3}
              disabled={isPending}
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-3 dark:bg-dark-3 dark:text-gray-300 dark:hover:bg-dark-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
