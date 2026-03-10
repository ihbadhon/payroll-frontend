import { logout } from "@/services/auth/auth.service";
import { useAuth } from "@/store/auth.context";
import { queryClient } from "@/lib/query-client";
import { getErrorMessage } from "@/utils/error-handler";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function useLogout() {
  const { clearAuth } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Even if API fails, still clear local state
    } finally {
      clearAuth();
      queryClient.clear(); // Clear all cached queries
      setIsLoggingOut(false);
      toast.success("Logged out successfully");
      router.replace("/login");
    }
  }, [clearAuth, router]);

  return { handleLogout, isLoggingOut };
}
