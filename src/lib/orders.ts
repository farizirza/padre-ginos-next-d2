// Shared order rules: safe to import from Server and Client Components.

export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Menunggu",
  preparing: "Disiapkan",
  ready: "Siap",
  delivered: "Terkirim",
  cancelled: "Dibatalkan",
};

// The kitchen workflow: where an order may go next
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function nextStatuses(current: OrderStatus): OrderStatus[] {
  return NEXT_STATUSES[current];
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    (ORDER_STATUSES as readonly string[]).includes(value)
  );
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return NEXT_STATUSES[from].includes(to);
}
