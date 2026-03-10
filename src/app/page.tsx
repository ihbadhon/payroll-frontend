import { redirect } from "next/navigation";

// Root page redirects to dashboard
// Auth middleware will handle unauthenticated users
export default function RootPage() {
  redirect("/dashboard");
}
