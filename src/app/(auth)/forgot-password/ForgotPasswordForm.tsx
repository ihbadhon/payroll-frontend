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

  if (submitted) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-stroke bg-white px-8 py-10 text-center shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
            <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-bold text-dark dark:text-white">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            If{" "}
            <span className="font-medium text-dark dark:text-white">
              {submittedEmail}
            </span>{" "}
            is registered, you&apos;ll receive a reset link shortly.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-primary transition hover:text-primary/80"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-2xl border border-stroke bg-white px-8 py-10 shadow-sm dark:border-dark-3 dark:bg-dark-2">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
            <Mail className="h-5.5 w-5.5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Forgot Password?
          </h1>
          <p className="mt-1.5 text-sm text-dark-5 dark:text-dark-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

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
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
