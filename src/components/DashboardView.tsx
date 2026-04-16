import { useState, useEffect, useCallback } from "react";
import { BarChart3, TrendingUp, Clock, AlertCircle, Save, Users, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Range = "7d" | "30d" | "90d" | "custom";

const RANGE_PRESETS: { label: string; value: Range; days: number }[] = [
  { label: "7 days",  value: "7d",  days: 7  },
  { label: "30 days", value: "30d", days: 30 },
  { label: "90 days", value: "90d", days: 90 },
];

function getDateRange(preset: Range, customFrom: string, customTo: string) {
  const to = preset === "custom" && customTo ? new Date(customTo) : new Date();
  const from = new Date(to);
  if (preset === "custom" && customFrom) {
    from.setTime(new Date(customFrom).getTime());
  } else {
    const days = RANGE_PRESETS.find(p => p.value === preset)?.days ?? 7;
    from.setDate(from.getDate() - days + 1);
  }
  return { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] };
}

export function DashboardView() {
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("https://n8n.your-server.com/webhook/dashboard-metrics");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState<Range>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [metrics, setMetrics] = useState({
    totalConversations: 0,
    avgResponseTime: "—",
    estConversions: 0,
    missedOpportunities: 0,
    revenueTrend: [] as { name: string; total: number }[],
  });

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const { from, to } = getDateRange(range, customFrom, customTo);
      const res = await fetch(`/api/metrics/dashboard?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      if (data && !data.error) {
        setMetrics({
          totalConversations: data.totalConversations ?? 0,
          avgResponseTime: data.avgResponseTime ?? "—",
          estConversions: data.estConversions ?? 0,
          missedOpportunities: data.missedOpportunities ?? 0,
          revenueTrend: Array.isArray(data.revenueTrend) ? data.revenueTrend : [],
        });
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [range, customFrom, customTo]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const handleSaveHook = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); toast.success("N8N endpoint saved!"); }, 600);
  };

  const syncData = async () => {
    toast.info("Triggering N8N metric sync...");
    try {
      await fetch(n8nWebhookUrl, { method: "POST", body: JSON.stringify({ action: "sync_dashboard" }) });
      toast.success("Data synced!");
    } catch {
      toast.error("N8N Webhook trigger failed.");
    }
  };

  const kpis = [
    { label: "Conversations",       value: metrics.totalConversations.toLocaleString(), icon: BarChart3,    color: "text-blue-500",   bg: "bg-blue-500/10"   },
    { label: "Avg Response Time",   value: metrics.avgResponseTime,                     icon: Clock,        color: "text-emerald-500",bg: "bg-emerald-500/10"},
    { label: "Revenue",             value: `MAD ${metrics.estConversions.toLocaleString()}`, icon: TrendingUp,  color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Missed Opportunities",value: metrics.missedOpportunities.toString(),      icon: AlertCircle,  color: "text-amber-500",  bg: "bg-amber-500/10"  },
  ];

  const maxRevenue = Math.max(...metrics.revenueTrend.map(d => d.total), 1);

  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto bg-background/50 p-8 scrollbar-thin">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Business Performance</h1>
          <p className="text-sm text-muted-foreground">Monitor revenue-related metrics and ROI.</p>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range presets */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            {RANGE_PRESETS.map(p => (
              <button key={p.value} onClick={() => setRange(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === p.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
            <button onClick={() => setRange("custom")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === "custom" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Calendar className="h-3 w-3" /> Custom
            </button>
          </div>

          {/* Custom date inputs */}
          {range === "custom" && (
            <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none" />
              <span className="text-muted-foreground text-xs">→</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none" />
              <button onClick={fetchMetrics} className="ml-1 rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold hover:bg-primary/20 transition-colors">
                Apply
              </button>
            </div>
          )}

          <button onClick={fetchMetrics} disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* N8N webhook URL */}
          <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border shadow-sm">
            <input type="text" value={n8nWebhookUrl} onChange={e => setN8nWebhookUrl(e.target.value)}
              className="w-56 bg-transparent text-xs outline-none text-foreground px-1" placeholder="N8N Sync Webhook URL..." />
            <button onClick={handleSaveHook} className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors">
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.map((stat, i) => (
          <div key={i} className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md ${isLoading ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 grid-cols-3">
        {/* Revenue trend chart */}
        <div className="col-span-2 rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Total spend from converted contacts.</p>
            </div>
            {metrics.revenueTrend.length > 0 && (
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                MAD {metrics.revenueTrend.reduce((a, b) => a + b.total, 0).toLocaleString()} total
              </span>
            )}
          </div>
          <div className="flex-1 flex items-end justify-around rounded-xl px-4 pt-4 pb-0 bg-muted/20 border border-border overflow-hidden">
            {metrics.revenueTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground self-center pb-8">No data for this period</p>
            ) : (
              metrics.revenueTrend.map((day, i) => {
                const heightPc = (day.total / maxRevenue) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 group flex-1 h-full justify-end max-w-[60px]">
                    <span className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      MAD {day.total.toLocaleString()}
                    </span>
                    <div className="w-4/5 bg-primary rounded-t-md transition-all duration-500 group-hover:bg-primary/80"
                      style={{ height: `${heightPc}%`, minHeight: heightPc > 0 ? "4px" : "0" }} />
                    <span className="text-[9px] text-muted-foreground font-semibold mb-2 truncate w-full text-center">{day.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* N8N sync */}
        <div className="col-span-1 rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground">N8N Real-Time Sync</h3>
            <p className="text-xs text-muted-foreground mt-1">Push live data to your automated flows.</p>
          </div>
          <button onClick={syncData}
            className="mt-6 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:opacity-90 transition-opacity">
            Trigger Sync Now
          </button>
        </div>
      </div>

      {/* Team Workload */}
      <div className="mt-6">
        <WorkloadDashboard />
      </div>
    </div>
  );
}

function WorkloadDashboard() {
  const [workload, setWorkload] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        const res = await fetch("/api/users/workload", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        if (res.ok) setWorkload(await res.json());
      } catch (err) {
        console.error("Error fetching workload:", err);
      }
    };
    fetchWorkload();
    const interval = setInterval(fetchWorkload, 15000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = (status: string) => {
    if (status === "busy")   return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    if (status === "active") return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" /> Team Workload
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Live active chat assignments — refreshes every 15s.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workload.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{user.name || user.email}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{user.activeContacts}</p>
              <p className="text-[10px] text-muted-foreground">Active Chats</p>
            </div>
          </div>
        ))}
        {workload.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No team members. Invite agents in Settings → Teams &amp; Security.
          </div>
        )}
      </div>
    </div>
  );
}
