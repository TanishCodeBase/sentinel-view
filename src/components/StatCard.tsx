import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "critical" | "warning" | "success";
}

const variantStyles = {
  default: "border-border",
  critical: "border-severity-critical/30 glow-critical",
  warning: "border-severity-high/30",
  success: "border-severity-low/30",
};

const iconVariant = {
  default: "text-primary",
  critical: "text-severity-critical",
  warning: "text-severity-high",
  success: "text-severity-low",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-lg border p-4 animate-slide-in", variantStyles[variant])}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</span>
        <Icon className={cn("h-4 w-4", iconVariant[variant])} />
      </div>
      <div className="text-2xl font-bold font-mono">{value}</div>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </div>
  );
}
