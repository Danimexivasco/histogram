import { LikeModel } from "@/models/supabase/Like";
import { Like } from "@/schema/like";

export class LikeService {
  static async create(post_id: Like["post_id"]) {
    const like = await LikeModel.create(post_id);

    if (!like) throw new Error("Error liking post");

    return like;
  }
}