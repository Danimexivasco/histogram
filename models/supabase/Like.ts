import { apiRoutes } from "@/lib/apiRoutes";
import { Like } from "@/schema/like";

export class LikeModel {
  static async create(post_id: Like["post_id"]) {
    const res = await fetch(apiRoutes.likes, {
      method: "POST",
      body:   JSON.stringify({
        post_id
      })
    });

    if (!res.ok) {
      throw new Error("Error liking post");
    }

    const like = await res.json();

    if (like.error) {
      throw new Error(like.error);
    }

    return like;
  }
}