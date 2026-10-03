import { z } from "zod";

export const CreateRefundRequest = z.object({
  payment_id: z.string(),
  amount: z.number().int().positive(),
  /** Why the refund is issued; shown to finance in reports. */
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
});
export type CreateRefundRequest = z.infer<typeof CreateRefundRequest>;

export async function createRefund(input: CreateRefundRequest) {
  const body = CreateRefundRequest.parse(input);
  return { id: `re_${Date.now()}`, status: "pending", ...body };
}
