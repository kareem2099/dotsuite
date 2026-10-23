import { RecordBase } from "@/lib/records";
import { getPool, encode, type Data } from "@/lib/postgres";
export default class Review extends RecordBase {
  static collection = "reviews";
  static references = ["userId"];
  declare productId: string;
  declare userId: string | { _id: string; name: string; image?: string };
  declare rating: number;
  declare comment: string;
  protected async beforeSave() {
    if (!Number.isFinite(this.rating) || this.rating < 1 || this.rating > 5 || !this.userId || !this.productId) throw new Error("Invalid review");
    this.comment = this.comment.trim(); if (!this.comment || this.comment.length > 1000) throw new Error("Invalid review");
  }
  static async ratingStats(filter: Data) {
    const r = await getPool().query("SELECT avg((ds_scalar(data->'rating')#>>'{}')::numeric)::float AS \"avgRating\", count(*)::int AS \"numReviews\" FROM ds_documents WHERE collection='reviews' AND ds_matches(data,$1::jsonb)", [JSON.stringify(encode(filter, this.references))]);
    return { avgRating: r.rows[0]?.avgRating ?? 0, numReviews: r.rows[0]?.numReviews ?? 0 };
  }
}
