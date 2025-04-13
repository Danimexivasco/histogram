import { ProfileModel } from "@/models/supabase/Profile";
import { Profile, validatePartialProfile } from "@/schema/profile";

export class ProfileService {
  static async getById({ user_id }: {user_id: Profile["id"]}) {
    const profile = await ProfileModel.getById({
      user_id
    });

    if (!profile) throw new Error("Profile not found");

    return profile;
  }

  static async create({ id, username, email, fullname, avatar_url }: Partial<Profile>) {
    const { error } = validatePartialProfile({
      id,
      username,
      email,
      fullname:   fullname ?? "",
      avatar_url: avatar_url ?? ""
    });

    if (error) throw new Error("Error validating profile inputs");

    const profile = await ProfileModel.create({
      id,
      username,
      email,
      fullname:   fullname ?? "",
      avatar_url: avatar_url ?? ""
    });

    if (!profile) {
      throw new Error("Error creating the profile");
    }

    return id;
  }

  static async checkIfProfileExists({ user_id }: {user_id: Profile["user_id"]}) {
    const profile = await ProfileModel.checkIfProfileExists({
      user_id
    });

    if (!profile) return false;

    return true;
  }

  static async update({ user_id, username, fullname, bio, avatar_url, updated_at }: Partial<Profile>) {
    const { error } = validatePartialProfile({
      user_id,
      username,
      fullname,
      bio,
      avatar_url,
      updated_at
    });

    if (error) throw new Error("Error validating profile inputs");

    const profile = await ProfileModel.update({
      user_id,
      username,
      fullname,
      bio,
      avatar_url,
      updated_at
    });

    if (!profile) throw new Error("Error updating the profile");

    return profile;
  }

  static async uploadAvatar(formData: FormData): Promise< {error: string, avatarUrl: string} | null> {
    const avatar = await ProfileModel.uploadAvatar(formData);

    if (avatar?.error) throw new Error(avatar.error);

    return avatar;
  }
}