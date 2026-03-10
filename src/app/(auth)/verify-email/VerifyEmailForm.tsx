"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { verifyEmailToken, setPassword } from "@/services/auth/auth.service";
import { getErrorMessage } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function VerifyEmailFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  // "checking" → calling GET /verify-email  |  "valid" → show form  |  "invalid" → show error
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">(
    "checking",
  );
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Step 1: frontend calls GET /auth/verify-email?token=xxx and decides which UI to show
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyEmailToken(token)
      .then((res) => setStatus(res.valid ? "valid" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  // Step 2: user submits password → POST /auth/set-password → redirect to /login
  const onSubmit = async (data: FormData) => {
    try {
      await setPassword({ token, password: data.password });
      setDone(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ── Checking ───────────────────────────────────────────────────────────────
  if (status === "checking") {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg dark:border-dark-3 dark:bg-dark-2">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verifying link…
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ── Invalid ────────────────────────────────────────────────────────────────
  if (status === "invalid") {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-lg dark:border-red-900 dark:bg-dark-2">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold text-red-600">
            Link expired or invalid
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Request a new invite from your administrator.
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => router.replace("/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg dark:border-dark-3 dark:bg-dark-2">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Account activated!
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  // ── Set Password form (status === "valid") ─────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-dark-3 dark:bg-dark-2">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Set Your Password
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a secure password to activate your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Activating…" : "Set Password & Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailForm() {
  return (
    <Suspense>
      <VerifyEmailFormInner />
    </Suspense>
  );
}
