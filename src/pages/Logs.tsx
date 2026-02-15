import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { logEntries } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Logs() {
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);

  const filtered = useMemo(() => {
    let list = logEntries;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.ip.includes(q));
    }
    if (minScore > 0) list = list.filter(l => l.anomalyScore >= minScore);
    return list;
  }, [search, minScore]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">System Logs</h2>
        <p className="text-sm text-muted-foreground">Raw security event log viewer</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by user, action, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-64 rounded-md bg-secondary border border-border pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Min Score:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-24 accent-primary"
          />
          <span className="text-xs font-mono text-muted-foreground w-8">{minScore}</span>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">IP Address</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Anomaly Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-xs">
            {filtered.map((log, idx) => {
              const isHigh = log.anomalyScore >= 80;
              return (
                <tr key={idx} className={cn("transition-colors", isHigh ? "hover:bg-severity-critical/5" : "hover:bg-secondary/50")}>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.timestamp}</td>
                  <td className="px-4 py-2.5">{log.user}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.action}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{log.ip}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", isHigh ? "bg-severity-critical" : log.anomalyScore >= 50 ? "bg-severity-medium" : "bg-severity-low")}
                          style={{ width: `${log.anomalyScore}%` }}
                        />
                      </div>
                      <span className={cn(isHigh ? "text-severity-critical" : "text-muted-foreground")}>{log.anomalyScore}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No log entries match your filters.</div>
        )}
      </div>
    </div>
  );
}
