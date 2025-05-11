import { createClient } from "@/lib/supabase/client";
import { Post, PostWithLike } from "@/schema/post";

const supabase = await createClient();

export class PostModel {
  static async getAll(): Promise<PostWithLike[]> {
    const { data: userData } = await supabase.auth.getUser();

    const { user } = userData;

    if (!user) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", {
          ascending: false
        });

      if (error || !data) return [];

      return data.map((post) => ({
        ...post,
        isLiked: false
      }));
    }

    const { data, error } = await supabase
      .from("posts")
      .select(`
      *,
      likes!left(
        id
      )
    `)
      .order("created_at", {
        ascending: false
      })
      .eq("likes.user_id", user.id);

    if (error || !data) return [];

    return data.map((post) => ({
      ...post,
      isLiked: !!(post.likes && post.likes.length > 0)
    }));
  }

  static async getByUserId(user_id: Post["user_id"]): Promise<PostWithLike[]> {
    const { data: userData } = await supabase.auth.getUser();

    const { user } = userData;

    if (!user) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", {
          ascending: false
        });

      if (error || !data) return [];

      return data.map((post) => ({
        ...post,
        isLiked: false
      }));
    }

    const { data, error } = await supabase
      .from("posts")
      .select(`
      *,
      likes!left(
        id
      )
    `)
      .eq("user_id", user_id)
      .order("created_at", {
        ascending: false
      })
      .eq("likes.user_id", user.id);

    if (error || !data) return [];

    return data.map((post) => ({
      ...post,
      isLiked: !!(post.likes && post.likes.length > 0)
    }));
  }

  static async getByPostId(id: Post["id"]): Promise<PostWithLike | null> {
    const { data: userData } = await supabase.auth.getUser();

    const { user } = userData;

    if (!user) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      return {
        ...data,
        isLiked: false
      };
    }

    const { data, error } = await supabase
      .from("posts")
      .select(`
      *,
      likes!left(
        id
      )
    `)
      .eq("id", id)
      .eq("likes.user_id", user.id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      isLiked: !!(data.likes && data.likes.length > 0)
    };
  }

  // static async getByUserId(user_id: Post["user_id"]): Promise<Post[]> {
  //   const { data, error } = await supabase.from("posts").select("*").eq("user_id", user_id).order("created_at", {
  //     ascending: false
  //   });

  //   if (error) {
  //     return [];
  //   }

  //   return data;
  // }

  // static async getByPostId(id: Post["id"]): Promise<Post | null> {
  //   const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

  //   if (error) {
  //     return null;
  //   }

  //   return data;
  // }

  static async create({ user_id, media, caption }: Partial<Post>): Promise<Post | null> {
    const { data, error } = await supabase.from("posts").insert([{
      user_id,
      media,
      caption
    }]).select("*").single();

    if (error) {
      return null;
    }

    return data;
  }
}