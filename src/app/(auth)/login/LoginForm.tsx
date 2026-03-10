"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { login } from "@/services/auth/auth.service";
import { useAuth } from "@/store/auth.context";
import { LoginPayload } from "@/types/auth";
import { getErrorMessage } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// ─── Schema ─────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Inner Form (uses useSearchParams — must be wrapped in Suspense) ──────────
function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setAccessToken } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      const result = await login(data);

      // Store access token
      setAccessToken(result.accessToken);

      // Store user
      setUser(result.user);

      toast.success(`Welcome back, ${result.user.name}!`);

      router.replace(callbackUrl);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl
                   transition-all duration-300 hover:shadow-2xl
                   dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center
                       rounded-xl bg-indigo-600 shadow-md
                       dark:bg-indigo-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-white"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome to PayrollHQ
          </h1>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
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

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {/* Forgot password */}
        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Forgot password?
          </a>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Don&apos;t have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

// ─── Page Wrapper (Centered Layout) ─────────────────────
export default function LoginForm() {
  return (
    <Suspense>
      <div
        className="flex min-h-screen items-center justify-center
                   bg-gray-50 px-4
                   dark:bg-gray-950"
      >
        <LoginFormInner />
      </div>
    </Suspense>
  );
}
