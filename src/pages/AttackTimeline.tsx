import { useState } from "react";
import { incidents } from "@/data/mockData";
import { SeverityBadge } from "@/components/SeverityBadge";
import { cn } from "@/lib/utils";
import { Clock, ChevronDown, ChevronRight } from "lucide-react";

export default function AttackTimeline() {
  const [expanded, setExpanded] = useState<string | null>(incidents[0].id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Attack Timeline</h2>
        <p className="text-sm text-muted-foreground">Visualize attack progression across incidents</p>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => {
          const isOpen = expanded === incident.id;
          return (
            <div key={incident.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : incident.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                  <span className="text-sm font-medium">{incident.user}</span>
                  <SeverityBadge severity={incident.severity} />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{incident.detectedAt}</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-slide-in">
                  {/* Attack flow */}
                  <div className="flex items-center gap-1 flex-wrap mb-4 px-8">
                    {incident.attackChain.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <div className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-medium border",
                          idx === incident.attackChain.length - 1
                            ? "bg-severity-critical/15 text-severity-critical border-severity-critical/30"
                            : "bg-secondary text-secondary-foreground border-border"
                        )}>
                          {step}
                        </div>
                        {idx < incident.attackChain.length - 1 && (
                          <span className="text-muted-foreground text-xs mx-1">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Events */}
                  <div className="relative pl-8 space-y-3">
                    <div className="absolute left-3 top-1 bottom-1 w-px bg-border" />
                    {incident.events.map((event, idx) => {
                      const isHigh = event.anomalyScore >= 80;
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          <div className={cn(
                            "absolute -left-5 top-1.5 w-2 h-2 rounded-full",
                            isHigh ? "bg-severity-critical" : "bg-muted-foreground"
                          )} />
                          <div className="flex-1 flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-mono text-muted-foreground">{event.time}</span>
                                <span className="text-sm font-medium">{event.action}</span>
                              </div>
                              <p className="text-xs text-muted-foreground ml-5 mt-0.5">{event.detail}</p>
                            </div>
                            <span className={cn(
                              "text-xs font-mono px-1.5 py-0.5 rounded shrink-0",
                              isHigh ? "bg-severity-critical/15 text-severity-critical" : "bg-muted text-muted-foreground"
                            )}>
                              Score: {event.anomalyScore}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
