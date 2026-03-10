// ─── Canonical Role Names (must match backend role.name exactly) ───────────────
export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  HR: "HR",
  FINANCE: "Finance",
  EMPLOYEE: "Employee",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Route → Allowed Roles ─────────────────────────────────────────────────────
// Key = route prefix. Empty array = any authenticated user.
// Order matters: more specific routes first.
export const ROUTE_PERMISSIONS: { prefix: string; roles: Role[] }[] = [
  // Super Admin only
  { prefix: "/users", roles: [] },
  { prefix: "/roles", roles: [ROLES.SUPER_ADMIN] },
  { prefix: "/audit-log", roles: [ROLES.SUPER_ADMIN] },

  // HR + Super Admin
  { prefix: "/employees", roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.FINANCE] },
  {
    prefix: "/departments",
    roles: [ROLES.SUPER_ADMIN],
  },
  { prefix: "/salary-rules", roles: [ROLES.SUPER_ADMIN, ROLES.HR] },
  {
    prefix: "/salary-structure",
    roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.FINANCE],
  },

  // Finance + HR + Super Admin
  { prefix: "/payroll", roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.FINANCE] },
  { prefix: "/bonus", roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.FINANCE] },
  { prefix: "/loans", roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.FINANCE] },

  // All authenticated users (explicitly listed for clarity)
  { prefix: "/dashboard", roles: [] },
  { prefix: "/settings", roles: [] },

  // Employee self-service
  { prefix: "/my-salary", roles: [ROLES.EMPLOYEE] },
  { prefix: "/my-loans", roles: [ROLES.EMPLOYEE] },
  { prefix: "/my-bonuses", roles: [ROLES.EMPLOYEE] },
  { prefix: "/my-payslips", roles: [ROLES.EMPLOYEE] },
];

/**
 * Returns the allowed roles for a given pathname.
 * Returns null  → no restriction (open to all authenticated users).
 * Returns Role[] → user role must be in the list.
 */
export function getAllowedRoles(pathname: string): Role[] | null {
  const match = ROUTE_PERMISSIONS.find((r) => pathname.startsWith(r.prefix));
  if (!match) return null; // unknown route — let middleware pass it through
  if (match.roles.length === 0) return null; // open to all
  return match.roles;
}

/** Returns true if the given role is allowed on the pathname. */
export function isRoleAllowed(pathname: string, role: string): boolean {
  const allowed = getAllowedRoles(pathname);
  if (allowed === null) return true;
  return allowed.includes(role as Role);
}
