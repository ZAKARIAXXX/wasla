import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { quickTier } from "@/utils/riskScoring";
import { useRiskContext } from "@/context/RiskContext";
import { TrendingDown } from "lucide-react";
import { io } from "socket.io-client";

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  timestamp: string;
  unread: number;
  status: "new-order" | "pending" | "preparing" | "delivered" | "paid";
  reliability?: number;
  totalSpent?: number;
  orderStatus?: string | null;
  assignedTo?: { id: number; name: string; email: string };
}

interface ChatListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function StatusBadge({ status }: { status: Contact["status"] }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    "new-order": { label: "New Order", className: "bg-badge-new text-badge-new-foreground" },
    pending: { label: "Pending", className: "bg-badge-pending text-badge-pending-foreground" },
    preparing: { label: "Preparing", className: "bg-badge-pending text-badge-pending-foreground" },
    delivered: { label: "Delivered", className: "bg-primary text-primary-foreground" },
    paid: { label: "Paid", className: "bg-badge-success text-badge-success-foreground" },
  };
  const { label, className } = statusConfig[status] ?? { label: status, className: "" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none", className)}>
      {label}
    </span>
  );
}

export function ChatList({ selectedId, onSelect }: ChatListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { tiers } = useRiskContext();
  const [savings, setSavings] = useState<{ totalSaved: number; savedPerOrder: number } | null>(null);
  
  const [users, setUsers] = useState<{id: number, name: string}[]>([]);
  const [selectedUserFilter, setSelectedUserFilter] = useState<'all' | 'unassigned' | number>('all');

  useEffect(() => {
    fetch('/api/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } })
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const res = await fetch('/api/metrics/savings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSavings(data);
        }
      } catch (error) {
        console.error("Failed to fetch savings", error);
      }
    }
    fetchSavings();
    // Poll for updates every 15 seconds
    const interval = setInterval(fetchSavings, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
          
          // Auto-select first contact if none selected
          if (data.length > 0 && !selectedId) {
            onSelect(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch contacts', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();

    // Real-time connection via Socket.IO
    // Use an environment variable to point to the correct backend in production
    // Fallback to localhost for local development
    const env = (import.meta as any).env || {};
    const socketIoUrl: string = env.VITE_SOCKET_IO_URL || 'http://localhost:3000';
    const socket = io(socketIoUrl, {
      auth: { token: localStorage.getItem('authToken') ?? '' },
      path: '/socket.io'
    });

    socket.on('contactUpdated', (updatedContact: Contact) => {
      setContacts((prev) => {
        const exists = prev.find(c => c.id === updatedContact.id);
        const newList = exists
          ? prev.map(c => c.id === updatedContact.id ? updatedContact : c)
          : [updatedContact, ...prev];
        return newList.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredContacts = contacts.filter((c) => {
    if (selectedUserFilter === 'unassigned' && c.assignedTo != null) return false;
    if (typeof selectedUserFilter === 'number' && c.assignedTo?.id !== selectedUserFilter) return false;
    
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `hadi ${minutes} dqiqa`;
    if (hours < 24) return `hadi ${hours} sa3a`;
    return `hadi ${days} yamat`;
  };

  return (
    <div className="flex h-screen w-80 flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">L'Mohadatat</h2>
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          {contacts.filter((c) => c.unread > 0).length}
        </span>
      </div>

      {/* Cost Savings Dashboard Widget */}
      {savings && (
        <div className="bg-emerald-50 border-b border-emerald-100 flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-1.5 rounded-md text-emerald-600">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Money Saved</span>
              <span className="text-sm font-bold text-emerald-900">${savings.totalSaved.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-emerald-600 font-medium">Per Order</div>
            <div className="text-xs font-bold text-emerald-800">${savings.savedPerOrder.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="border-b border-border px-3 py-2 space-y-2">
        <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Qelleb f l'mohadatat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <select 
          value={selectedUserFilter}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'all' || val === 'unassigned') setSelectedUserFilter(val);
            else setSelectedUserFilter(Number(val));
          }}
          className="w-full rounded-md bg-muted px-2 py-1.5 text-xs text-foreground focus:outline-none"
        >
          <option value="all">All team members</option>
          <option value="unassigned">Unassigned</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border px-4 py-3 animate-pulse">
              <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
              </div>
            </div>
          ))
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-xs text-muted-foreground gap-1">
            <span>Malgina hta mohadata</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline"
              >
                Mseh l'qellab
              </button>
            )}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelect(contact.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors",
                selectedId === contact.id
                  ? "bg-primary/5"
                  : "hover:bg-surface-hover"
              )}
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {contact.avatar || contact.name.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-sm font-medium text-foreground">
                      {contact.name}
                    </span>
                    {/* Risk dot — reads authoritative tier from context (panel sets it after full calc) */}
                    {(() => {
                      // Prefer the computed tier from the panel (includes message data)
                      const tier = tiers[contact.id] ?? quickTier({
                        phone: contact.phone,
                        reliability: contact.reliability,
                        totalSpent: contact.totalSpent,
                        orderStatus: contact.orderStatus,
                        lastMessage: contact.lastMessage,
                        timestamp: contact.timestamp,
                        unread: contact.unread,
                      });
                      return (
                        <div
                          className={cn(
                            "h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background shadow-sm",
                            tier === "green"
                              ? "bg-emerald-500"
                              : tier === "yellow"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          )}
                          title={tier === "green" ? "Low Risk" : tier === "yellow" ? "Medium Risk" : "High Risk"}
                        />
                      );
                    })()}
                    <StatusBadge status={contact.status} />
                    {contact.assignedTo && (
                        <span className="shrink-0 rounded-sm bg-primary/20 px-1 py-0.5 text-[9px] font-bold text-primary uppercase" title={`Assigned to ${contact.assignedTo.name}`}>
                            {contact.assignedTo.name.substring(0, 2)}
                        </span>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {formatTimestamp(contact.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="truncate text-xs text-muted-foreground">
                    {contact.lastMessage || "Ba9i hta mssg"}
                  </p>
                  {contact.unread > 0 && (
                    <span className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
