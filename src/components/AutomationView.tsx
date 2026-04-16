import { useState, useEffect } from "react";
import { Plus, Zap, MoreHorizontal, Play, Pause, Trash2, ArrowRight, ClipboardList, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Workflow {
    id: number;
    name: string;
    triggerType: string;
    actionType: string;
    isActive: boolean;
    createdAt: string;
}

export function AutomationView() {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newWorkflowName, setNewWorkflowName] = useState("");
    const [triggerType, setTriggerType] = useState("contact_added");
    const [actionType, setActionType] = useState("send_msg");
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    useEffect(() => {
        fetchWorkflows();
        fetchLogs();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const res = await fetch('/api/automations', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
            if(res.ok) setWorkflows(await res.json());
        } catch {}
    };

    const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
            const res = await fetch('/api/logs?limit=30', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
            if (res.ok) { const data = await res.json(); setLogs(data.logs || []); }
        } catch {}
        finally { setIsLoadingLogs(false); }
    };

    const clearLogs = async () => {
        try {
            await fetch('/api/logs', { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
            toast.success('Logs cleared');
            setLogs([]);
        } catch { toast.error('Failed to clear logs'); }
    };

    const handleCreateWorkflow = async () => {
        if (!newWorkflowName) return;

        try {
            const res = await fetch('/api/automations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ name: newWorkflowName, triggerType, actionType })
            });
            if(res.ok) {
                toast.success("Workflow created", { description: `${newWorkflowName} is now active.` });
                setNewWorkflowName("");
                setIsDialogOpen(false);
                fetchWorkflows();
            }
        } catch { toast.error("Failed to create workflow"); }
    };

    const toggleStatus = async (id: number, currentActive: boolean) => {
        try {
            const res = await fetch(`/api/automations/${id}/toggle`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ isActive: !currentActive })
            });
            if(res.ok) fetchWorkflows();
        } catch { toast.error("Failed to toggle status"); }
    };

    const deleteWorkflow = async (id: number) => {
        try {
            await fetch(`/api/automations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            toast.success("Workflow deleted");
            fetchWorkflows();
        } catch {}
    };

    return (
        <div className="flex-1 h-full p-8 overflow-y-auto bg-surface/50">
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md mb-8 flex items-start gap-3 shadow-sm" dir="rtl">
                <div className="mt-0.5">
                    <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                    <h3 className="font-bold text-amber-900">ميزة قادمة (قريباً)</h3>
                    <p className="text-amber-800 text-sm mt-1">ميزة الأتمتة قيد التطوير حالياً وستكون متاحة في التحديث القادم. يمكنك استكشاف الواجهة أدناه.</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
                    <p className="text-muted-foreground mt-1">Manage your automated workflows and rules.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4" /> New Workflow
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Automation</DialogTitle>
                            <DialogDescription>
                                Define a new automated workflow for your CRM.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Workflow Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Auto-reply to VIPs"
                                    value={newWorkflowName}
                                    onChange={(e) => setNewWorkflowName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Trigger</Label>
                                    <Select value={triggerType} onValueChange={setTriggerType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select trigger" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="contact_added">New Contact Added</SelectItem>
                                            <SelectItem value="msg_received">Message Received</SelectItem>
                                            <SelectItem value="deal_updated">Deal Updated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Action</Label>
                                    <Select value={actionType} onValueChange={setActionType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="send_msg">Send Message</SelectItem>
                                            <SelectItem value="notify">Notify Team</SelectItem>
                                            <SelectItem value="update_field">Update Field</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateWorkflow} disabled={!newWorkflowName}>Create Workflow</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {workflows.map((workflow, index) => (
                    <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-all border-border/60 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${workflow.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <Zap className="h-6 w-6" />
                                </div>

                                <div className="flex-1 grid gap-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-lg">{workflow.name}</h3>
                                        <Badge variant={workflow.isActive ? 'default' : 'secondary'} className={workflow.isActive ? 'bg-primary/15 text-primary hover:bg-primary/25' : ''}>
                                            {workflow.isActive ? 'active' : 'paused'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>When <strong>{workflow.triggerType}</strong></span>
                                        <ArrowRight className="h-3 w-3" />
                                        <span>Then <strong>{workflow.actionType}</strong></span>
                                    </div>
                                </div>

                                <div className="text-right mr-4 hidden md:block">
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-xs text-muted-foreground">Total Runs</div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => toggleStatus(workflow.id, workflow.isActive)}>
                                            {workflow.isActive ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Resume</>}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteWorkflow(workflow.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {workflows.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-xl">
                        <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No workflows yet</h3>
                        <p className="text-muted-foreground text-sm mt-1 mb-6">Create your first automation to get started.</p>
                        <Button onClick={() => setIsDialogOpen(true)} variant="outline">Create Workflow</Button>
                    </div>
                )}
            </div>

            {/* Execution Log Panel */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">Execution Log</h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{logs.length} entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={fetchLogs} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                        {logs.length > 0 && (
                            <button onClick={clearLogs} className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 border border-rose-500/20 rounded-lg px-3 py-1.5 hover:bg-rose-500/5 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" /> Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {logs.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            <Clock className="h-8 w-8 mx-auto mb-3 opacity-20" />
                            <p>No execution history yet.</p>
                            <p className="text-xs mt-1">Logs appear here when the follow-up scheduler runs (every hour).</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold">Rule</th>
                                    <th className="text-left px-4 py-3 font-semibold">Type</th>
                                    <th className="text-left px-4 py-3 font-semibold">Message</th>
                                    <th className="text-right px-4 py-3 font-semibold">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3">
                                            {log.status === 'success' && <span className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Success</span>}
                                            {log.status === 'failed'  && <span className="inline-flex items-center gap-1.5 text-rose-500 text-xs font-semibold"><XCircle className="h-3.5 w-3.5" /> Failed</span>}
                                            {log.status === 'skipped' && <span className="inline-flex items-center gap-1.5 text-amber-500 text-xs font-semibold"><Clock className="h-3.5 w-3.5" /> Skipped</span>}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-foreground">{log.ruleName}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
                                                {log.ruleType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{log.message}</td>
                                        <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
