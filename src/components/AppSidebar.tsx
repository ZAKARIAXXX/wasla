import { useState } from "react";
import { MessageSquare, LayoutGrid, Zap, Users, Settings, Search, Bot, BarChart3, BookOpen, Clock, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  { icon: BarChart3, label: "L'ihsa'iyat", id: "dashboard" },
  { icon: MessageSquare, label: "Méssagat", id: "inbox" },
  { icon: LayoutGrid, label: "L'iqtihamat", id: "kanban" },
  { icon: Bot, label: "Musa3id AI", id: "ai-agent" },
  { icon: BookOpen, label: "M3lomat", id: "knowledge" },
  { icon: Zap, label: "Otomatisasi", id: "automations" },
  { icon: Clock, label: "Tab3o l'klian", id: "followup" },
  { icon: Megaphone, label: "Hamalat", id: "campaigns" },
  { icon: Users, label: "L'contacts", id: "contacts" },
  { icon: Settings, label: "L'i3dadat", id: "settings" },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  return (
    <div className="flex h-screen w-16 flex-col items-center border-r border-border bg-background py-4">
      {/* Logo */}
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg">
        <Logo size={32} showText={false} />
      </div>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-14 z-50 hidden rounded-md bg-foreground px-2 py-1 text-xs text-background group-hover:block whitespace-nowrap">
                {item.label} {item.comingSoon && "(قريباً)"}
              </span>
              {item.comingSoon && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Search at bottom */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        title="Qelleb"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
