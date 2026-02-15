import { cn } from "@/lib/utils";

export function ConfidenceBar({ value, className }: { value: number; className?: string }) {
  const color = value >= 90 ? "bg-severity-critical" : value >= 70 ? "bg-severity-high" : value >= 50 ? "bg-severity-medium" : "bg-severity-low";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground">{value}%</span>
    </div>
  );
}
