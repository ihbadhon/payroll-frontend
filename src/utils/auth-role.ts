type UserLike = {
  role?: unknown;
} | null;

export function getRoleName(role: unknown): string {
  if (typeof role === "string") {
    return role;
  }

  if (role && typeof role === "object" && "name" in role) {
    const name = (role as { name?: unknown }).name;
    if (typeof name === "string") {
      return name;
    }
  }

  return "";
}

export function getUserRoleName(user: UserLike): string {
  return getRoleName(user?.role);
}
