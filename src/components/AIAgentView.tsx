import { useState } from "react";
import { Bot, MessageSquare, Sparkles, User, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAgentView() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            24/7 AI Agent <Sparkles className="h-6 w-6 text-amber-500" />
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your automated WhatsApp customer service bot.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-muted-foreground">{enabled ? "Agent is Active" : "Agent is Disabled"}</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              enabled ? "bg-primary" : "bg-muted-foreground"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-background transition-transform",
                enabled ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
        {/* Left Column - Demo / Preview */}
        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="border-b border-border p-4 flex items-center bg-muted/30 rounded-t-xl">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Wasla Assistant</h3>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[url('/whatsapp-bg.png')] bg-cover bg-center">
            {/* Mock chat bubbles */}
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted p-3 text-sm shadow-sm relative">
                Hello! How can you help me today?
                <div className="text-[10px] text-muted-foreground mt-1 text-right">10:41 AM</div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/20 text-foreground p-3 text-sm shadow-sm">
                I want to know the status of my order #4592
                <div className="text-[10px] text-muted-foreground/70 mt-1 text-right">10:42 AM</div>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted p-3 text-sm shadow-sm border border-primary/20">
                <span className="flex items-center gap-1 font-semibold text-primary mb-1"><Sparkles className="h-3 w-3"/> AI Response</span>
                Your order #4592 is currently "Preparing". We will send you a message when it's out for delivery. 🛵
                <div className="text-[10px] text-muted-foreground mt-1 text-right">10:42 AM</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 border-t border-border mt-auto">
            <div className="relative rounded-full bg-background border border-border flex items-center px-4 py-2">
              <span className="text-muted-foreground text-sm flex-1">Type a message...</span>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Settings2 className="h-5 w-5 text-primary" /> Agent Configuration
            </h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Business Context</label>
                <textarea 
                  className="w-full min-h-[100px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Describe your business here..."
                  defaultValue="Wasla CRM handles incoming orders for various restaurants. The bot should be helpful, friendly, and prioritize standard English terminology."
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Handoff Rules</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Transfer to human on "cancel order"</option>
                  <option>Transfer immediately upon ANY complaint</option>
                  <option>Never transfer automatically, wait for manual override</option>
                </select>
                <p className="text-xs text-muted-foreground">Conditions under which the AI stops replying.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Deploy Changes
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-indigo-500" /> N8N Brain Connection
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Link this agent to your N8N workflow acting as the "Brain".</p>
            <div className="space-y-4">
              <div className="grid gap-2">
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">N8N Reply Webhook URL</label>
                 <input 
                    type="text" 
                    className="w-full bg-muted border border-border text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://n8n.your-server.com/webhook/ai-reply"
                    defaultValue="https://n8n.your-server.com/webhook/ai-reply"
                 />
                 <p className="text-xs text-muted-foreground mt-1">Incoming messages from contacts where AI is active will be POSTed here.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/20 transition-colors">
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
