import { getRefund, type Refund } from "./getRefund.js";

export class RefundNotCancellableError extends Error {
  readonly code = "refund_not_cancellable";
  readonly status = 409;
  constructor(id: string, current: Refund["status"]) {
    super(`refund ${id} is ${current}; only pending refunds can be cancelled`);
  }
}

/** POST /v2/refunds/{id}/cancel — only a pending refund can be cancelled (SAM1-11). */
export async function cancelRefund(id: string): Promise<Refund> {
  const refund = await getRefund(id);
  if (refund.status !== "pending") throw new RefundNotCancellableError(id, refund.status);
  return { ...refund, status: "cancelled", cancelled_at: new Date().toISOString() };
}
