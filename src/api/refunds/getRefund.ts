export interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  /** Present when status is "failed". */
  failure_reason?: "insufficient_funds" | "card_closed" | "expired";
}

export async function getRefund(id: string): Promise<Refund> {
  return { id, payment_id: "pay_123", amount: 500, status: "pending" };
}
