export interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  /** When the refund was created: RFC 3339, UTC, millisecond precision (SAM1-12). */
  created_at: string;
  /** Present when status is "failed". */
  failure_reason?: "insufficient_funds" | "card_closed" | "expired";
}

export async function getRefund(id: string): Promise<Refund> {
  return { id, payment_id: "pay_123", amount: 500, status: "pending", created_at: new Date().toISOString() };
}
