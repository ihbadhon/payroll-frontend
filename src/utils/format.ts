import dayjs from "dayjs";

/**
 * Parse a Decimal.js serialized object { s, e, d } or plain number/string to a JS number.
 * The API serializes Prisma Decimal fields this way.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseDecimal(val: any): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val) || 0;
  if (val && typeof val === "object" && Array.isArray(val.d)) {
    const sign = val.s ?? 1;
    return (val.d[0] ?? 0) * sign;
  }
  return 0;
}

/**
 * Format a number or string as currency (BDT / USD etc.)
 */
export function formatCurrency(
  value: number | string,
  currency = "BDT",
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a plain number with thousand separators
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-BD").format(num);
}

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number, short = false): string {
  const date = new Date(2000, month - 1, 1);
  return date.toLocaleString("en-US", { month: short ? "short" : "long" });
}

/**
 * Format a date string to human-readable
 */
export function formatDate(date: string, template = "DD MMM YYYY"): string {
  if (!date) return "—";
  return dayjs(date).format(template);
}

/**
 * Format relative time
 */
export function fromNow(date: string): string {
  if (!date) return "—";
  const diff = dayjs().diff(dayjs(date), "day");
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return dayjs(date).format("DD MMM YYYY");
}
