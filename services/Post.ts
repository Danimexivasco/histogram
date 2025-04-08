import { Post, PostModel } from "@/models/supabase/Post";

export class PostService {
  static async getAll(): Promise<Post[]> {
    return await PostModel.getAll();
  }

  static async create({ user_id, image_url, caption }: Partial<Post>): Promise<Post | null> {
    const post = await PostModel.create({
      user_id,
      image_url,
      caption
    });

    if (!post) {
      throw new Error("Error creating the post");
    }

    return post;
  }
}
