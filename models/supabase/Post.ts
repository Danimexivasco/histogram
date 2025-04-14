import { createClient } from "@/lib/supabase/client";

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  created_at: string;
}

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

  static async create({ user_id, image_url, caption }: Partial<Post>): Promise<Post | null> {
    const { data, error } = await supabase.from("posts").insert([{
      user_id,
      image_url,
      caption
    }]).select("*").single();

    if (error) {
      return null;
    }

    return data;
  }
}