import { cn } from "@/lib/utils";
import type { IncidentStatus } from "@/data/mockData";

const statusConfig: Record<IncidentStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-severity-critical/10 text-severity-critical" },
  investigating: { label: "Investigating", className: "bg-severity-high/10 text-severity-high" },
  resolved: { label: "Resolved", className: "bg-severity-low/10 text-severity-low" },
};

export function StatusTag({ status }: { status: IncidentStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium", config.className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", status === "active" ? "bg-severity-critical animate-pulse-glow" : status === "investigating" ? "bg-severity-high" : "bg-severity-low")} />
      {config.label}
    </span>
  );
}
