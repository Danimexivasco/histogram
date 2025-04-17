import { createClient } from "@/lib/supabase/client";
import { ProfileService } from "@/services/Profile";
import { User } from "@supabase/supabase-js";

const supabase = await createClient();

export class AuthModel {
  static async signUp({ email, password, username }: {email: string, password: string, username: string}) {
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`,
        data:            {
          username
        }
      }
    });

    if (signupError) throw new Error("Error signing up");

    const profileId = await ProfileService.create({
      id: data.user?.id,
      username,
      email
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

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options:  {
        redirectTo: `${window.location.origin}/login`
      }
    });

    if (error) throw new Error("Error singing in with Google");

    return data;
  }

  static async signOut() {
    await supabase.auth.signOut();
    return true;
  }

  static async resetPasswordForEmail({ email }: {email: string}) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw new Error("Error sending reset password email");

    return true;
  }

  static async updatePassword({ password }: {password: string}) {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) throw new Error("Error updating password");

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

  static async deleteUser({ id }: { id: User["id"] }) {
    const res = await fetch("/api/auth", {
      method: "DELETE",
      body:   JSON.stringify({
        id
      })
    });

    if (!res.ok) {
      throw new Error("Error deleting user");
    }

    const userId = await res.json();

    if (userId.error) {
      throw new Error("Error deleting user");
    }

    return userId;
  }
}
