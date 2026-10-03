export interface RefundEvent {
  type: "refund.created" | "refund.succeeded" | "refund.failed" | "refund.cancelled";
  id: string;
  payment_id: string;
  amount: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
}
