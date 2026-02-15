import { cn } from "@/lib/utils";
import type { Severity } from "@/data/mockData";

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: { label: "CRITICAL", className: "bg-severity-critical/20 text-severity-critical border-severity-critical/30" },
  high: { label: "HIGH", className: "bg-severity-high/20 text-severity-high border-severity-high/30" },
  medium: { label: "MEDIUM", className: "bg-severity-medium/20 text-severity-medium border-severity-medium/30" },
  low: { label: "LOW", className: "bg-severity-low/20 text-severity-low border-severity-low/30" },
  info: { label: "INFO", className: "bg-severity-info/20 text-severity-info border-severity-info/30" },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = severityConfig[severity];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border", config.className, className)}>
      {config.label}
    </span>
  );
}
