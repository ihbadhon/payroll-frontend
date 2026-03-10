"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { forgotPassword } from "@/services/auth/auth.service";
import { getErrorMessage } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            If{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {submittedEmail}
            </span>{" "}
            is registered, you&apos;ll receive a password reset link shortly.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-md dark:bg-indigo-500">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Forgot Password?
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
