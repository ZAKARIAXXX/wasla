import React, { useState, useEffect, useRef } from "react";
import {
    CheckCircle2,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Info,
    Shield,
    Zap,
    Phone,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    calculateRiskScore,
    type RiskResult,
    type RiskTier,
    type ContactForRisk,
    type MessageForRisk,
} from "@/utils/riskScoring";
import { useRiskContext } from "@/context/RiskContext";

interface RiskSidePanelProps {
    contactId: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────────
const T: Record<RiskTier, { arc: string; light: string; text: string; bg: string; border: string; pill: string }> = {
    green: { arc: "#10b981", light: "rgba(16,185,129,0.15)", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/60", border: "border-emerald-200 dark:border-emerald-700", pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
    yellow: { arc: "#f59e0b", light: "rgba(245,158,11,0.15)", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/60", border: "border-amber-200 dark:border-amber-700", pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
    red: { arc: "#f43f5e", light: "rgba(244,63,94,0.15)", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/60", border: "border-rose-200 dark:border-rose-700", pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300" },
};

const TIER_LABEL: Record<RiskTier, string> = {
    green: "SAFE TO SHIP",
    yellow: "REVIEW CAREFULLY",
    red: "HIGH RISK",
};

// ─── Score Display (animated number, no chart) ──────────────────────────────────
function ScoreDisplay({
    score,
    tier,
    animKey,
}: {
    score: number;
    tier: RiskTier;
    animKey: string;
}) {
    const [animScore, setAnimScore] = useState(0);

    useEffect(() => {
        setAnimScore(0);
        const start = performance.now();
        const dur = 900;
        const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 4);
            setAnimScore(Math.round(score * ease));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [animKey, score]);

    return (
        <div className="flex flex-col items-center py-10">
            <span
                className={cn("text-8xl font-black tabular-nums leading-none transition-colors duration-300", T[tier].text)}
                aria-label={`Risk score ${score} out of 100`}
            >
                {animScore}
            </span>
            <span className="mt-2 text-sm font-medium text-muted-foreground">/ 100</span>
            <span className={cn("mt-4 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full px-4 py-1.5", T[tier].pill)}>
                {TIER_LABEL[tier]}
            </span>
        </div>
    );
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────────
function ConfidenceBar({
    confidence,
    dataSignals,
    tier,
    animKey,
}: {
    confidence: number;
    dataSignals: number;
    tier: RiskTier;
    animKey: string;
}) {
    const [w, setW] = useState(0);
    useEffect(() => {
        setW(0);
        const t = setTimeout(() => setW(confidence), 200);
        return () => clearTimeout(t);
    }, [animKey, confidence]);

    return (
        <div className="px-5 pb-4">
            <div className="rounded-xl bg-muted/40 p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Confidence Level</span>
                    <span className={cn("text-sm font-bold", T[tier].text)}>{confidence}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${w}%`, background: `linear-gradient(90deg, ${T[tier].arc}99, ${T[tier].arc})` }}
                    />
                </div>
                <p className="text-[10px] text-muted-foreground">
                    Based on <span className="font-semibold">{dataSignals}</span> analyzed signal{dataSignals !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}

// ─── Factor Row ───────────────────────────────────────────────────────────────────
function FactorRow({
    label, points, detail, tooltip, index, positive,
}: {
    label: string; points: number; detail: string; tooltip: string; index: number; positive: boolean;
}) {
    const [tip, setTip] = useState(false);
    return (
        <div
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-help relative"
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
            role="listitem"
        >
            {positive
                ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                : <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">{label}</span>
                    <span className={cn(
                        "text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums",
                        positive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                    )}>
                        {points > 0 ? "+" : ""}{points} pts
                    </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{detail}</p>
            </div>
            <Info className="h-3 w-3 text-muted-foreground/40 shrink-0 mt-1" />
            {tip && (
                <div className="absolute bottom-full left-0 mb-2 z-50 w-60 rounded-xl bg-popover border border-border shadow-xl px-3 py-2.5 text-xs text-popover-foreground pointer-events-none leading-relaxed">
                    {tooltip}
                </div>
            )}
        </div>
    );
}

// ─── Collapsible Section ──────────────────────────────────────────────────────────
function FactorSection({
    title, icon, factors, positive, defaultOpen,
}: {
    title: string;
    icon: React.ReactNode;
    factors: { label: string; points: number; detail: string; tooltip: string }[];
    positive: boolean;
    defaultOpen: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    if (factors.length === 0) return null;
    const total = factors.reduce((s, f) => s + f.points, 0);
    return (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
            <button
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                {icon}
                <span className="flex-1 text-xs font-semibold text-foreground">{title}</span>
                <span className={cn(
                    "text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums mr-1",
                    positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                    {total > 0 ? "+" : ""}{total}
                </span>
                {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
            {open && (
                <div className="border-t border-border/40 px-1 py-1 space-y-0.5" role="list">
                    {factors.map((f, i) => (
                        <FactorRow key={f.label} {...f} index={i} positive={positive} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────────
function RecommendationCard({
    result, contactId, onUpdate,
}: {
    result: RiskResult; contactId: string; onUpdate: () => void;
}) {
    const [busy, setBusy] = useState<string | null>(null);
    const { recommendation: rec, tier } = result;
    const theme = T[tier];

    const statusMap: Record<string, string> = {
        "Confirm Order": "Paid",
        "Cancel Order": "Pending",
        "Request Prepayment": "Pending",
        "Request Verification": "Pending",
        "Call Customer": "Pending",
        "Send Verification Message": "Preparing",
    };

    const act = async (label: string) => {
        setBusy(label);
        try {
            const r = await fetch(`/api/contacts/${contactId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: statusMap[label] ?? "Pending" }),
            });
            if (r.ok) {
                toast.success(label, { description: `Status → ${statusMap[label] ?? "Pending"}` });
                onUpdate();
            } else toast.error("Update failed");
        } catch { toast.error("Network error"); }
        finally { setBusy(null); }
    };

    const Icon = tier === "green" ? Shield : tier === "yellow" ? Zap : AlertTriangle;

    return (
        <div className={cn("rounded-2xl border-2 p-4", theme.bg, theme.border)}>
            <div className={cn("flex items-center gap-2 text-sm font-bold mb-2", theme.text)}>
                <Icon className="h-4 w-4 shrink-0" />
                {rec.header}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{rec.body}</p>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => act(rec.primaryAction)}
                    disabled={!!busy}
                    className={cn(
                        "rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-50",
                        tier === "green" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-emerald-900 shadow-md"
                            : tier === "yellow" ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200 dark:shadow-amber-900 shadow-md"
                                : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-rose-900 shadow-md"
                    )}
                >
                    {busy === rec.primaryAction ? "···" : rec.primaryAction}
                </button>
                <button
                    onClick={() => act(rec.secondaryAction)}
                    disabled={!!busy}
                    className={cn(
                        "rounded-xl py-2.5 text-xs font-bold border-2 bg-background hover:bg-muted transition-all active:scale-95 disabled:opacity-50",
                        theme.border, theme.text
                    )}
                >
                    {busy === rec.secondaryAction ? "···" : rec.secondaryAction}
                </button>
            </div>
        </div>
    );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────────
export function RiskSidePanel({ contactId }: RiskSidePanelProps) {
    const [contact, setContact] = useState<ContactForRisk | null>(null);
    const [result, setResult] = useState<RiskResult | null>(null);
    const [loading, setLoading] = useState(true);
    const animKeyRef = useRef(0);
    const { setTier } = useRiskContext();

    const load = async () => {
        try {
            const [cr, mr] = await Promise.all([
                fetch(`/api/contacts/${contactId}`),
                fetch(`/api/messages/${contactId}`),
            ]);
            if (cr.ok) {
                const c: ContactForRisk = await cr.json();
                const msgs: MessageForRisk[] = mr.ok ? await mr.json() : [];
                const scored = calculateRiskScore(c, msgs);
                setContact(c);
                animKeyRef.current += 1;
                setResult(scored);
                // publish the authoritative tier so ChatList dots stay in sync
                setTier(contactId, scored.tier);

            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setResult(null);
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactId]);

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col border-l border-border bg-background items-center justify-center gap-3">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground animate-pulse">Analyzing risk…</p>
            </div>
        );
    }

    if (!contact || !result) {
        return (
            <div className="flex h-full w-full flex-col border-l border-border bg-background items-center justify-center">
                <p className="text-sm text-muted-foreground">Select a contact</p>
            </div>
        );
    }

    const theme = T[result.tier];
    const animKey = `${contactId}-${animKeyRef.current}`;

    return (
        <div className="flex h-full w-full flex-col border-l border-border bg-background overflow-hidden" role="complementary" aria-label="Risk Score Analysis">
            {/* ── Header ── */}
            <div className={cn("border-b border-border px-4 py-3 flex items-center gap-3", theme.bg)}>
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2", theme.border)}>
                    {result.tier === "green" && <Shield className={cn("h-4 w-4", theme.text)} />}
                    {result.tier === "yellow" && <Zap className={cn("h-4 w-4", theme.text)} />}
                    {result.tier === "red" && <AlertTriangle className={cn("h-4 w-4", theme.text)} />}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Risk Analysis</p>
                    <p className="text-sm font-bold text-foreground truncate">{contact.name}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* ── Score ── */}
                <ScoreDisplay score={result.score} tier={result.tier} animKey={animKey} />


                {/* ── Confidence ── */}
                <ConfidenceBar
                    confidence={result.confidence}
                    dataSignals={result.dataSignals}
                    tier={result.tier}
                    animKey={animKey}
                />

                {/* ── Phone chip ── */}
                <div className="px-5 pb-4">
                    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{contact.phone}</span>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="mx-5 border-t border-dashed border-border/50 mb-4" />

                {/* ── Factors ── */}
                <div className="px-5 space-y-2 pb-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Risk Factors</p>
                    <FactorSection
                        title="Positive Signals"
                        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        factors={result.positiveFactors}
                        positive={true}
                        defaultOpen={true}
                    />
                    <FactorSection
                        title="Negative Signals"
                        icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
                        factors={result.negativeFactors}
                        positive={false}
                        defaultOpen={true}
                    />
                    {result.positiveFactors.length === 0 && result.negativeFactors.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-6">Not enough data to analyze signals.</p>
                    )}
                </div>

                {/* ── Divider ── */}
                <div className="mx-5 border-t border-dashed border-border/50 mb-4" />

                {/* ── AI Recommendation ── */}
                <div className="px-5 pb-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">AI Recommendation</p>
                    <RecommendationCard result={result} contactId={contactId} onUpdate={load} />
                </div>

                {/* ── Success Rate ── */}
                <div className="px-5 pb-6">
                    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
                        <TrendingUp className={cn("h-5 w-5", theme.text)} />
                        <div>
                            <p className="text-[10px] text-muted-foreground">Expected success rate</p>
                            <p className={cn("text-xl font-black tabular-nums", theme.text)}>{result.expectedSuccessRate}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
