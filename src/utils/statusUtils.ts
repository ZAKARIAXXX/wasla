
export const STATUS_MAP = {
    "Lead": "lead",
    "Engaged": "engaged",
    "Qualified": "qualified",
    "Won": "won",
    "Lost": "lost"
} as const;

export type OrderStatusLabel = keyof typeof STATUS_MAP;
export type InternalStatus = typeof STATUS_MAP[OrderStatusLabel];

export const REVERSE_STATUS_MAP: Record<InternalStatus, OrderStatusLabel> = {
    "lead": "Lead",
    "engaged": "Engaged",
    "qualified": "Qualified",
    "won": "Won",
    "lost": "Lost"
};

export const ORDER_STATUS_LABELS: OrderStatusLabel[] = [
    "Lead",
    "Engaged",
    "Qualified",
    "Won",
    "Lost"
];
