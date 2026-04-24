import type { CSSProperties } from "react";

/**
 * TicketBadge — availability indicator pill.
 *
 * Colour logic driven by `count`:
 *   • 0        → grey   "0 tickets left"
 *   • 1–3      → amber  "Only X left"
 *   • 4–10     → green  "X tickets left"
 *   • 10+ (>10) → blue  "Available"
 *
 * Renders nothing when `count` is not a finite non-negative number.
 */
interface TicketBadgeProps {
  count: number | null | undefined;
  className?: string;
  "data-testid"?: string;
}

type BadgeTheme = {
  background: string;
  color: string;
  border: string;
  label: string;
};

const getBadgeTheme = (count: number): BadgeTheme => {
  if (count <= 0) {
    return {
      background: "rgba(100,116,139,0.12)",
      color: "#64748B",
      border: "1px solid rgba(100,116,139,0.20)",
      label: "0 tickets left",
    };
  }
  if (count <= 3) {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#D97706",
      border: "1px solid rgba(245,158,11,0.20)",
      label: `Only ${count} left`,
    };
  }
  if (count <= 10) {
    return {
      background: "rgba(16,185,129,0.12)",
      color: "#059669",
      border: "1px solid rgba(16,185,129,0.20)",
      label: `${count} tickets left`,
    };
  }
  return {
    background: "rgba(37,99,235,0.10)",
    color: "#2563EB",
    border: "1px solid rgba(37,99,235,0.18)",
    label: "Available",
  };
};

export function TicketBadge({ count, className, ...rest }: TicketBadgeProps) {
  if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
    return null;
  }

  const theme = getBadgeTheme(count);

  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: "50px",
    background: theme.background,
    color: theme.color,
    border: theme.border,
    lineHeight: 1,
  };

  return (
    <span
      className={className}
      style={style}
      data-testid={rest["data-testid"] ?? "ticket-availability-badge"}
    >
      {theme.label}
    </span>
  );
}

export default TicketBadge;
