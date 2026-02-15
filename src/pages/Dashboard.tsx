import { AlertTriangle, ShieldAlert, Activity, Zap, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { StatCard } from "@/components/StatCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusTag } from "@/components/StatusTag";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { incidents } from "@/data/mockData";
import { Link } from "react-router-dom";

const severityData = [
  { name: "Critical", count: 2, fill: "hsl(0, 85%, 55%)" },
  { name: "High", count: 2, fill: "hsl(25, 90%, 55%)" },
  { name: "Medium", count: 1, fill: "hsl(45, 90%, 55%)" },
  { name: "Low", count: 1, fill: "hsl(145, 70%, 45%)" },
];

const activityData = [
  { hour: "00:00", alerts: 3 },
  { hour: "02:00", alerts: 1 },
  { hour: "04:00", alerts: 2 },
  { hour: "06:00", alerts: 5 },
  { hour: "08:00", alerts: 14 },
  { hour: "10:00", alerts: 8 },
  { hour: "12:00", alerts: 12 },
  { hour: "14:00", alerts: 6 },
  { hour: "16:00", alerts: 9 },
  { hour: "18:00", alerts: 4 },
  { hour: "20:00", alerts: 3 },
  { hour: "22:00", alerts: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-mono font-semibold text-foreground">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const criticalCount = incidents.filter(i => i.severity === "critical").length;
  const avgConfidence = Math.round(incidents.reduce((a, b) => a + b.confidence, 0) / incidents.length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Real-time security monitoring and incident summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={incidents.length} icon={AlertTriangle} trend="+3 from yesterday" />
        <StatCard title="Critical" value={criticalCount} icon={ShieldAlert} variant="critical" trend="Requires immediate action" />
        <StatCard title="Avg Confidence" value={`${avgConfidence}%`} icon={Activity} variant="warning" />
        <StatCard title="Alerts Processed" value="1,247" icon={Zap} trend="Last 24 hours" variant="success" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Incidents by Severity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Alert Activity (24h)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(192, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(192, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="alerts" stroke="hsl(192, 80%, 50%)" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Recent Incidents</h3>
          <Link to="/incidents" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-border">
          {incidents.slice(0, 5).map((incident) => (
            <Link
              key={incident.id}
              to={`/incidents/${incident.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground w-28">{incident.id}</span>
                <span className="text-sm">{incident.user}</span>
                <SeverityBadge severity={incident.severity} />
              </div>
              <div className="flex items-center gap-4">
                <ConfidenceBar value={incident.confidence} />
                <StatusTag status={incident.status} />
                <span className="text-xs text-muted-foreground font-mono w-32 text-right">{incident.detectedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
