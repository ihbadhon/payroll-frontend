import { useMutation } from "@tanstack/react-query";
import { verifyEmailToken, setPassword } from "@/services/auth/auth.service";
import { SetPasswordPayload } from "@/types/auth";

export function useVerifyEmailToken() {
  return useMutation({
    mutationFn: (token: string) => verifyEmailToken(token),
  });
}

export function useSetPassword() {
  return useMutation({
    mutationFn: (payload: SetPasswordPayload) => setPassword(payload),
  });
}
