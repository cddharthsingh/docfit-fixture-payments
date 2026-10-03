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

export async function createRefund(input: CreateRefundRequest) {
  const body = CreateRefundRequest.parse(input);
  return { id: `re_${Date.now()}`, status: "pending", ...body };
}
