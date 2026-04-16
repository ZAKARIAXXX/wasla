import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, StickyNote, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";

import { STATUS_MAP, ORDER_STATUS_LABELS, OrderStatusLabel } from "@/utils/statusUtils";

interface CustomerDetailsProps {
  contactId: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  totalSpent: number;
  notes?: string;
  orderStatus?: string;
  status?: string;
  reliability?: number;
}

const orderStatuses = ORDER_STATUS_LABELS;

export function CustomerDetails({ contactId }: CustomerDetailsProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [reliability, setReliability] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId) return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        // Use the single-contact endpoint for efficiency
        const res = await fetch(`/api/contacts/${contactId}`);
        if (res.ok) {
          const foundContact: Contact = await res.json();
          setContact(foundContact);
          setOrderStatus(foundContact.orderStatus || "New");
          setNotes(foundContact.notes || "");
          setTotalSpent(foundContact.totalSpent || 0);
          setReliability(foundContact.reliability ?? 10);
        } else if (res.status === 404) {
          setContact(null);
        } else {
          console.error('CustomerDetails - API error:', res.status);
        }
      } catch (error) {
        console.error('CustomerDetails - Failed to fetch contact:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [contactId]);

  const updateContact = async (updates: Partial<Contact>) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        toast.success("Updated successfully!");
        setContact(updated);
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.error('CustomerDetails - Update error:', error);
      toast.error("Error updating contact");
    }
  };

  const handleOrderStatusChange = (newStatus: string) => {
    setOrderStatus(newStatus);
    const internalStatus = STATUS_MAP[newStatus as OrderStatusLabel];
    updateContact({
      orderStatus: newStatus,
      status: internalStatus
    });
  };

  const handleNotesBlur = () => {
    if (notes !== contact?.notes) {
      updateContact({ notes });
    }
  };

  const handleTotalSpentBlur = () => {
    if (totalSpent !== contact?.totalSpent) {
      updateContact({ totalSpent });
    }
  };

  const handleReliabilityChange = (value: number) => {
    setReliability(value);
    updateContact({ reliability: value });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-72 items-center justify-center border-l border-border bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex h-screen w-72 items-center justify-center border-l border-border bg-background">
        <p className="text-sm text-muted-foreground">Contact not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-72 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Customer Details
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {/* Profile */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {contact.avatar || contact.name.charAt(0)}
          </div>
          <h3 className="mt-2 text-sm font-semibold text-foreground flex items-center gap-2">
            {contact.name}
            {reliability !== undefined && (
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  reliability >= 8
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : reliability >= 4
                      ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                )}
              />
            )}
          </h3>
          <p className="text-xs text-muted-foreground">{contact.phone}</p>
        </div>

        <Separator className="my-4" />

        {/* Order Status */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            Order Status
          </label>
          <div className="relative">
            <select
              value={orderStatus}
              onChange={(e) => handleOrderStatusChange(e.target.value)}
              className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {orderStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Reliability Score */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Reliability Score (1-10)</span>
            <span className={cn(
              "font-bold",
              reliability >= 8 ? "text-emerald-600" : reliability >= 4 ? "text-amber-600" : "text-rose-600"
            )}>{reliability}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={reliability}
            onChange={(e) => setReliability(parseInt(e.target.value))}
            onMouseUp={(e) => handleReliabilityChange(parseInt((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => handleReliabilityChange(parseInt((e.target as HTMLInputElement).value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
            <span>Risk 🔴</span>
            <span>Yellow 🟡</span>
            <span>Safe 🟢</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Total Spent */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            Total Spent
          </label>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
            <input
              type="number"
              value={totalSpent}
              onChange={(e) => setTotalSpent(Number(e.target.value))}
              onBlur={handleTotalSpentBlur}
              className="w-full bg-transparent text-xl font-bold text-foreground focus:outline-none"
              min="0"
              step="0.01"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">MAD</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Notes */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <StickyNote className="h-3.5 w-3.5" />
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add notes about this customer..."
            rows={4}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <Separator className="my-4" />

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {["Regular", "WhatsApp", "Casablanca"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Client Timeline */}
        <div className="space-y-4 pb-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Client Timeline</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary/20">View All</span>
          </label>
          <div className="relative border-l-2 border-border ml-2 pl-4 py-1 space-y-5">
             <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                <p className="text-xs font-semibold text-foreground">Order completed & paid</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Today at 14:30</p>
             </div>
             <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                <p className="text-xs font-semibold text-foreground">Claimed by Agent</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Yesterday at 09:15</p>
             </div>
             <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-background" />
                <p className="text-xs font-semibold text-foreground">Flagged High Intent</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Yesterday at 09:10</p>
             </div>
             <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-muted border-2 border-background" />
                <p className="text-xs font-semibold text-foreground">Conversation started</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Jun 12, 2026</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
