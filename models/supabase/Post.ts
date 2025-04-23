import { createClient } from "@/lib/supabase/client";
import { Post } from "@/schema/post";

const supabase = await createClient();

export class PostModel {
  static async getAll(): Promise<Post[]> {
    const { data, error } = await supabase.from("posts").select("*").order("created_at", {
      ascending: false
    });

    if (error) {
      return [];
    }

    return data;
  }

  static async getByUserId(user_id: Post["user_id"]): Promise<Post[]> {
    const { data, error } = await supabase.from("posts").select("*").eq("user_id", user_id).order("created_at", {
      ascending: false
    });

    if (error) {
      return [];
    }

    return data;
  }

  static async getByPostId(id: Post["id"]): Promise<Post | null> {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

    if (error) {
      return null;
    }

    return data;
  }

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