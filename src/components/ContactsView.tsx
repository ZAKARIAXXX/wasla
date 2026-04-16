import { useState, useEffect, useRef } from "react";
import { Search, Plus, MoreHorizontal, Phone, Download, Upload, RefreshCw, Edit, Tag, Trash2, CheckSquare, Square, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { REVERSE_STATUS_MAP } from "@/utils/statusUtils";

interface TagType { id: number; name: string; color: string; }
interface Contact {
    id: string;
    name: string;
    phone: string;
    status: string;
    orderStatus?: string;
    totalSpent: number;
    timestamp: string;
    reliability: number;
    tags?: { tag: TagType }[];
}

const TAG_COLORS = ["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#8b5cf6","#14b8a6"];

function getRiskColor(reliability: number) {
    if (reliability >= 7) return "bg-emerald-500";
    if (reliability >= 4) return "bg-amber-500";
    return "bg-rose-500";
}

export function ContactsView() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTag, setFilterTag] = useState<number | null>(null);
    const [allTags, setAllTags] = useState<TagType[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [newContact, setNewContact] = useState({ name: "", phone: "" });
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const authHeaders = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 'Content-Type': 'application/json' };

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/contacts', { headers: authHeaders });
            if (res.ok) setContacts(await res.json());
        } catch { toast.error("Failed to fetch contacts"); }
        finally { setIsLoading(false); }
    };

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/tags', { headers: authHeaders });
            if (res.ok) setAllTags(await res.json());
        } catch {}
    };

    useEffect(() => { fetchContacts(); fetchTags(); }, []);

    // ── Filtering ──
    const filteredContacts = contacts.filter(c => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
        const matchesTag = !filterTag || c.tags?.some(t => t.tag.id === filterTag);
        return matchesSearch && matchesTag;
    });

    // ── Selection ──
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredContacts.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    };

    // ── CRUD ──
    const handleAddContact = async () => {
        if (!newContact.name.trim() || !newContact.phone.trim()) return;
        try {
            const res = await fetch('/api/contacts', { method: 'POST', headers: authHeaders, body: JSON.stringify(newContact) });
            if (res.ok) { toast.success("Contact added!"); setIsAddDialogOpen(false); setNewContact({ name: "", phone: "" }); fetchContacts(); }
            else toast.error("Failed to add contact");
        } catch { toast.error("Error adding contact"); }
    };

    const handleEditSave = async () => {
        if (!editingContact) return;
        try {
            const res = await fetch(`/api/contacts/${editingContact.id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify({ name: editingContact.name, phone: editingContact.phone, totalSpent: editingContact.totalSpent }) });
            if (res.ok) { toast.success("Contact updated"); setIsEditDialogOpen(false); fetchContacts(); }
            else toast.error("Failed to update");
        } catch { toast.error("Error updating"); }
    };

    const deleteContact = async (id: string) => {
        try {
            const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE', headers: authHeaders });
            if (res.ok) { setContacts(c => c.filter(x => x.id !== id)); toast.success("Contact deleted"); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting contact"); }
    };

    // ── Bulk Actions ──
    const bulkDelete = async () => {
        const ids = Array.from(selectedIds);
        try {
            await fetch('/api/tags/bulk-delete', { method: 'POST', headers: authHeaders, body: JSON.stringify({ contactIds: ids }) });
            setContacts(c => c.filter(x => !selectedIds.has(x.id)));
            setSelectedIds(new Set());
            toast.success(`${ids.length} contacts deleted`);
        } catch { toast.error("Bulk delete failed"); }
    };

    const bulkAddTag = async (tagId: number) => {
        const ids = Array.from(selectedIds);
        try {
            await fetch('/api/tags/bulk', { method: 'POST', headers: authHeaders, body: JSON.stringify({ contactIds: ids, tagId }) });
            toast.success(`Tag applied to ${ids.length} contacts`);
            setSelectedIds(new Set());
            fetchContacts();
        } catch { toast.error("Bulk tag failed"); }
    };

    // ── Tag Management ──
    const createTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const res = await fetch('/api/tags', { method: 'POST', headers: authHeaders, body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }) });
            if (res.ok) { toast.success("Tag created"); setNewTagName(""); fetchTags(); }
            else { const d = await res.json(); toast.error(d.error || "Failed"); }
        } catch { toast.error("Error creating tag"); }
    };

    const deleteTag = async (id: number) => {
        try {
            await fetch(`/api/tags/${id}`, { method: 'DELETE', headers: authHeaders });
            toast.success("Tag deleted"); fetchTags(); fetchContacts();
        } catch { toast.error("Error deleting tag"); }
    };

    const toggleContactTag = async (contactId: string, tagId: number, hasTag: boolean) => {
        const url = `/api/tags/contact/${contactId}/${tagId}`;
        try {
            await fetch(url, { method: hasTag ? 'DELETE' : 'POST', headers: authHeaders });
            fetchContacts();
        } catch { toast.error("Failed to update tag"); }
    };

    // ── CSV ──
    const handleExport = () => { window.location.href = '/api/contacts/export'; };
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const lines = text.split('\n').slice(1).filter(l => l.trim());
        const contactsData = lines.map(line => {
            const [, name, phone, email, status, totalSpent] = line.split(',');
            return { name: name?.replace(/"/g, '') || '', phone: phone?.replace(/"/g, '') || '', email: email?.replace(/"/g, ''), status: status?.replace(/"/g, '') || 'new-order', totalSpent: parseFloat(totalSpent) || 0 };
        }).filter(c => c.name && c.phone);
        try {
            const res = await fetch('/api/contacts/import', { method: 'POST', headers: authHeaders, body: JSON.stringify({ contacts: contactsData }) });
            if (res.ok) { toast.success("Contacts imported!"); fetchContacts(); }
        } catch { toast.error("Import failed"); }
    };

    const anySelected = selectedIds.size > 0;

    return (
        <div className="flex-1 h-full p-8 overflow-y-auto bg-surface/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                    <p className="text-muted-foreground mt-1">{contacts.length} contacts · {filteredContacts.length} shown</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="file" hidden accept=".csv" ref={fileInputRef} onChange={handleImport} />
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5" /> Import
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                        <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsManageTagsOpen(true)} className="gap-2">
                        <Tag className="h-3.5 w-3.5" /> Manage Tags
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <Plus className="h-3.5 w-3.5" /> Add Contact
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Contact</DialogTitle>
                                <DialogDescription>Enter contact details.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2"><Label>Name</Label><Input placeholder="John Doe" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} /></div>
                                <div className="grid gap-2"><Label>Phone</Label><Input placeholder="+212 6..." value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} /></div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddContact} disabled={!newContact.name.trim() || !newContact.phone.trim()}>Add Contact</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                        <DialogDescription>Update details for {editingContact?.name}.</DialogDescription>
                    </DialogHeader>
                    {editingContact && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2"><Label>Name</Label><Input value={editingContact.name} onChange={e => setEditingContact({ ...editingContact, name: e.target.value })} /></div>
                            <div className="grid gap-2"><Label>Phone</Label><Input value={editingContact.phone} onChange={e => setEditingContact({ ...editingContact, phone: e.target.value })} /></div>
                            <div className="grid gap-2"><Label>Total Spent (MAD)</Label><Input type="number" value={editingContact.totalSpent} onChange={e => setEditingContact({ ...editingContact, totalSpent: Number(e.target.value) })} /></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSave} className="bg-primary text-primary-foreground">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Tags Dialog */}
            <Dialog open={isManageTagsOpen} onOpenChange={setIsManageTagsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Manage Tags</DialogTitle>
                        <DialogDescription>Create and delete contact tags.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="flex gap-2">
                            <Input placeholder="Tag name..." value={newTagName} onChange={e => setNewTagName(e.target.value)} className="flex-1" onKeyDown={e => e.key === 'Enter' && createTag()} />
                            <Button onClick={createTag} size="sm">Create</Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {TAG_COLORS.map(c => (
                                <button key={c} onClick={() => setNewTagColor(c)} className={`h-6 w-6 rounded-full border-2 transition-all ${newTagColor === c ? 'border-foreground scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto">
                            {allTags.map(tag => (
                                <div key={tag.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                        <span className="text-sm font-medium">{tag.name}</span>
                                    </div>
                                    <button onClick={() => deleteTag(tag.id)} className="text-muted-foreground hover:text-rose-500 transition-colors p-1 rounded">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                            {allTags.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tags yet.</p>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Search & Tag Filter bar */}
            <div className="mb-4 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search contacts..." className="pl-9 bg-background/50" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>

                {/* Tag filter pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button onClick={() => setFilterTag(null)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${!filterTag ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}>
                        All
                    </button>
                    {allTags.map(tag => (
                        <button key={tag.id} onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filterTag === tag.id ? 'text-white border-transparent' : 'bg-background text-foreground border-border hover:opacity-80'}`}
                            style={filterTag === tag.id ? { backgroundColor: tag.color, borderColor: tag.color } : {}}>
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: filterTag === tag.id ? 'white' : tag.color }} />
                            {tag.name}
                        </button>
                    ))}
                </div>

                <Button variant="outline" size="sm" onClick={fetchContacts} className="gap-2 ml-auto">
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {/* Bulk Action Toolbar */}
            <AnimatePresence>
                {anySelected && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="mb-3 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
                        <span className="text-sm font-semibold text-primary">{selectedIds.size} selected</span>
                        <div className="flex items-center gap-2 ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1.5 h-8">
                                        <Tag className="h-3.5 w-3.5" /> Add Tag <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {allTags.length === 0 && <DropdownMenuItem disabled>No tags — create some first</DropdownMenuItem>}
                                    {allTags.map(tag => (
                                        <DropdownMenuItem key={tag.id} onClick={() => bulkAddTag(tag.id)}>
                                            <span className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                                            {tag.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-rose-500 border-rose-500/30 hover:bg-rose-500/10" onClick={bulkDelete}>
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                            </Button>
                            <button onClick={() => setSelectedIds(new Set())} className="p-1 rounded hover:bg-muted transitions-colors">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-10">
                                <button onClick={toggleSelectAll} className="text-muted-foreground hover:text-foreground transition-colors">
                                    {selectedIds.size === filteredContacts.length && filteredContacts.length > 0
                                        ? <CheckSquare className="h-4 w-4 text-primary" />
                                        : <Square className="h-4 w-4" />}
                                </button>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Spent</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredContacts.map((contact, idx) => {
                            const isSelected = selectedIds.has(contact.id);
                            const contactTags = contact.tags?.map(t => t.tag) || [];
                            return (
                                <motion.tr key={contact.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                                    className={`group border-b border-border/40 hover:bg-muted/20 transition-colors cursor-default ${isSelected ? 'bg-primary/5' : ''}`}>
                                    <TableCell className="w-10">
                                        <button onClick={() => toggleSelect(contact.id)} className="text-muted-foreground hover:text-primary transition-colors">
                                            {isSelected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 opacity-0 group-hover:opacity-100" />}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${getRiskColor(contact.reliability ?? 10)}`} />
                                            </div>
                                            <span className="font-medium text-sm text-foreground">{contact.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                                            {contactTags.slice(0, 3).map(tag => (
                                                <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: tag.color }}>
                                                    {tag.name}
                                                </span>
                                            ))}
                                            {contactTags.length > 3 && <span className="text-[10px] text-muted-foreground">+{contactTags.length - 3}</span>}
                                            {/* Quick-add tag */}
                                            {allTags.length > 0 && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                                                            + tag
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-40">
                                                        {allTags.map(tag => {
                                                            const has = contactTags.some(t => t.id === tag.id);
                                                            return (
                                                                <DropdownMenuItem key={tag.id} onClick={() => toggleContactTag(contact.id, tag.id, has)}
                                                                    className={has ? 'opacity-50' : ''}>
                                                                    <span className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                                                                    {tag.name}
                                                                    {has && <span className="ml-auto text-[10px] text-muted-foreground">remove</span>}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize text-xs">
                                            {contact.orderStatus || REVERSE_STATUS_MAP[contact.status] || contact.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3" /> {contact.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-foreground">{contact.totalSpent.toLocaleString()} MAD</span>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        {new Date(contact.timestamp).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingContact(contact); setIsEditDialogOpen(true); }}>
                                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => deleteContact(contact.id)} className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </motion.tr>
                            );
                        })}
                        {isLoading && Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={`skel-${i}`} className="animate-pulse">
                                <TableCell><div className="h-4 w-4 rounded bg-muted" /></TableCell>
                                <TableCell><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-muted" /><div className="h-3 w-28 rounded bg-muted" /></div></TableCell>
                                <TableCell><div className="h-5 w-16 rounded-full bg-muted" /></TableCell>
                                <TableCell><div className="h-5 w-20 rounded-full bg-muted" /></TableCell>
                                <TableCell><div className="h-3 w-28 rounded bg-muted" /></TableCell>
                                <TableCell><div className="h-3 w-16 rounded bg-muted" /></TableCell>
                                <TableCell><div className="h-3 w-20 rounded bg-muted ml-auto" /></TableCell>
                                <TableCell />
                            </TableRow>
                        ))}
                        {!isLoading && filteredContacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <div className="p-12 text-center text-muted-foreground">
                                        <Tag className="h-8 w-8 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No contacts found.</p>
                                        <p className="text-sm mt-1">{filterTag ? 'Try a different tag filter.' : 'Add your first contact to get started.'}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
