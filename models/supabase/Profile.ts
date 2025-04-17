import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/schema/profile";

const supabase = await createClient();

export class ProfileModel {
  static async getById({ user_id }: {user_id: Profile["user_id"]}): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user_id).single();

    if (error) {
      return null;
    }

    return data;
  }

  static async getByUsername({ username }: {username: Profile["username"]}): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single();

    if (error) {
      return null;
    }

    return data;
  }

  static async create({ id, username, email, fullname, avatar_url }: Partial<Profile>): Promise<string | null> {
    const res = await fetch("/api/profile", {
      method: "POST",
      body:   JSON.stringify({
        id,
        username,
        email,
        fullname,
        avatar_url
      })
    });

    const profileId = await res.json();

    if (profileId.error) {
      return null;
    }

    return profileId;
  }

  static async checkIfProfileExists({ user_id }: {user_id: Profile["user_id"]}): Promise<boolean> {
    const profilePromise = await fetch("/api/check-profile-creation", {
      method: "POST",
      body:   JSON.stringify({
        id: user_id
      })
    });

    const profile = await profilePromise.json();

    if (!profile.exists) return false;

    return true;
  }

  static async update({ user_id, username, fullname, bio, avatar_url, updated_at }: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").update([{
      username,
      fullname,
      bio,
      avatar_url,
      updated_at
    }]).eq("user_id", user_id).select("*").single();

    if (error) return null;

    return data;
  }

  static async uploadAvatar(formData: FormData): Promise<{error: string, avatarUrl: string} | null> {
    const avatarPromise = await fetch("/api/upload-avatar", {
      method: "POST",
      body:   formData
    });

    const avatar = await avatarPromise.json();

    return avatar;
  }
}