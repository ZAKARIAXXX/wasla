
export const STATUS_MAP = {
    "New": "new-order",
    "Preparing": "preparing",
    "Out for Delivery": "delivered",
    "Delivered": "delivered",
    "Paid": "paid",
    "Pending": "pending"
} as const;

export type OrderStatusLabel = keyof typeof STATUS_MAP;
export type InternalStatus = typeof STATUS_MAP[OrderStatusLabel];

export const REVERSE_STATUS_MAP: Record<InternalStatus, OrderStatusLabel> = {
    "new-order": "New",
    "preparing": "Preparing",
    "delivered": "Out for Delivery",
    "paid": "Paid",
    "pending": "Pending"
};

export const ORDER_STATUS_LABELS: OrderStatusLabel[] = [
    "New",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Paid",
    "Pending"
];
