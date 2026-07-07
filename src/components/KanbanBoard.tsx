import { useState, useCallback, useRef, useEffect, DragEvent } from "react";
import { REVERSE_STATUS_MAP, InternalStatus } from "@/utils/statusUtils";
import { cn } from "@/lib/utils";
import { GripVertical, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useRiskContext } from "@/context/RiskContext";
import { quickTier } from "@/utils/riskScoring";
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
  status: "lead" | "engaged" | "qualified" | "won" | "lost";
  totalSpent: number;
  notes?: string;
  orderStatus?: string;
  reliability?: number;
  assignedToId?: number | null;
  assignedTo?: { id: number; name: string; email: string };
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  statuses: Contact["status"][];
}

const columns: KanbanColumn[] = [
  { id: "lead", title: "New Lead", color: "bg-badge-new", statuses: ["lead"] },
  { id: "engaged", title: "Engaged", color: "bg-badge-pending", statuses: ["engaged"] },
  { id: "qualified", title: "Qualified Proposal", color: "bg-primary", statuses: ["qualified"] },
  { id: "won", title: "Closed Won", color: "bg-badge-success", statuses: ["won"] },
  { id: "lost", title: "Closed Lost", color: "bg-rose-500", statuses: ["lost"] },
];

export function KanbanBoard() {
  const [cards, setCards] = useState<Contact[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const { tiers } = useRiskContext();
  const [pipelineTotal, setPipelineTotal] = useState(0);
  const [activePipelineVal, setActivePipelineVal] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Calculate Pipeline Metrics instead of Savings
  useEffect(() => {
    let activeVal = 0;
    let totalVal = 0;
    cards.forEach(c => {
      totalVal += c.totalSpent;
      if (c.status !== 'won' && c.status !== 'lost') {
        activeVal += c.totalSpent;
      }
    });
    setPipelineTotal(totalVal);
    setActivePipelineVal(activeVal);
  }, [cards]);

  // Fetch contacts from API and handle Real-Time
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCards(data);
        }
      } catch (error) {
        console.error('Failed to fetch contacts for kanban', error);
      }
    };
    fetchContacts();

    // Socket.io real-time — authenticated and tenant-scoped
    const token = localStorage.getItem('authToken');
    const env = (import.meta as any).env || {};
    const socketIoUrl = env.VITE_SOCKET_IO_URL || 'http://localhost:3000';
    const socket = io(socketIoUrl, {
      path: '/socket.io',
      auth: { token }
    });

    socket.on('contactUpdated', (updatedContact: Contact) => {
      setCards((prev) => {
        const exists = prev.find(c => c.id === updatedContact.id);
        if (exists) {
          return prev.map(c => c.id === updatedContact.id ? updatedContact : c);
        } else {
          return [updatedContact, ...prev];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDragStart = (id: string) => setDraggedId(id);

  const updateContactStatus = async (contactId: string, newStatus: Contact["status"], explicitOrderStatus?: string) => {
    try {
      const orderStatus = explicitOrderStatus || REVERSE_STATUS_MAP[newStatus];
      const res = await fetch(`/api/contacts/${contactId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status: newStatus, orderStatus })
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        const refreshRes = await fetch('/api/contacts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (refreshRes.ok) setCards(await refreshRes.json());
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error("Error updating status");
    }
  };

  const handleDrop = useCallback(
    (columnId: string) => {
      if (!draggedId) return;
      const targetStatuses = columns.find((c) => c.id === columnId)?.statuses;
      if (!targetStatuses) return;

      const newStatus = targetStatuses[0];

      // Optimistic update
      setCards((prev) =>
        prev.map((card) =>
          card.id === draggedId ? { ...card, status: newStatus } : card
        )
      );

      // Update backend
      const colTitle = columns.find((c) => c.id === columnId)?.title || "Lead";
      let orderStatusLabel = colTitle;
      if (colTitle === "New Lead") orderStatusLabel = "Lead";
      if (colTitle === "Closed Won") orderStatusLabel = "Won";

      updateContactStatus(draggedId, newStatus, orderStatusLabel);
      setDraggedId(null);
    },
    [draggedId]
  );

  const handleDragOverBoard = (e: DragEvent) => {
    e.preventDefault();
    if (!boardRef.current) return;

    const { left, right } = boardRef.current.getBoundingClientRect();
    const { clientX } = e;
    const scrollZone = 150;
    const scrollSpeed = 15;

    // Scroll Left
    if (clientX < left + scrollZone) {
      boardRef.current.scrollLeft -= scrollSpeed;
    }
    // Scroll Right
    else if (clientX > right - scrollZone) {
      boardRef.current.scrollLeft += scrollSpeed;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen flex-1 flex-col bg-surface overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Lead Intelligence Panel</h2>
          <p className="text-xs text-muted-foreground">
            Monitor and categorize lead intent. Drag and drop to manually update statuses.
          </p>
        </div>

        {/* Pipeline Intelligence Dashboard Widget */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-6 px-4 py-2 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-1.5 rounded-md text-emerald-600">
              <TrendingDown className="h-4 w-4 transform rotate-180" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Active Pipeline</span>
              <span className="text-sm font-bold text-emerald-900">${activePipelineVal.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-right pl-4 border-l border-emerald-200">
            <div className="text-[10px] text-emerald-600 font-medium tracking-wider uppercase">Total Won & Active</div>
            <div className="text-sm font-bold text-emerald-800">${pipelineTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="flex flex-1 gap-4 overflow-x-auto p-4 scroll-smooth"
        onDragOver={handleDragOverBoard}
      >
        {columns.map((col) => {
          const colCards = cards.filter((c) => col.statuses.includes(c.status));
          return (
            <div
              key={col.id}
              className="flex w-[280px] shrink-0 flex-col rounded-lg border border-border bg-background"
              onDrop={() => handleDrop(col.id)}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", col.color)} />
                  <span className="text-xs font-semibold text-foreground">{col.title}</span>
                </div>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  {colCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2 overflow-y-auto p-2 scrollbar-thin">
                {colCards.map((card) => {
                  const isDraggable = currentUser.role === 'Admin' || (currentUser.role === 'Agent' && (!card.assignedToId || card.assignedToId === currentUser.id));

                  return (
                    <div
                      key={card.id}
                      draggable={isDraggable}
                      onDragStart={(e) => {
                          if (isDraggable) handleDragStart(card.id);
                          else e.preventDefault();
                      }}
                      className={cn(
                        "group rounded-md border border-border bg-background p-3 transition-all hover:shadow-md",
                        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-80",
                        draggedId === card.id && "opacity-50"
                      )}
                    >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {card.avatar || card.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-medium text-foreground">{card.name}</p>
                            {(() => {
                              const tier = tiers[card.id] ?? quickTier({
                                phone: card.phone,
                                reliability: card.reliability,
                                totalSpent: card.totalSpent,
                                orderStatus: card.orderStatus,
                                lastMessage: card.lastMessage,
                                timestamp: card.timestamp,
                                unread: card.unread,
                              });
                              
                              const intentColor = tier === "green" 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                : tier === "yellow" 
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                                  : "bg-rose-500/10 text-rose-600 border-rose-500/20";
                              
                              const intentLabel = tier === "green" ? "High Intent" : tier === "yellow" ? "Medium Intent" : "Low Intent";

                              return (
                                <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider", intentColor)}>
                                  {intentLabel}
                                </span>
                              );
                            })()}
                          </div>
                          <p className="text-xs text-muted-foreground">{card.phone}</p>
                        </div>
                      </div>
                      {isDraggable ? (
                          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      ) : (
                          <div className="h-4 w-4 shrink-0 px-1 py-0.5 rounded-sm bg-muted text-muted-foreground flex items-center justify-center" title="Locked: You don't own this lead">
                            <span className="text-[8px] font-bold">🔒</span>
                          </div>
                      )}
                    </div>

                    {card.lastMessage && (
                      <div className="mt-2 flex items-start gap-1.5">
                        <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {card.lastMessage}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">
                        {card.totalSpent} MAD
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTimestamp(card.timestamp)}
                      </span>
                    </div>

                    {card.unread > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-medium text-primary">
                          {card.unread} new
                        </span>
                      </div>
                    )}
                  </div>
                  );
                })}
                {colCards.length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-border">
                    <p className="text-xs text-muted-foreground">No orders found</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
