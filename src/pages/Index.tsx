import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { InboxView } from "@/components/InboxView";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AutomationView } from "@/components/AutomationView";
import { ContactsView } from "@/components/ContactsView";
import { SettingsView } from "@/components/SettingsView";
import { AutomatedCallsView } from "@/components/AutomatedCallsView";
import { AIAgentView } from "@/components/AIAgentView";
import { DashboardView } from "@/components/DashboardView";
import { KnowledgeBaseView } from "@/components/KnowledgeBaseView";
import { CampaignsView } from "@/components/CampaignsView";
import { FollowUpView } from "@/components/FollowUpView";
import { Helmet } from "react-helmet-async";
import { RiskProvider } from "@/context/RiskContext";

const Index = () => {
  const [activeView, setActiveView] = useState("inbox");

  return (
    <>
      <Helmet>
        <title>Dashboard | Wasla</title>
        <meta name="description" content="Wasla CRM Dashboard" />
      </Helmet>
      <RiskProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <AppSidebar activeView={activeView} onViewChange={setActiveView} />
          {activeView === "inbox" && <InboxView />}
          {activeView === "kanban" && <KanbanBoard />}
          {activeView === "automations" && <AutomationView />}
          {activeView === "automated-calls" && <AutomatedCallsView />}
          {activeView === "ai-agent" && <AIAgentView />}
          {activeView === "contacts" && <ContactsView />}
          {activeView === "settings" && <SettingsView />}
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "knowledge" && <KnowledgeBaseView />}
          {activeView === "campaigns" && <CampaignsView />}
          {activeView === "followup" && <FollowUpView />}
          {!["inbox", "kanban", "automations", "automated-calls", "ai-agent", "contacts", "settings", "dashboard", "knowledge", "campaigns", "followup"].includes(activeView) && (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </RiskProvider>

    </>
  );
};

export default Index;
