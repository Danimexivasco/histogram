import { supabase } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export class ProfileModel {
  static async getById({ userId }: {userId: Profile["id"]}): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) {
      return null;
    }

    return data;
  }

  static async create({ id, username }: Partial<Profile>): Promise<string | null> {
    const res = await fetch("/api/profile", {
      method: "POST",
      body:   JSON.stringify({
        id,
        username
      })
    });

    const profileId = await res.json();

    if (profileId.error) throw new Error("Error creating the profile");

    if (profileId.error) {
      return null;
    }

    return profileId;
  }
}