export type RiskTier = "green" | "yellow" | "red";

export interface RiskFactor {
    label: string;
    points: number;
    detail: string;
    tooltip: string;
}

export interface RiskResult {
    score: number;
    tier: RiskTier;
    confidence: number;
    dataSignals: number;
    positiveFactors: RiskFactor[];
    negativeFactors: RiskFactor[];
    expectedSuccessRate: number;
    recommendation: {
        header: string;
        body: string;
        primaryAction: string;
        secondaryAction: string;
    };
}

export interface ContactForRisk {
    id: string;
    name: string;
    phone: string;
    totalSpent: number;
    reliability?: number;
    lastMessage?: string;
    timestamp: string;
    unread: number;
    status?: string;
    orderStatus?: string;
}

export interface MessageForRisk {
    text: string;
    sent: boolean;
    timestamp: string;
}

// ─── Phone Validation ──────────────────────────────────────────────────────────
function validatePhone(phone: string): "mobile" | "landline" | "invalid" {
    const cleaned = phone.replace(/[\s-+]/g, "").replace(/^(00212|212|0)/, "");
    if (cleaned.length !== 9) return "invalid";
    const prefix = cleaned.charAt(0);
    if (prefix === "6" || prefix === "7") return "mobile";
    if (prefix === "5" || prefix === "8") return "landline";
    return "invalid";
}

// ─── Sentiment Analysis ─────────────────────────────────────────────────────────
function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const lower = text.toLowerCase();
    const positive = ["yes", "oui", "ayeh", "wakha", "merci", "chokran", "ok", "okay", "sure", "confirmed", "great", "thanks", "thx"];
    const negative = ["no", "non", "la", "cancel", "annule", "maybe", "inshallah", "not sure", "wait", "later", "problem", "issue"];
    if (positive.some((w) => lower.includes(w))) return "positive";
    if (negative.some((w) => lower.includes(w))) return "negative";
    return "neutral";
}

// ─── Late Night Detection ───────────────────────────────────────────────────────
function isLateNight(timestamp: string): boolean {
    const hour = new Date(timestamp).getHours();
    return hour >= 2 && hour < 6;
}

// ─── Expected Success Rate ──────────────────────────────────────────────────────
function getExpectedSuccessRate(score: number): number {
    if (score >= 90) return 98;
    if (score >= 80) return 94;
    if (score >= 70) return 88;
    if (score >= 60) return 78;
    if (score >= 50) return 65;
    if (score >= 40) return 52;
    if (score >= 30) return 38;
    if (score >= 20) return 25;
    return 15;
}

// ─── Tier ──────────────────────────────────────────────────────────────────────
function getTier(score: number): RiskTier {
    if (score >= 70) return "green";
    if (score >= 40) return "yellow";
    return "red";
}

// ─── Recommendation ────────────────────────────────────────────────────────────
function getRecommendation(
    tier: RiskTier,
    expectedSuccessRate: number,
    totalSpent: number
): RiskResult["recommendation"] {
    if (tier === "green") {
        return {
            header: "PROCEED WITH DELIVERY",
            body: `This customer has consistent payment history and confirmed availability. Expected success rate ${expectedSuccessRate}%.`,
            primaryAction: "Confirm Order",
            secondaryAction: "Request Verification",
        };
    }
    if (tier === "yellow") {
        return {
            header: "REVIEW CAREFULLY",
            body: `Mixed signals detected. Consider calling to verify availability, requesting partial prepayment, or confirming address via WhatsApp. Expected success rate ${expectedSuccessRate}%.`,
            primaryAction: "Call Customer",
            secondaryAction: "Send Verification Message",
        };
    }
    return {
        header: "HIGH RISK — DO NOT SHIP",
        body: `Multiple red flags detected. Suggested action: cancel or require 100% prepayment. Expected loss if shipped: ${totalSpent.toFixed(0)} MAD.`,
        primaryAction: "Cancel Order",
        secondaryAction: "Request Prepayment",
    };
}

// ─── Main Scoring Engine ────────────────────────────────────────────────────────
export function calculateRiskScore(
    contact: ContactForRisk,
    messages: MessageForRisk[]
): RiskResult {
    return {
        score: 0,
        tier: "green",
        confidence: 0,
        dataSignals: 0,
        positiveFactors: [],
        negativeFactors: [],
        expectedSuccessRate: 0,
        recommendation: {
            header: "RISK SCORING DISABLED",
            body: "Waiting for real data integration. Risk signals are temporarily paused.",
            primaryAction: "N/A",
            secondaryAction: "N/A",
        },
    };
}

// ─── Quick Tier (contact-only, no messages) ─────────────────────────────────────
// Used for dots in list views (ContactsView, ChatList).
// Deterministic — same inputs always give the same tier.
export function quickTier(contact: {
    phone: string;
    reliability?: number;
    totalSpent?: number;
    orderStatus?: string | null;
    lastMessage?: string;
    timestamp: string;
    unread?: number;
}): RiskTier {
    return "green";
}
