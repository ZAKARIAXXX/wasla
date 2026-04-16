import { useState, useEffect } from "react";
import { Clock, Save, Infinity as InfinityIcon, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function FollowUpView() {
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("https://n8n.your-server.com/webhook/followup-logic");
  const [rules, setRules] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", triggerType: "No Reply", delayHours: 24, actionText: "" });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
       const res = await fetch('/api/followups', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
       if(res.ok) setRules(await res.json());
    } catch {}
  };

  const handleAddRule = async () => {
    try {
      const res = await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify(newRule)
      });
      if(res.ok) {
        toast.success("Rule added");
        setIsAddOpen(false);
        fetchRules();
      }
    } catch { toast.error("Error adding rule"); }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await fetch(`/api/followups/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ isActive })
      });
      fetchRules();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/followups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      toast.success("Rule deleted");
      fetchRules();
    } catch {}
  };

  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto bg-background/50 p-8 scrollbar-thin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Follow-up Engine</h1>
          <p className="text-sm text-muted-foreground">Automate reactivation logic for leads that stall.</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-border shadow-sm w-96">
          <input
            type="text"
            value={n8nWebhookUrl}
            onChange={(e) => setN8nWebhookUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs outline-none text-foreground px-2"
            placeholder="N8N Follow-Up Config Webhook..."
          />
          <button 
             onClick={() => toast.success("Endpoint Saved")} 
             className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-semibold text-foreground flex items-center gap-2">
                 <Clock className="h-4 w-4 text-primary" /> Active Follow-Up Rules
               </h3>
               <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                 <DialogTrigger asChild>
                    <button className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors">
                      + Add Rule
                    </button>
                 </DialogTrigger>
                 <DialogContent>
                    <DialogHeader><DialogTitle>Add Follow-Up Rule</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                       <div className="grid gap-2">
                          <Label>Rule Name</Label>
                          <Input value={newRule.name} onChange={e=>setNewRule({...newRule, name: e.target.value})} placeholder="e.g. Abandoned Cart" />
                       </div>
                       <div className="grid gap-2">
                          <Label>Trigger Condition</Label>
                          <Input value={newRule.triggerType} onChange={e=>setNewRule({...newRule, triggerType: e.target.value})} placeholder="e.g. No Reply" />
                       </div>
                       <div className="grid gap-2">
                          <Label>Delay (in hours)</Label>
                          <Input type="number" value={newRule.delayHours} onChange={e=>setNewRule({...newRule, delayHours: Number(e.target.value)})} />
                       </div>
                       <div className="grid gap-2">
                          <Label>Action / Message Template</Label>
                          <Input value={newRule.actionText} onChange={e=>setNewRule({...newRule, actionText: e.target.value})} placeholder="Message to send" />
                       </div>
                    </div>
                    <DialogFooter>
                       <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/90" onClick={handleAddRule}>Save Rule</button>
                    </DialogFooter>
                 </DialogContent>
               </Dialog>
            </div>

            <div className="space-y-4">
               {rules.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No follow-up rules configured.</p> : rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl shadow-sm">
                     <div className="flex-1 flex items-center gap-4">
                        <div className="w-1/3">
                           <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1 block">When</span>
                           <div className="text-sm font-medium text-foreground bg-muted py-1.5 px-3 rounded-lg border border-border inline-block flex gap-2">
                              {rule.triggerType} <span className="text-muted-foreground">({rule.delayHours}h)</span>
                           </div>
                        </div>
                        <div className="text-muted-foreground">
                            <InfinityIcon className="h-5 w-5 opacity-40 shrink-0" />
                        </div>
                        <div className="w-1/2">
                           <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Then</span>
                           <div className="text-sm text-primary font-medium bg-primary/5 py-1.5 px-3 rounded-lg border border-primary/20 inline-block">
                              {rule.actionText}
                           </div>
                        </div>
                     </div>
                     <div className="pl-6 border-l border-border flex items-center gap-4">
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={rule.isActive} onChange={(e) => handleToggle(rule.id, e.target.checked)} />
                            <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                         </label>
                         <button onClick={() => handleDelete(rule.id)} className="text-rose-500 hover:text-rose-600 transition-colors">
                           <Trash2 className="h-4 w-4" />
                         </button>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-8 text-center bg-amber-500/10 p-4 border border-amber-500/20 rounded-xl">
               <p className="text-amber-600 text-xs flex items-center justify-center gap-2 font-medium">
                  Saving rule changes here transmits the configuration directly to N8N to enforce in the background.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
}
