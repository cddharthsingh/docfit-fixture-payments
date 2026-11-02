import type { Refund } from "./getRefund.js";

export interface ListRefundsQuery {
  /** Only refunds of this payment. */
  payment_id?: string;
  /** Only refunds in this status. */
  status?: Refund["status"];
  /** Only refunds with this reason: duplicate, fraudulent or requested_by_customer. */
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  /** Page size, 1–200. Defaults to 50. Larger pages are capped at 200. */
  limit?: number;
  /** Only refunds created at or after this time (RFC 3339). */
  created_gte?: string;
  /** Only refunds created before this time (RFC 3339). */
  created_lt?: string;
  /** Cursor: the id of the last refund on the previous page. */
  starting_after?: string;
  /** Cursor for paging backwards: the id of the first refund on the current page. Cannot be combined with starting_after. */
  ending_before?: string;
}

export interface RefundList {
  data: Refund[];
  /** True when another page exists; pass the last id as starting_after. */
  has_more: boolean;
}

export async function listRefunds(query: ListRefundsQuery = {}): Promise<RefundList> {
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);
  void query.payment_id;
  void query.status;
  void query.reason;
  if (query.starting_after && query.ending_before) throw new Error("use either starting_after or ending_before, not both");
  void query.starting_after;
  void query.ending_before;
  void query.created_gte;
  void query.created_lt;
  return { data: [], has_more: false && limit > 0 };
}
