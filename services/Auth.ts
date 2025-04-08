import { AuthModel } from "@/models/supabase/Auth";
import { validateAuthForm } from "@/schema/authForm";

export class AuthService {
  static async signUp({ email, password, username }: {email: string, password: string, username: string}) {
    const { error } = validateAuthForm({
      email,
      password,
      username
    });

    if (error) {
      throw new Error("Please, check form fields");
    }

    return await AuthModel.signUp({
      email,
      password,
      username
    });
  }

  static async signIn({ email, password }: {email: string, password: string}) {
    return await AuthModel.signIn({
      email,
      password
    });
  }

  static async signOut() {
    return await AuthModel.signOut();
  }

  static async getUserSession() {
    return await AuthModel.getUserSession();
  }

  static async getCurrentUser() {
    return await AuthModel.getCurrentUser();
  }
}