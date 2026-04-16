import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RiskTier } from "@/utils/riskScoring";

interface RiskContextValue {
    /** tier per contact id, populated as panels calculate results */
    tiers: Record<string, RiskTier>;
    setTier: (contactId: string, tier: RiskTier) => void;
}

const RiskContext = createContext<RiskContextValue>({
    tiers: {},
    setTier: () => { },
});

export function RiskProvider({ children }: { children: ReactNode }) {
    const [tiers, setTiers] = useState<Record<string, RiskTier>>({});

    const setTier = useCallback((contactId: string, tier: RiskTier) => {
        setTiers((prev) => {
            // avoid unnecessary re-renders
            if (prev[contactId] === tier) return prev;
            return { ...prev, [contactId]: tier };
        });
    }, []);

    return (
        <RiskContext.Provider value={{ tiers, setTier }}>
            {children}
        </RiskContext.Provider>
    );
}

export const useRiskContext = () => useContext(RiskContext);
