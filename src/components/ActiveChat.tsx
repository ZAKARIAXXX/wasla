import { useState, useEffect, useRef } from "react";
import { Send, Phone, MoreVertical, Search, ExternalLink, ShieldCheck, Clock, UserCheck, Bot, Video, Paperclip, Smile, Zap, DollarSign, MapPin, CheckCircle2, FileText, ChevronDown, X, BookTemplate, Plus, Trash2, Edit2, Check, Copy, TrendingUp } from "lucide-react";
import { REVERSE_STATUS_MAP, InternalStatus, OrderStatusLabel } from "@/utils/statusUtils";
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
  status: InternalStatus;
  totalSpent: number;
  isAiActive?: boolean;
  assignedTo?: { id: number; name: string; email: string };
  reliability?: number;
}

interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentName?: string;
  senderName?: string;
  senderId?: number;
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
  
  // Extra UI State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<{ id: number; title: string; body: string }[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");
  const [typingAgents, setTypingAgents] = useState<Record<number, string>>({});
  const [viewingAgents, setViewingAgents] = useState<Record<number, string>>({});
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

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

    // Socket.IO sync
    const env = (import.meta as any).env || {};
    const socketIoUrl = env.VITE_SOCKET_IO_URL || 'http://localhost:3000';
    const socket = io(socketIoUrl, {
      auth: { token: localStorage.getItem('authToken') ?? '' },
      path: '/socket.io'
    });
    socketRef.current = socket;

    socket.emit('viewing_contact', contactId);

    socket.on('newMessage', (newMessage: Message & { contactId: string }) => {
      if (newMessage.contactId === contactId) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (newMessage.sent && newMessage.senderId === currentUser.id) return;

        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    });

    socket.on('contactUpdated', (updatedContact: Contact) => {
      if (updatedContact.id === contactId) {
        setContact(updatedContact);
      }
    });

    socket.on('teammate_typing', (data: { contactId: string, userId: number, userName: string }) => {
      if (data.contactId === contactId) {
        setTypingAgents(prev => ({ ...prev, [data.userId]: data.userName }));
      }
    });

    socket.on('teammate_stop_typing', (data: { userId: number }) => {
      setTypingAgents(prev => {
        const next = { ...prev };
        delete next[data.userId];
        return next;
      });
    });

    socket.on('teammate_viewing', (data: { contactId: string | null, userId: number, userName: string }) => {
      const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;
      if (data.userId === currentUserId) return;
      
      setViewingAgents(prev => {
        const next = { ...prev };
        if (data.contactId === contactId) {
          next[data.userId] = data.userName;
        } else {
          delete next[data.userId];
        }
        return next;
      });
    });

    return () => {
      socket.emit('viewing_contact', null);
      socket.disconnect();
    };
  }, [contactId]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (socketRef.current && contactId) {
      socketRef.current.emit('typing_start', contactId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing_end', contactId);
      }, 2000);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;
    setIsSending(true);
    const textToSend = inputValue.trim();
    setInputValue("");

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ text: textToSend, contactId: contactId })
      });

      if (!res.ok) toast.error("Failed to send message");
    } catch (error) {
      toast.error("Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`/api/messages/${contactId}/upload`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: formData
      });
      if (!res.ok) throw new Error();
      toast.success("File sent!");
    } catch {
      toast.error("Failed to upload file");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleAi = async () => {
    if (!contact) return;
    try {
      const newState = !contact.isAiActive;
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ isAiActive: newState })
      });
      if (res.ok) toast.success(`AI ${newState ? 'Activated' : 'Paused'}`);
    } catch (e) { toast.error('Failed to toggle AI'); }
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch(`/api/contacts/${contactId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (res.ok) {
        const updated = await res.json();
        // Immediately update local state so the button toggles without waiting for socket
        setContact(prev => prev ? { ...prev, assignedTo: updated.assignedTo } : prev);
        toast.success('Conversation claimed!');
      } else {
        toast.error('Failed to claim conversation');
      }
    } catch (e) {
      toast.error('Error claiming');
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
        // Clear assignedTo so "Claim" button reappears immediately
        setContact(prev => prev ? { ...prev, assignedTo: undefined } : prev);
        toast.success('Returned to pool.');
      } else {
        toast.error('Failed to unclaim');
      }
    } catch (e) {
      toast.error('Error unclaiming');
    }
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
        setContact(prev => prev ? { ...prev, assignedTo: updated.assignedTo } : prev);
        toast.success('Reassigned successfully.');
      } else {
        toast.error('Failed to reassign');
      }
    } catch (e) {
      toast.error('Error reassigning');
    }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 bg-background overflow-hidden relative">
      <div className="flex flex-1 flex-col min-w-0 border-r border-border h-full">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {contact.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">{contact.name}</h2>
              <p className="text-[10px] text-muted-foreground">{contact.phone}</p>
            </div>
            <div className="flex -space-x-1.5 ml-2">
              {Object.entries(viewingAgents).map(([id, name]) => (
                <div key={id} className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center text-[8px] font-bold" title={`${name} is viewing`}>
                  {name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!contact.assignedTo && (
              <button onClick={handleClaim} disabled={isClaiming} className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-sm hover:opacity-90">
                Claim Conversation
              </button>
            )}
            {contact.assignedTo && (
              <div className="relative">
                <button onClick={() => setShowAssignMenu(!showAssignMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted text-xs font-bold text-muted-foreground hover:bg-muted/80">
                  Claimed <ChevronDown className="h-3 w-3" />
                </button>
                {showAssignMenu && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-50 p-1">
                    <button onClick={handleUnclaim} className="w-full text-left px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 rounded-lg">Unclaim</button>
                    {teamMembers.filter(m => m.id !== contact.assignedTo?.id).map(m => (
                      <button key={m.id} onClick={() => handleReassign(m.id)} className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted rounded-lg">{m.name}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setShowContactDetails(!showContactDetails)} className={cn("p-2 rounded-lg transition-colors", showContactDetails ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] rounded-2xl px-3 py-2 shadow-sm", msg.sent ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none")}>
                {msg.senderName && msg.sent && <p className="text-[9px] font-bold opacity-70 mb-0.5">{msg.senderName}</p>}
                {msg.attachmentUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                    <img src={`/api/uploads/${msg.attachmentUrl.split('/').pop()}`} className="max-w-[240px] h-auto block" />
                  </div>
                )}
                <p className="text-sm leading-snug">{msg.text}</p>
                <p className="text-[9px] mt-1 opacity-60 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Replies */}
        <div className="border-t border-border p-4 bg-muted/10 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { label: "Pricing", text: "The product is 199 MAD" },
              { label: "Location", text: "We are in Casablanca" },
              { label: "Confirm", text: "Order confirmed!" }
            ].map(b => (
              <button key={b.label} onClick={() => setInputValue(b.text)} className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-card text-[10px] font-bold hover:border-primary transition-colors">
                {b.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Paperclip className="h-5 w-5" /></button>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
            <input
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Send a message..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button onClick={handleSend} disabled={!inputValue.trim()} className="p-2.5 bg-primary text-white rounded-xl shadow-md disabled:opacity-50"><Send className="h-5 w-5" /></button>
          </div>
        </div>
      </div>

      {/* Side Panel (Overlay transition) */}
      <div 
        className={cn(
          "h-full border-l border-border bg-card overflow-y-auto transition-all duration-300 absolute right-0 top-0 bottom-0 z-40 shadow-2xl",
          showContactDetails ? "w-80 translate-x-0" : "w-0 translate-x-full"
        )}
      >
        <div className="w-80 p-5 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lead Bio</h3>
            <button onClick={() => setShowContactDetails(false)}><X className="h-4 w-4" /></button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">{contact.name.charAt(0)}</div>
            <div className="text-center group">
              {editingName ? (
                <input 
                  autoFocus 
                  value={editNameValue} 
                  onChange={e => setEditNameValue(e.target.value)} 
                  onBlur={() => setEditingName(false)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter') {
                       await fetch(`/api/contacts/${contactId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }, body: JSON.stringify({ name: editNameValue }) });
                       setContact(c => c ? { ...c, name: editNameValue } : c);
                       setEditingName(false);
                    }
                  }}
                  className="bg-transparent border-b border-primary text-center focus:outline-none" 
                />
              ) : (
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setEditNameValue(contact.name); setEditingName(true); }}>
                  <p className="font-bold">{contact.name}</p>
                  <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                </div>
              )}
              <p className="text-xs text-muted-foreground">{contact.phone}</p>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground mb-3 block px-1">Pipeline State</label>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.entries(REVERSE_STATUS_MAP) as [InternalStatus, OrderStatusLabel][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={async () => {
                    const res = await fetch(`/api/contacts/${contactId}/move`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                      body: JSON.stringify({ status: val })
                    });
                    if (res.ok) toast.success(`Moved to ${label}`);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                    contact.status === val ? "bg-primary/10 border-primary/40 text-primary shadow-sm" : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {label}
                  {contact.status === val && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
              <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Spent</p>
              <p className="text-xs font-bold">{contact.totalSpent} MAD</p>
            </div>
            <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
              <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Reliability</p>
              <p className="text-xs font-bold">{contact.reliability || 10}/10</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 rounded-2xl border border-border">
                <div className="flex items-center gap-3">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">AI Auto-pilot</span>
                </div>
                <button onClick={toggleAi} className={cn("px-3 py-1 rounded-full text-[9px] font-bold", contact.isAiActive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground")}>
                  {contact.isAiActive ? "ACTIVE" : "PAUSED"}
                </button>
             </div>
             <a href={`https://wa.me/${contact.phone}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 rounded-2xl text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
               <Phone className="h-4 w-4" /> WhatsApp CRM Chat
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
