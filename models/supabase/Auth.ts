import { supabase } from "@/lib/supabase/client";
import { ProfileService } from "@/services/Profile";

export class AuthModel {
  static async signUp({ email, password, username }: {email: string, password: string, username: string}) {
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (signupError) throw new Error("Error signing up");

    const profileId = await ProfileService.create({
      id: data.user?.id,
      username
    });

    if (!profileId) throw new Error("Error creating the profile");

    return data;
  }

  static async signIn({ email, password }: {email: string, password: string}) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error("Error singing in");

    return data;
  }

  static async signOut() {
    await supabase.auth.signOut();
    return true;
  }

  static async getUserSession() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) throw new Error("No user session found");

    return data.session;
  }

  static async getCurrentUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) throw new Error("No user found");

    return data.user;
  }
}
