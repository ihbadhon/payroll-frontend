import {
  LayoutDashboard,
  Users,
  UserCheck,
  DollarSign,
  FileText,
  Gift,
  CreditCard,
  ClipboardList,
  Settings,
  Building2,
  ShieldCheck,
  Wallet,
  Receipt,
  HandCoins,
  BadgeDollarSign,
  ArrowRightLeft,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  // Which roles can see this item. Empty array = everyone
  roles: string[];
  // Optional badge (e.g. count)
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: [],
      },
    ],
  },
  {
    title: "HR Management",
    items: [
      {
        label: "Employees",
        href: "/employees",
        icon: Users,
        roles: ["Super Admin", "HR", "Finance"],
      },
      {
        label: "Departments",
        href: "/departments",
        icon: Building2,
        roles: ["Super Admin"],
      },
      // {
      //   label: "Users",
      //   href: "/users",
      //   icon: UserCheck,
      //   roles: ["Super Admin"],
      // },
      // {
      //   label: "Roles",
      //   href: "/roles",
      //   icon: ShieldCheck,
      //   roles: ["Super Admin"],
      // },
    ],
  },
  {
    title: "Payroll",
    items: [
      // {
      //   label: "Salary Rules",
      //   href: "/salary-rules",
      //   icon: DollarSign,
      //   roles: [],
      // },
      {
        label: "Salary Structure",
        href: "/salary-structure",
        icon: FileText,
        roles: ["Super Admin", "HR", "Finance"],
      },
      {
        label: "Payroll Processing",
        href: "/payroll",
        icon: ClipboardList,
        roles: ["Super Admin", "HR", "Finance"],
      },
      {
        label: "Transactions",
        href: "/transactions",
        icon: ArrowRightLeft,
        roles: ["Super Admin", "HR", "Finance"],
      },
    ],
  },
  {
    title: "Benefits",
    items: [
      {
        label: "Bonuses",
        href: "/bonus",
        icon: Gift,
        roles: ["Super Admin", "HR", "Finance"],
      },
      {
        label: "Loans",
        href: "/loans",
        icon: CreditCard,
        roles: ["Super Admin", "HR", "Finance"],
      },
    ],
  },
  {
    title: "My Portal",
    items: [
      {
        label: "My Salary",
        href: "/my-salary",
        icon: Wallet,
        roles: ["Employee"],
      },
      {
        label: "My Loans",
        href: "/my-loans",
        icon: HandCoins,
        roles: ["Employee"],
      },
      {
        label: "My Bonuses",
        href: "/my-bonuses",
        icon: BadgeDollarSign,
        roles: ["Employee"],
      },
      {
        label: "My Payslips",
        href: "/my-payslips",
        icon: Receipt,
        roles: ["Employee"],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Audit Logs",
        href: "/audit-log",
        icon: ClipboardList,
        roles: ["Super Admin"],
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        roles: [],
      },
    ],
  },
];

// Helper: filter nav groups by role
export function getNavForRole(roleName: string): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => item.roles.length === 0 || item.roles.includes(roleName),
    ),
  })).filter((group) => group.items.length > 0);
}
