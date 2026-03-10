import AppShell from "@/components/layout/AppShell";

export default function MySalaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
