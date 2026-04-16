import { useState, useEffect, useRef } from "react";
import { Send, Phone, MoreVertical, Search, ExternalLink, ShieldCheck, Clock, UserCheck, Bot, Video, Paperclip, Smile, Zap, DollarSign, MapPin, CheckCircle2, FileText, ChevronDown, X, BookTemplate, Plus, Trash2 } from "lucide-react";
import { REVERSE_STATUS_MAP, InternalStatus } from "@/utils/statusUtils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { io } from "socket.io-client";

interface ActiveChatProps {
  contactId: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  timestamp: string;
  unread: number;
  status: "new-order" | "pending" | "preparing" | "delivered" | "paid";
  totalSpent: number;
  isAiActive?: boolean;
  assignedTo?: { id: number; name: string; email: string };
}

interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentName?: string;
}

export function ActiveChat({ contactId }: ActiveChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  // Message search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Templates
  const [templates, setTemplates] = useState<{ id: number; title: string; body: string }[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");

  useEffect(() => {
    fetch('/api/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setTeamMembers(data) : setTeamMembers([]))
      .catch(console.error);
  }, []);

  const fetchTemplates = () => {
    fetch('/api/templates', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setTemplates(data) : [])
      .catch(console.error);
  };

  useEffect(() => { fetchTemplates(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!contactId) return;

    const fetchContact = async () => {
      try {
        const res = await fetch(`/api/contacts/${contactId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setContact(data);
          if (data.unread > 0) {
            await fetch(`/api/contacts/${contactId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              },
              body: JSON.stringify({ unread: 0 })
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch contact details', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${contactId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchContact();
    fetchMessages();

    // Connect to Socket.IO server using environment override for prod
    const env = (import.meta as any).env || {};
    const socketIoUrl = env.VITE_SOCKET_IO_URL || 'http://localhost:3000';
    const socket = io(socketIoUrl, {
      auth: { token: localStorage.getItem('authToken') ?? '' },
      path: '/socket.io'
    });

    socket.on('newMessage', (newMessage: Message & { contactId: string }) => {
      if (newMessage.contactId === contactId && !newMessage.sent) {
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [contactId]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      text: inputValue.trim(),
      sent: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    const textToSend = inputValue.trim();
    setInputValue("");

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          text: textToSend,
          contactId: contactId
        })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? newMessage : m))
        );
        // Turn off AI locally for UI consistency since manually responding
        setContact(prev => prev ? { ...prev, isAiActive: false } : null);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        toast.error("Failed to send message");
      }
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      toast.error("Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.info(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/messages/${contactId}/upload`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!res.ok) throw new Error();
      toast.success("File uploaded and sent!");
    } catch {
      toast.error("Failed to upload file");
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const toggleAi = async () => {
    if (!contact) return;
    try {
      const newState = !(contact.isAiActive ?? true);
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ isAiActive: newState })
      });
      if (res.ok) {
        setContact(prev => prev ? { ...prev, isAiActive: newState } : null);
        toast.success(`"Karima" AI Auto-reply ${newState ? 'Activated' : 'Paused'}`);
      }
    } catch (e) {
      toast.error('Failed to toggle AI state');
    }
  };

  const handleClaim = async () => {
    try {
      const res = await fetch(`/api/contacts/${contactId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const updated = await res.json();
        setContact(updated);
        toast.success('Conversation claimed!');
      } else {
        toast.error('Failed to claim conversation');
      }
    } catch (e) {
      toast.error('Error claiming conversation');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleUnclaim = async () => {
    setShowAssignMenu(false);
    try {
      const res = await fetch(`/api/contacts/${contactId}/unclaim`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setContact(updated);
        toast.success('Conversation returned to pool.');
      }
    } catch (e) { toast.error('Error unclaiming'); }
  };

  const handleReassign = async (userId: number) => {
    setShowAssignMenu(false);
    try {
      const res = await fetch(`/api/contacts/${contactId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const updated = await res.json();
        setContact(updated);
        toast.success('Conversation reassigned.');
      }
    } catch (e) { toast.error('Error reassigning'); }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Gha nchof l'mohadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            {contact.avatar || contact.name.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-card-foreground">
              {contact.name || "Loading..."}
            </h2>
            <p className="text-xs text-muted-foreground">
              {contact.phone || ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!contact.assignedTo && (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              title="Assign this conversation to yourself"
            >
              <UserCheck className="h-4 w-4" />
              Claim
            </button>
          )}
          {contact.assignedTo && (
            <div className="relative">
              <button
                onClick={() => setShowAssignMenu(!showAssignMenu)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-surface-hover border border-border px-3 py-1.5 rounded-full transition-colors"
                title="Manage Assignment"
              >
                <span>Assigned: <span className="font-semibold text-foreground">{contact.assignedTo.name}</span></span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showAssignMenu && (
                <div className="absolute top-10 right-0 w-48 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden text-sm">
                  <div className="p-2 border-b border-border bg-muted/20">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Actions</p>
                    <button onClick={handleUnclaim} className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted text-rose-500 font-medium transition-colors">Return to Pool</button>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Reassign To</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 scrollbar-thin">
                      {teamMembers.map(member => (
                        <button key={member.id} onClick={() => handleReassign(member.id)} className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted font-medium transition-colors">
                          {member.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={toggleAi}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors",
              (contact.isAiActive ?? true)
                ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                : "bg-muted border-border text-muted-foreground hover:bg-secondary"
            )}
            title="Toggle AI Auto-Reply"
          >
            <Bot className="h-4 w-4" />
            {contact.isAiActive ?? true ? "AI: Active" : "AI: Paused"}
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground">
            <Video className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              Ba9i hta mssg. Bda lhadra!
            </div>
          )}
          {(() => {
            const filtered = searchQuery ? messages.filter(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase())) : messages;
            if (searchQuery && filtered.length === 0) return (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                No messages matching "<span className="font-medium text-foreground">{searchQuery}</span>"
              </div>
            );
            return filtered;
          })().map?.((msg: any) => (
            <div
              key={msg.id}
              className={cn(
                "flex animate-slide-in",
                msg.sent ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-3.5 py-2",
                  msg.sent
                    ? "rounded-br-md bg-chat-sent text-chat-sent-foreground"
                    : "rounded-bl-md bg-chat-received text-chat-received-foreground"
                )}
              >
                {msg.attachmentUrl ? (
                  <div className="mb-2 max-w-[200px] overflow-hidden rounded-md border border-border/50">
                    {msg.attachmentType?.startsWith('image/') ? (
                      <img src={`/api/uploads/${msg.attachmentUrl.split('/').pop()}`} alt={msg.attachmentName} className="rounded-md w-full h-auto object-cover" />
                    ) : msg.attachmentType?.startsWith('video/') ? (
                      <video src={`/api/uploads/${msg.attachmentUrl.split('/').pop()}`} controls className="w-full h-auto" />
                    ) : (
                      <a href={`/api/uploads/${msg.attachmentUrl.split('/').pop()}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black/10 p-2 rounded-md hover:bg-black/20 transition-colors">
                        <span className="truncate max-w-[150px] text-xs font-semibold">{msg.attachmentName || "View File"}</span>
                      </a>
                    )}
                  </div>
                ) : null}
                {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    msg.sent ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies / Templates System */}
      <div className="border-t border-border px-4 py-2 bg-muted/20">
        <div className="flex items-center gap-2 mb-2">
          {/* Static Quick Actions */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 flex-1">
            <div className="flex items-center gap-1.5 shrink-0 bg-background border border-border px-2 py-1 rounded-md mr-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick</span>
            </div>
            {[
              { id: 'pricing', label: "Pricing", icon: DollarSign, text: "The price of this product is 199 MAD 🚚" },
              { id: 'location', label: "Location", icon: MapPin, text: "We are located in Casablanca, Maarif. Welcome!" },
              { id: 'confirm', label: "Confirm", icon: CheckCircle2, text: "Alright, your order has been registered. We will send it to you tomorrow." },
              { id: 'catalog', label: "Catalog", icon: FileText, text: "Here is our catalog: https://waslamenu.com" }
            ].map((action) => (
              <button key={action.id} onClick={() => setInputValue(action.text)}
                className="shrink-0 flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover hover:border-primary/50">
                <action.icon className="h-3.5 w-3.5 text-primary" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Template toggle button */}
          <button onClick={() => setShowTemplates(v => !v)}
            className={cn("shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              showTemplates ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}>
            <FileText className="h-3.5 w-3.5" />
            Templates {templates.length > 0 && `(${templates.length})`}
          </button>

          {/* Search toggle */}
          <button onClick={() => { setSearchOpen(v => !v); setSearchQuery(""); }}
            className={cn("shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              searchOpen ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}>
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Message search bar */}
        {searchOpen && (
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Templates panel */}
        {showTemplates && (
          <div className="mb-2 rounded-xl border border-border bg-background shadow-lg p-3 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Saved Templates</p>
              <button onClick={() => {
                if (!inputValue.trim()) { toast.error("Type a message first to save as template"); return; }
                const title = newTemplateTitle || inputValue.slice(0, 30) + (inputValue.length > 30 ? '…' : '');
                fetch('/api/templates', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }, body: JSON.stringify({ title, body: inputValue }) })
                  .then(res => res.ok ? res.json() : Promise.reject())
                  .then(() => { toast.success("Template saved!"); fetchTemplates(); setNewTemplateTitle(""); })
                  .catch(() => toast.error("Failed to save template"));
              }} className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
                <Plus className="h-3 w-3" /> Save current message
              </button>
            </div>
            {templates.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">No templates yet. Type a message and click "Save current message".</p>
            )}
            {templates.map(t => (
              <div key={t.id} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setInputValue(t.body); setShowTemplates(false); }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{t.body}</p>
                </div>
                <button onClick={e => {
                  e.stopPropagation();
                  fetch(`/api/templates/${t.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } })
                    .then(() => { toast.success("Template deleted"); fetchTemplates(); }).catch(() => toast.error("Failed to delete"));
                }} className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-rose-500 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground" title="Attach File">
            <Paperclip className="h-4 w-4" />
          </button>
          <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*,video/*,application/pdf" />
          <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <Smile className="h-4 w-4" />
          </button>
          <input type="text" placeholder="Kteb hna..." value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            disabled={isSending}
            className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60" />
          <button onClick={handleSend} disabled={isSending || !inputValue.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
