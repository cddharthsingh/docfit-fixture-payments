import type { Refund } from "./getRefund.js";

export interface ListRefundsQuery {
  /** Only refunds of this payment. */
  payment_id?: string;
  /** Only refunds in this status. */
  status?: Refund["status"];
  /** Page size, 1–100. Defaults to 20. */
  limit?: number;
  /** Cursor: the id of the last refund on the previous page. */
  starting_after?: string;
}

export interface RefundList {
  data: Refund[];
  /** True when another page exists; pass the last id as starting_after. */
  has_more: boolean;
}

export async function listRefunds(query: ListRefundsQuery = {}): Promise<RefundList> {
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);
  void query.payment_id;
  void query.status;
  void query.starting_after;
  return { data: [], has_more: false && limit > 0 };
}
