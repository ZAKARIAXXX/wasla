import { useState, useEffect, useRef } from "react";
import { BookOpen, FolderUp, Save, Upload, Link, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function KnowledgeBaseView() {
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("https://n8n.your-server.com/webhook/knowledge-upload");
  const [textData, setTextData] = useState("");
  const [docs, setDocs] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/knowledge', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
      if(res.ok) setDocs(await res.json());
    } catch {}
  };

  const handleTextSync = async () => {
    if (!textData.trim()) return toast.error("Please add text first!");
    toast.info("Saving knowledge...");
    try {
      const res = await fetch('/api/knowledge/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ title: `Text Snippet - ${new Date().toLocaleDateString()}`, content: textData })
      });
      if(res.ok) {
         toast.success("Saved dynamically!");
         setTextData("");
         fetchDocs();
         
         // Trigger N8N sync side-effect safely
         fetch(n8nWebhookUrl, { method: "POST", body: JSON.stringify({ type: "text", content: textData }) }).catch(()=>null);
      }
    } catch { toast.error("Failed to save text."); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: formData
      });
      if(res.ok) {
         toast.success("Document uploaded!");
         fetchDocs();
         fetch(n8nWebhookUrl, { method: "POST", body: JSON.stringify({ type: "file", filename: file.name }) }).catch(()=>null);
      }
    } catch { toast.error("Failed to upload."); }
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      toast.success("Deleted");
      fetchDocs();
    } catch {}
  };

  return (
    <div className="flex h-screen flex-1 flex-col bg-background/50 p-8 overflow-y-auto scrollbar-thin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Business Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">Train your AI Sales Assistant with pricing, policies, and services.</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-border shadow-sm w-96">
          <input
            type="text"
            value={n8nWebhookUrl}
            onChange={(e) => setN8nWebhookUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs outline-none text-foreground px-2"
            placeholder="N8N Vector Sync Webhook..."
          />
          <button onClick={() => toast.success("Saved")} className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors">
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 h-full pb-8">
        <div className="col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col flex-1">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                   <BookOpen className="h-4 w-4 text-primary" /> Plain Text Knowledge
                </h3>
                <button onClick={handleTextSync} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity">
                    Save to DB & Sync
                </button>
             </div>
             <textarea 
                className="w-full flex-1 rounded-xl bg-muted/50 p-4 text-sm text-foreground placeholder:text-muted-foreground border-none resize-none focus:ring-1 focus:ring-primary outline-none"
                placeholder="Type or paste your company's refund policies, service details, operating hours, prices..."
                value={textData}
                onChange={e => setTextData(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept=".pdf,.txt,.xml,.csv,.docx" />
             <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border bg-card/50 hover:bg-surface-hover hover:border-primary/50 transition-all group">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                   <Upload className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm text-foreground">Upload Document</span>
                <span className="text-xs text-muted-foreground mt-1">PDF, Word, or CSV lists</span>
             </button>
             <button onClick={()=>toast.info("Scraper not configured.")} className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border bg-card/50 hover:bg-surface-hover hover:border-primary/50 transition-all group">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                   <Link className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm text-foreground">Scrape Website</span>
                <span className="text-xs text-muted-foreground mt-1">Enter a URL to extract data</span>
             </button>
          </div>
        </div>

        <div className="col-span-1 rounded-2xl border border-border bg-card shadow-sm p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border bg-muted/20">
                <h3 className="font-semibold text-foreground">Active Knowledge</h3>
                <p className="text-xs text-muted-foreground mt-1">Files currently inside the DB.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {docs.length === 0 ? <p className="text-sm p-4 text-center text-muted-foreground">No documents uploaded.</p> : docs.map((doc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <FolderUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground truncate">{doc.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                           <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-semibold">{doc.type}</span>
                           <button onClick={() => handleDelete(doc.id)} className="text-rose-500 hover:text-rose-600 transition-colors p-1"><Trash2 className="h-3 w-3" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
