import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { incidents, Severity } from "@/data/mockData";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusTag } from "@/components/StatusTag";
import { ConfidenceBar } from "@/components/ConfidenceBar";

const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

export default function Incidents() {
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [sortBy, setSortBy] = useState<"severity" | "confidence" | "time">("severity");

  const filtered = useMemo(() => {
    let list = [...incidents];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.id.toLowerCase().includes(q) || i.user.toLowerCase().includes(q) || i.type.toLowerCase().includes(q));
    }
    if (filterSeverity !== "all") list = list.filter(i => i.severity === filterSeverity);
    list.sort((a, b) => {
      if (sortBy === "severity") return severityOrder[a.severity] - severityOrder[b.severity];
      if (sortBy === "confidence") return b.confidence - a.confidence;
      return b.detectedAt.localeCompare(a.detectedAt);
    });
    return list;
  }, [search, filterSeverity, sortBy]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Incidents</h2>
        <p className="text-sm text-muted-foreground">Monitor and investigate security incidents</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-56 rounded-md bg-secondary border border-border pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          {(["all", "critical", "high", "medium", "low"] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${filterSeverity === sev ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="h-8 rounded-md bg-secondary border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="severity">Sort: Severity</option>
          <option value="confidence">Sort: Confidence</option>
          <option value="time">Sort: Time</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">User / Entity</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Detected</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((inc) => (
              <tr key={inc.id} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <Link to={`/incidents/${inc.id}`} className="text-xs font-mono text-primary hover:underline">{inc.id}</Link>
                </td>
                <td className="px-4 py-3 text-sm">{inc.user}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{inc.type}</td>
                <td className="px-4 py-3"><SeverityBadge severity={inc.severity} /></td>
                <td className="px-4 py-3"><ConfidenceBar value={inc.confidence} /></td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{inc.detectedAt}</td>
                <td className="px-4 py-3"><StatusTag status={inc.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No incidents found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}
