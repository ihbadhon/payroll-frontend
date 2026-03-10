import AppShell from "@/components/layout/AppShell";

export default function MyBonusesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
