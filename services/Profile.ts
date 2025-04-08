import { Profile, ProfileModel } from "@/models/supabase/Profile";

export class ProfileService {
  static async getById({ userId }: {userId: Profile["id"]}) {
    const profile = await ProfileModel.getById({
      userId
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }

  static async create({ id, username }: Partial<Profile>) {
    const profile = await ProfileModel.create({
      id,
      username
    });

    if (!profile) {
      throw new Error("Error creating the profile");
    }

    return id;
  }
}