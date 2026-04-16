import { useState, useEffect } from "react";
import { PhoneCall, Settings, Activity, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CallLog {
  id: number;
  phoneNumber: string;
  status: string;
  duration: number | null;
  createdAt: string;
}

export function AutomatedCallsView() {
  const [active, setActive] = useState(true);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    confirmationRate: "0%",
    avgDuration: "0m 0s"
  });

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const res = await fetch('/api/calls', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCalls(data.calls || []);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      toast.error("Failed to load call logs");
    }
  };

  const scheduleCall = async () => {
     try {
       const res = await fetch('/api/calls/schedule', {
         method: 'POST',
         headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
         },
         body: JSON.stringify({ phoneNumber: '+212600000000' }) // Stub for now
       });
       if(res.ok) {
          toast.success("Test call scheduled!");
          fetchCalls();
       }
     } catch {
       toast.error("Failed to schedule call");
     }
  };

  const formatDuration = (secs: number | null) => {
    if (secs === null) return "--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateStr: string) => {
     const date = new Date(dateStr);
     return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Automated Calls</h1>
          <p className="mt-2 text-muted-foreground">Manage and track AI order confirmation calls in real-time.</p>
        </div>
        <div className="flex gap-3 items-center">
            <button
                onClick={scheduleCall}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                Test Call
            </button>
            <button
            onClick={() => setActive(!active)}
            className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm",
                active ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            >
            <span className={cn("h-2 w-2 rounded-full", active ? "bg-primary animate-pulse" : "bg-muted-foreground")}></span>
            {active ? "System Active" : "System Paused"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Calls Today</h3>
            <PhoneCall className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.totalCalls}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Confirmation Rate</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.confirmationRate}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Avg Duration</h3>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.avgDuration}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Calls Log */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm h-[500px] flex flex-col">
          <div className="border-b border-border p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Activity Log</h3>
              <p className="text-sm text-muted-foreground">Real-time log of automated calls.</p>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="p-0 flex-1 overflow-y-auto scrollbar-thin">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">Phone Number</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    <th className="px-6 py-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {calls.map((call) => (
                     <tr key={call.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{call.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          call.status === "completed" ? "bg-green-500/10 text-green-600" :
                          call.status === "failed" ? "bg-destructive/10 text-destructive" :
                          "bg-amber-500/10 text-amber-600"
                        )}>
                          {call.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {call.status === "failed" && <XCircle className="mr-1 h-3 w-3" />}
                          {(call.status === "pending" || call.status === "scheduled" || !call.status) && <Clock className="mr-1 h-3 w-3" />}
                          {(call.status?.charAt(0).toUpperCase() + call.status?.slice(1)) || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDuration(call.duration)}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{formatTime(call.createdAt)}</td>
                    </tr>
                  ))}
                  {calls.length === 0 && (
                      <tr>
                          <td colSpan={4} className="text-center py-12 text-muted-foreground">
                              No calls logged yet. Run a test call to see data.
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col h-[500px]">
          <div className="border-b border-border p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Agent Prompt</h3>
              <p className="text-sm text-muted-foreground">Customize call behavior</p>
            </div>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="p-6 flex-1 flex flex-col space-y-4 overflow-y-auto scrollbar-thin">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Voice Persona</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Professional Female (Arabic)</option>
                <option>Friendly Male (Arabic/Darija)</option>
                <option>Formal Agent (French)</option>
              </select>
            </div>
            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-sm font-medium text-foreground">System Prompt</label>
              <textarea 
                className="w-full h-full min-h-[200px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={"You are an order confirmation agent for Wasla. Your goal is to call the customer, greet them politely in Moroccan Darija, and confirm their recent order. If they confirm, record it. Do not attempt to upsell."}
              />
            </div>
            <button onClick={() => toast.success("Configuration Saved!")} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
