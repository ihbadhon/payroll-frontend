import AppShell from "@/components/layout/AppShell";

export default function MyPayslipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
