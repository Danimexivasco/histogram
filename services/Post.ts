import { PostModel } from "@/models/supabase/Post";
import { Post } from "@/schema/post";

export class PostService {
  static async getAll(): Promise<Post[]> {
    return await PostModel.getAll();
  }

  static async getByUserId(user_id: Post["user_id"]): Promise<Post[]> {
    return await PostModel.getByUserId(user_id);
  }

  static async getByPostId(id: Post["id"]): Promise<Post | null> {
    return await PostModel.getByPostId(id);
  }

  static async create({ user_id, media, caption }: Partial<Post>): Promise<Post> {
    const post = await PostModel.create({
      user_id,
      media,
      caption
    });

    if (!post) {
      throw new Error("Error creating the post");
    }

    return post;
  }
}
