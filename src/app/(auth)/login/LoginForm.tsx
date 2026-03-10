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

// ─── Schema ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Inner Form ───────────────────────────────────────────────────────────────
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
      setAccessToken(result.accessToken);
      setUser(result.user);
      toast.success(`Welcome back, ${result.user.name}!`);
      router.replace(callbackUrl);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* Card */}
      <div className="rounded-2xl border border-stroke bg-white px-8 py-10 shadow-sm dark:border-dark-3 dark:bg-dark-2">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
            <svg viewBox="0 0 20 20" fill="none" className="h-7 w-7">
              <rect
                x="3"
                y="3"
                width="6"
                height="6"
                rx="1.5"
                fill="white"
                fillOpacity="0.9"
              />
              <rect
                x="11"
                y="3"
                width="6"
                height="6"
                rx="1.5"
                fill="white"
                fillOpacity="0.5"
              />
              <rect
                x="3"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                fill="white"
                fillOpacity="0.5"
              />
              <rect
                x="11"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            PayrollHQ
          </h1>
          <p className="mt-1.5 text-sm text-dark-5 dark:text-dark-6">
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
        <div className="mt-5 text-center">
          <a
            href="/forgot-password"
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            Forgot your password?
          </a>
        </div>

        {/* Footer note */}
        <p className="mt-6 border-t border-stroke pt-5 text-center text-xs text-dark-5 dark:border-dark-3 dark:text-dark-6">
          Don&apos;t have an account?{" "}
          <span className="font-medium text-dark dark:text-white">
            Contact your administrator.
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
