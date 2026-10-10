/** Fields every refund event carries. `created_at` is RFC 3339 in UTC with millisecond precision. */
interface RefundEventBase {
  id: string;
  payment_id: string;
  amount: number;
  currency: string;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  created_at: string;
}

/** Sent when a refund is created; it starts as `pending`. */
export interface RefundCreatedEvent extends RefundEventBase {
  type: "refund.created";
  status: "pending";
}

/** Sent when the money has reached the customer. */
export interface RefundSucceededEvent extends RefundEventBase {
  type: "refund.succeeded";
  status: "succeeded";
  /** When the refund settled. */
  succeeded_at: string;
  /** The card network's reference, shown on the customer's statement. Absent for bank transfers. */
  arn?: string;
}

/** Sent when the refund could not be paid out. The amount returns to the merchant balance. */
export interface RefundFailedEvent extends RefundEventBase {
  type: "refund.failed";
  status: "failed";
  failed_at: string;
  failure_code: "expired_card" | "account_closed" | "insufficient_balance" | "declined";
  /** Human-readable explanation, safe to show to the merchant. */
  failure_message: string;
}

/** Sent when a pending refund is cancelled with POST /v2/refunds/{id}/cancel. */
export interface RefundCancelledEvent extends RefundEventBase {
  type: "refund.cancelled";
  status: "cancelled";
  cancelled_at: string;
}

/** Sent when `metadata` or `reason` changes on an existing refund. */
export interface RefundUpdatedEvent extends RefundEventBase {
  type: "refund.updated";
  status: "pending" | "succeeded" | "failed" | "cancelled";
  /** The changed fields with their values before the update. */
  previous_attributes: Partial<Pick<RefundEventBase, "reason">> & { metadata?: Record<string, string> };
}

export type RefundEvent = RefundCreatedEvent | RefundSucceededEvent | RefundFailedEvent | RefundCancelledEvent | RefundUpdatedEvent;

/** Every delivery is signed: `DocPay-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "t.body">`. Reject deliveries older than 5 minutes. */
export const SIGNATURE_HEADER = "DocPay-Signature";
export const SIGNATURE_TOLERANCE_SECONDS = 300;
