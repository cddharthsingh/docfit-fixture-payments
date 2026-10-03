import { z } from "zod";

export const CreateRefundRequest = z.object({
  payment_id: z.string(),
  amount: z.number().int().positive(),
});
export type CreateRefundRequest = z.infer<typeof CreateRefundRequest>;

export async function createRefund(input: CreateRefundRequest) {
  const body = CreateRefundRequest.parse(input);
  return { id: `re_${Date.now()}`, status: "pending", ...body };
}
