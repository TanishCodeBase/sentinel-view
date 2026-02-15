import { useState } from "react";
import { ShieldCheck, Search as SearchIcon, AlertTriangle, Eye, RotateCcw, CheckCircle2 } from "lucide-react";
import { playbooks } from "@/data/mockData";
import { cn } from "@/lib/utils";

const sectionIcons = {
  containment: AlertTriangle,
  investigation: SearchIcon,
  recovery: RotateCcw,
  monitoring: Eye,
};

const sectionLabels: Record<string, string> = {
  containment: "Immediate Containment",
  investigation: "Investigation Actions",
  recovery: "Recovery Steps",
  monitoring: "Monitoring Recommendations",
};

const sectionColors: Record<string, string> = {
  containment: "text-severity-critical",
  investigation: "text-severity-high",
  recovery: "text-primary",
  monitoring: "text-severity-low",
};

export default function Playbooks() {
  const playbook = playbooks[0];
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleStep = (key: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Response Playbooks</h2>
        <p className="text-sm text-muted-foreground">Guided incident response procedures</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">{playbook.title}</h3>
            <p className="text-xs text-muted-foreground">{playbook.id}</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(playbook.steps).map(([section, steps]) => {
            const Icon = sectionIcons[section as keyof typeof sectionIcons];
            return (
              <div key={section}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn("h-4 w-4", sectionColors[section])} />
                  <h4 className="text-sm font-semibold">{sectionLabels[section]}</h4>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {steps.filter((_, i) => completed.has(`${section}-${i}`)).length}/{steps.length}
                  </span>
                </div>
                <div className="space-y-1.5 pl-6">
                  {steps.map((step, idx) => {
                    const key = `${section}-${idx}`;
                    const done = completed.has(key);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleStep(key)}
                        className={cn(
                          "flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          done ? "bg-severity-low/10 text-muted-foreground line-through" : "hover:bg-secondary"
                        )}
                      >
                        <CheckCircle2 className={cn("h-4 w-4 shrink-0", done ? "text-severity-low" : "text-border")} />
                        {step}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
