// StatusBadge — returns an HTML string for a status pill.
// Usage: statusBadge("Available", { dot: true, size: "sm" })

const COLOR_MAP = {
  Available: "sb-available",
  "Low Stock": "sb-low-stock",
  Unavailable: "sb-unavailable",
  "Under Maintenance": "sb-maintenance",
  Limited: "sb-limited",
  Pending: "sb-pending",
  Approved: "sb-approved",
  Completed: "sb-completed",
  Cancelled: "sb-cancelled",
  Active: "sb-active",
  Inactive: "sb-inactive",
  Emergency: "sb-emergency",
  Reviewed: "sb-reviewed",
  Resolved: "sb-resolved",
};

export function statusBadge(status, { dot = false, size = "sm" } = {}) {
  const colorClass = COLOR_MAP[status] ?? "sb-default";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  const dotHtml = dot ? `<span class="status-badge-dot"></span>` : "";
  return `<span class="status-badge inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClass} ${colorClass}">${dotHtml}${status}</span>`;
}
