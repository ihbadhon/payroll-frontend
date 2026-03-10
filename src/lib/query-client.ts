import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — data stays fresh
      gcTime: 1000 * 60 * 10, // 10 minutes — cache garbage collection
      retry: 1, // retry once on failure
      refetchOnWindowFocus: false, // don't refetch when tab regains focus
    },
    mutations: {
      retry: 0, // no retries on mutations
    },
  },
});
