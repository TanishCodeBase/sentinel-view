export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type IncidentStatus = "active" | "resolved" | "investigating";

export interface Incident {
  id: string;
  user: string;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  status: IncidentStatus;
  type: string;
  description: string;
  reason: string;
  events: TimelineEvent[];
  attackChain: string[];
}

export interface TimelineEvent {
  time: string;
  action: string;
  detail: string;
  anomalyScore: number;
}

export interface LogEntry {
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  anomalyScore: number;
}

export const incidents: Incident[] = [
  {
    id: "INC-2024-001",
    user: "jsmith@bank.com",
    severity: "critical",
    confidence: 96,
    detectedAt: "2024-12-15 08:23:41",
    status: "active",
    type: "Credential Compromise",
    description: "Multiple failed login attempts followed by successful auth from unknown IP, then immediate privilege escalation and sensitive data access.",
    reason: "Abnormal login pattern detected: 14 failed attempts from IP 185.243.xx.xx (TOR exit node), followed by successful login. User immediately escalated privileges to admin and accessed financial records — behavior never observed for this account.",
    events: [
      { time: "08:12:03", action: "Failed Login", detail: "14 failed attempts from 185.243.xx.xx", anomalyScore: 72 },
      { time: "08:23:41", action: "Successful Login", detail: "Auth from new IP 185.243.xx.xx (TOR)", anomalyScore: 89 },
      { time: "08:24:15", action: "Privilege Escalation", detail: "Role changed to admin", anomalyScore: 95 },
      { time: "08:25:02", action: "Data Access", detail: "Accessed financial_records_q4.xlsx", anomalyScore: 97 },
      { time: "08:26:30", action: "Data Exfiltration", detail: "Downloaded 2.3GB from /reports", anomalyScore: 99 },
    ],
    attackChain: ["Brute Force", "Authentication", "Privilege Escalation", "Data Access", "Exfiltration"],
  },
  {
    id: "INC-2024-002",
    user: "admin@bank.com",
    severity: "high",
    confidence: 88,
    detectedAt: "2024-12-15 09:45:12",
    status: "investigating",
    type: "Lateral Movement",
    description: "Admin account accessing multiple servers in rapid succession with unusual RDP patterns.",
    reason: "Account accessed 12 servers in 8 minutes via RDP — historical baseline is 2 servers/hour. Source IP changed 3 times during session.",
    events: [
      { time: "09:45:12", action: "RDP Session", detail: "Connected to SRV-DB-01", anomalyScore: 65 },
      { time: "09:46:01", action: "RDP Session", detail: "Connected to SRV-APP-03", anomalyScore: 72 },
      { time: "09:47:23", action: "File Transfer", detail: "Transferred tools.zip to SRV-DB-01", anomalyScore: 85 },
      { time: "09:49:50", action: "Registry Edit", detail: "Modified startup registry on SRV-APP-03", anomalyScore: 91 },
    ],
    attackChain: ["Initial Access", "Lateral Movement", "Tool Deployment", "Persistence"],
  },
  {
    id: "INC-2024-003",
    user: "mwilson@bank.com",
    severity: "medium",
    confidence: 74,
    detectedAt: "2024-12-15 11:02:33",
    status: "active",
    type: "Insider Threat",
    description: "Employee accessing sensitive files outside normal working hours from personal device.",
    reason: "User accessed HR salary database at 3:14 AM from unregistered device. This user has no HR role and has never accessed these files before.",
    events: [
      { time: "03:14:22", action: "Login", detail: "Auth from unregistered device", anomalyScore: 68 },
      { time: "03:15:45", action: "Navigation", detail: "Accessed /hr/salaries endpoint", anomalyScore: 82 },
      { time: "03:17:02", action: "Data Access", detail: "Viewed executive compensation data", anomalyScore: 78 },
    ],
    attackChain: ["Unauthorized Access", "Data Reconnaissance", "Sensitive Data Viewing"],
  },
  {
    id: "INC-2024-004",
    user: "svc-api@bank.com",
    severity: "high",
    confidence: 91,
    detectedAt: "2024-12-15 12:18:05",
    status: "active",
    type: "API Abuse",
    description: "Service account making abnormal volume of API calls to customer PII endpoints.",
    reason: "API call volume increased 4000% in 15 minutes. All calls target /api/customers/pii — normally used for single lookups, now iterating sequentially through all records.",
    events: [
      { time: "12:18:05", action: "API Spike", detail: "4000% increase in API calls", anomalyScore: 88 },
      { time: "12:20:33", action: "Data Enumeration", detail: "Sequential access to /api/customers/pii", anomalyScore: 94 },
      { time: "12:25:01", action: "Rate Limit", detail: "Rate limiter triggered", anomalyScore: 72 },
    ],
    attackChain: ["Compromised Credential", "API Enumeration", "Data Harvesting"],
  },
  {
    id: "INC-2024-005",
    user: "contractor@partner.com",
    severity: "low",
    confidence: 52,
    detectedAt: "2024-12-15 14:30:00",
    status: "resolved",
    type: "Policy Violation",
    description: "Contractor accessed VPN from unexpected geographic location.",
    reason: "VPN connection from São Paulo, Brazil — contractor is registered in New York. Could be legitimate travel.",
    events: [
      { time: "14:30:00", action: "VPN Connect", detail: "Connection from São Paulo, BR", anomalyScore: 45 },
      { time: "14:32:10", action: "Normal Activity", detail: "Standard workflow actions", anomalyScore: 12 },
    ],
    attackChain: ["Geo-anomaly", "VPN Access"],
  },
  {
    id: "INC-2024-006",
    user: "dba@bank.com",
    severity: "critical",
    confidence: 93,
    detectedAt: "2024-12-15 15:45:22",
    status: "active",
    type: "Data Exfiltration",
    description: "Database admin running bulk export queries on production customer database.",
    reason: "SELECT * queries on all customer tables with no WHERE clause. Exported 450K records to external staging server. Activity occurred during change freeze window.",
    events: [
      { time: "15:45:22", action: "Bulk Query", detail: "SELECT * on customers table", anomalyScore: 85 },
      { time: "15:48:11", action: "Data Export", detail: "Exported 450K records", anomalyScore: 96 },
      { time: "15:50:33", action: "External Transfer", detail: "Data sent to 203.0.xx.xx", anomalyScore: 99 },
    ],
    attackChain: ["Database Access", "Bulk Export", "External Transfer"],
  },
];

export const logEntries: LogEntry[] = [
  { timestamp: "2024-12-15 08:12:03", user: "jsmith@bank.com", action: "LOGIN_FAILED", ip: "185.243.xx.xx", anomalyScore: 72 },
  { timestamp: "2024-12-15 08:23:41", user: "jsmith@bank.com", action: "LOGIN_SUCCESS", ip: "185.243.xx.xx", anomalyScore: 89 },
  { timestamp: "2024-12-15 08:24:15", user: "jsmith@bank.com", action: "PRIVILEGE_ESCALATION", ip: "185.243.xx.xx", anomalyScore: 95 },
  { timestamp: "2024-12-15 08:25:02", user: "jsmith@bank.com", action: "FILE_ACCESS", ip: "185.243.xx.xx", anomalyScore: 97 },
  { timestamp: "2024-12-15 08:26:30", user: "jsmith@bank.com", action: "DATA_DOWNLOAD", ip: "185.243.xx.xx", anomalyScore: 99 },
  { timestamp: "2024-12-15 09:45:12", user: "admin@bank.com", action: "RDP_SESSION", ip: "10.0.1.55", anomalyScore: 65 },
  { timestamp: "2024-12-15 09:46:01", user: "admin@bank.com", action: "RDP_SESSION", ip: "10.0.2.12", anomalyScore: 72 },
  { timestamp: "2024-12-15 09:47:23", user: "admin@bank.com", action: "FILE_TRANSFER", ip: "10.0.1.55", anomalyScore: 85 },
  { timestamp: "2024-12-15 09:49:50", user: "admin@bank.com", action: "REGISTRY_EDIT", ip: "10.0.2.12", anomalyScore: 91 },
  { timestamp: "2024-12-15 11:02:33", user: "mwilson@bank.com", action: "LOGIN_SUCCESS", ip: "73.162.xx.xx", anomalyScore: 68 },
  { timestamp: "2024-12-15 11:03:45", user: "mwilson@bank.com", action: "NAVIGATION", ip: "73.162.xx.xx", anomalyScore: 82 },
  { timestamp: "2024-12-15 12:18:05", user: "svc-api@bank.com", action: "API_CALL_SPIKE", ip: "10.0.5.100", anomalyScore: 88 },
  { timestamp: "2024-12-15 12:20:33", user: "svc-api@bank.com", action: "DATA_ENUMERATION", ip: "10.0.5.100", anomalyScore: 94 },
  { timestamp: "2024-12-15 14:30:00", user: "contractor@partner.com", action: "VPN_CONNECT", ip: "189.xx.xx.xx", anomalyScore: 45 },
  { timestamp: "2024-12-15 15:45:22", user: "dba@bank.com", action: "BULK_QUERY", ip: "10.0.3.22", anomalyScore: 85 },
  { timestamp: "2024-12-15 15:48:11", user: "dba@bank.com", action: "DATA_EXPORT", ip: "10.0.3.22", anomalyScore: 96 },
  { timestamp: "2024-12-15 15:50:33", user: "dba@bank.com", action: "EXTERNAL_TRANSFER", ip: "203.0.xx.xx", anomalyScore: 99 },
];

export const playbooks = [
  {
    id: "PB-001",
    title: "Credential Compromise Response",
    steps: {
      containment: [
        "Disable compromised user account immediately",
        "Terminate all active sessions for the user",
        "Block source IP addresses at firewall",
        "Revoke all API tokens and certificates",
      ],
      investigation: [
        "Review authentication logs for the past 72 hours",
        "Identify all systems accessed during compromise window",
        "Check for persistence mechanisms (scheduled tasks, registry)",
        "Analyze data accessed and potential exfiltration",
        "Correlate with threat intelligence feeds",
      ],
      recovery: [
        "Reset user credentials via secure out-of-band channel",
        "Enable MFA enforcement for the account",
        "Restore any modified files from backup",
        "Patch identified vulnerability or access path",
      ],
      monitoring: [
        "Enable enhanced logging for affected systems",
        "Set up alerting for the source IP range",
        "Monitor for similar patterns across all accounts",
        "Schedule follow-up review in 24 hours",
      ],
    },
  },
];
