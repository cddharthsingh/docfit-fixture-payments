import { z } from "zod";

export const CreateRefundRequest = z.object({
  payment_id: z.string(),
  amount: z.number().int().positive(),
  /** Why the refund is issued; shown to finance in reports. */
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
  /** Up to 20 string key-value pairs stored with the refund and returned on every read. */
  metadata: z.record(z.string().max(40), z.string().max(500)).refine((m) => Object.keys(m).length <= 20, "at most 20 keys").optional(),
});
export type CreateRefundRequest = z.infer<typeof CreateRefundRequest>;

/** `?expand=payment` embeds the refunded payment in the response instead of only its id. */
export const CreateRefundQuery = z.object({
  expand: z.array(z.enum(["payment"])).optional(),
});
export type CreateRefundQuery = z.infer<typeof CreateRefundQuery>;

export async function createRefund(input: CreateRefundRequest, query: CreateRefundQuery = {}) {
  const body = CreateRefundRequest.parse(input);
  const { expand = [] } = CreateRefundQuery.parse(query);
  const refund = { id: `re_${Date.now()}`, status: "pending", ...body };
  return expand.includes("payment") ? { ...refund, payment: { id: body.payment_id, amount: 1000, currency: "usd" } } : refund;
}
