export interface RefundEvent {
  type: "refund.created" | "refund.succeeded" | "refund.failed";
  id: string;
  payment_id: string;
  amount: number;
}
