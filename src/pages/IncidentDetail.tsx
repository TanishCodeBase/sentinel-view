import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Clock, Brain, Link2 } from "lucide-react";
import { incidents } from "@/data/mockData";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusTag } from "@/components/StatusTag";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { cn } from "@/lib/utils";

export default function IncidentDetail() {
  const { id } = useParams();
  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Incident not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/incidents" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Incidents
      </Link>

      {/* Summary */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold">{incident.id}</h2>
              <SeverityBadge severity={incident.severity} />
              <StatusTag status={incident.status} />
            </div>
            <p className="text-sm text-muted-foreground">{incident.type} — {incident.user}</p>
          </div>
          <ConfidenceBar value={incident.confidence} />
        </div>
        <p className="text-sm leading-relaxed">{incident.description}</p>
      </div>

      {/* Why Flagged */}
      <div className="bg-card rounded-lg border border-severity-high/20 p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-severity-high" />
          Why This Was Flagged
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{incident.reason}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Event Timeline */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Event Timeline
          </h3>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
            {incident.events.map((event, idx) => {
              const isHigh = event.anomalyScore >= 80;
              return (
                <div key={idx} className="relative">
                  <div className={cn(
                    "absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2",
                    isHigh ? "bg-severity-critical border-severity-critical" : "bg-muted border-border"
                  )} />
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{event.time}</span>
                      <p className="text-sm font-medium mt-0.5">{event.action}</p>
                      <p className="text-xs text-muted-foreground">{event.detail}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-mono px-1.5 py-0.5 rounded",
                      isHigh ? "bg-severity-critical/15 text-severity-critical" : "bg-muted text-muted-foreground"
                    )}>
                      {event.anomalyScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attack Chain */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            Attack Chain
          </h3>
          <div className="space-y-2">
            {incident.attackChain.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0",
                  idx === incident.attackChain.length - 1
                    ? "bg-severity-critical/20 text-severity-critical border border-severity-critical/30"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm">{step}</div>
                {idx < incident.attackChain.length - 1 && (
                  <div className="text-muted-foreground text-xs">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
