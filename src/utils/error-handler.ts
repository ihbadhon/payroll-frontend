import { AxiosError } from "axios";
import { ApiError } from "@/types/api";

/**
 * Extract a readable error message from Axios errors.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return "An unexpected error occurred. Please try again.";
}

/**
 * Extract field-level validation errors from a 422 response.
 */
export function getFieldErrors(error: unknown): Record<string, string> | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.errors) {
      return Object.fromEntries(
        Object.entries(data.errors).map(([key, messages]) => [
          key,
          messages[0],
        ]),
      );
    }
  }
  return null;
}
