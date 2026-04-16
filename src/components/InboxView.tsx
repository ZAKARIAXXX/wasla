import { useState } from "react";
import { ChatList } from "./ChatList";
import { ActiveChat } from "./ActiveChat";
import { RiskSidePanel } from "./RiskSidePanel";
import { RiskProvider } from "@/context/RiskContext";
import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export function InboxView() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [riskOpen, setRiskOpen] = useState(true);

  return (
    <RiskProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Chat list */}
        <ChatList selectedId={selectedContact} onSelect={setSelectedContact} />

        {selectedContact ? (
          <div className="flex flex-1 min-w-0 relative overflow-hidden">
            {/* Active Chat — shrinks when risk panel is open */}
            <div className="flex-1 min-w-0">
              <ActiveChat contactId={selectedContact} />
            </div>

            {/* Toggle tab — always visible on the right edge of ActiveChat */}
            <button
              onClick={() => setRiskOpen((v) => !v)}
              title={riskOpen ? "Close Risk Analysis" : "Open Risk Analysis"}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 py-3 px-1.5 rounded-l-xl border border-r-0 border-border bg-card shadow-md hover:bg-muted transition-colors"
              style={{ right: riskOpen ? "320px" : "0px", transition: "right 300ms cubic-bezier(0.4,0,0.2,1)" }}
            >
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              {riskOpen
                ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                : <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />}
              <span
                className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                Risk
              </span>
            </button>

            {/* Risk Side Panel — slides in/out */}
            <div
              className="h-full shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
              style={{ width: riskOpen ? "320px" : "0px" }}
            >
              <div className="h-full w-[320px]">
                <RiskSidePanel contactId={selectedContact} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <p className="text-muted-foreground text-sm">Sélectionnez une conversation pour commencer</p>
          </div>
        )}
      </div>
    </RiskProvider>
  );
}
