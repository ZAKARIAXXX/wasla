import { useState, useEffect } from "react";
import { Megaphone, Save, Users, Send, Clock, Trash2, Calendar, MousePointerClick, MessageCircle, Eye } from "lucide-react";
import { toast } from "sonner";

export function CampaignsView() {
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("https://n8n.your-server.com/webhook/campaign-broadcast");
  const [targetSegment, setTargetSegment] = useState("all");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if(res.ok) setCampaigns(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleLaunch = async () => {
    if (!message.trim()) {
      toast.error("Please write a message to broadcast.");
      return;
    }
    setIsSending(true);
    toast.info(scheduledAt ? "Scheduling campaign..." : "Dispatching campaign...");
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
           name: "Broadcast - " + new Date().toLocaleDateString(), 
           segment: targetSegment, 
           message, 
           reach: targetSegment === 'all' ? 2450 : Math.floor(Math.random() * 500),
           scheduledAt: scheduledAt || null
        })
      });

      // Send to webhook, could include scheduledAt if the webhook handles scheduling logic
      await fetch(n8nWebhookUrl, { 
          method: "POST", 
          body: JSON.stringify({ segment: targetSegment, content: message, scheduledAt }) 
      });
      toast.success(scheduledAt ? "Campaign scheduled!" : "Campaign launched successfully!");
      setMessage("");
      setScheduledAt("");
      fetchCampaigns();
    } catch {
      toast.error("Failed to launch campaign. Check N8N connection.");
    } finally {
      setIsSending(false);
    }
  };

  const deleteCampaign = async (id: number) => {
    try {
        await fetch(`/api/campaigns/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
        toast.success("Campaign deleted");
        fetchCampaigns();
    } catch {
        toast.error("Error deleting campaign");
    }
  };

  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto bg-background/50 p-8 scrollbar-thin">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Campaigns & Broadcasts</h1>
          <p className="text-sm text-muted-foreground">Send bulk messages or schedule them for later.</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-border shadow-sm w-96">
          <input
            type="text"
            value={n8nWebhookUrl}
            onChange={(e) => setN8nWebhookUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs outline-none text-foreground px-2"
            placeholder="N8N Campaign Trigger Webhook..."
          />
          <button 
             onClick={() => toast.success("URL Saved")} 
             className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-5">
        <div className="col-span-3 rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-6">
               <Megaphone className="h-4 w-4 text-primary" /> New Broadcast
            </h3>

            <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Target Audience</label>
                    <select 
                        value={targetSegment} 
                        onChange={e => setTargetSegment(e.target.value)}
                        className="w-full bg-muted border border-border text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="all">All Contacts (2,450)</option>
                        <option value="purchased">Previous Customers (890)</option>
                        <option value="lost">Lost Leads (1,200)</option>
                        <option value="new">New Inquiries last 7 days (45)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Schedule (Optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="datetime-local" 
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        className="w-full bg-muted border border-border text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block flex justify-between">
                     <span>Message Template</span>
                     <span className="text-primary font-normal text-[10px] lowercase">Variables: {"{name}"}, {"{phone}"}</span>
                   </label>
                   <textarea
                     value={message}
                     onChange={e => setMessage(e.target.value)}
                     placeholder="Salam {name}, we have a special offer for your number {phone}..."
                     className="w-full h-40 bg-muted border border-border text-sm rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                   />
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
               <p className="text-xs text-muted-foreground italic">
                 {scheduledAt ? `Will be sent on ${new Date(scheduledAt).toLocaleString()}` : "Will be sent immediately"}
               </p>
               <button 
                  onClick={handleLaunch}
                  disabled={isSending}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {scheduledAt ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  {isSending ? "Processing..." : (scheduledAt ? "Schedule Campaign" : "Launch Campaign")}
               </button>
            </div>
        </div>

        <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6 h-full">
                <h3 className="font-semibold text-foreground mb-1">Campaign Analytics</h3>
                <p className="text-xs text-muted-foreground mb-4">Past broadcasts and their performance.</p>
                <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin pr-2">
                    {campaigns.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No campaigns launched yet.</p>
                    ) : (
                        campaigns.map((camp) => (
                            <div key={camp.id} className="p-4 bg-muted/30 rounded-xl border border-border flex flex-col gap-3 group transition-colors hover:bg-muted/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground leading-tight">{camp.name}</h4>
                                        <span className="text-[10px] text-muted-foreground">
                                          {camp.scheduledAt ? new Date(camp.scheduledAt).toLocaleString() : new Date(camp.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${camp.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {camp.status}
                                        </span>
                                        <button onClick={() => deleteCampaign(camp.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-rose-500 transition-all">
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 divide-x divide-border/50 bg-background rounded-lg border border-border/50 py-2">
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase flex gap-1 items-center"><Users className="h-2.5 w-2.5"/> Sent</span>
                                    <span className="text-xs font-bold">{camp.reach}</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase flex gap-1 items-center"><Eye className="h-2.5 w-2.5"/> Read</span>
                                    <span className="text-xs font-bold text-blue-500">{camp.opens}</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase flex gap-1 items-center"><MousePointerClick className="h-2.5 w-2.5"/> Click</span>
                                    <span className="text-xs font-bold text-indigo-500">{camp.clicks}</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase flex gap-1 items-center"><MessageCircle className="h-2.5 w-2.5"/> Reply</span>
                                    <span className="text-xs font-bold text-emerald-500">{camp.responses}</span>
                                  </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
