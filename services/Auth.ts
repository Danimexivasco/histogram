import { AuthModel } from "@/models/supabase/Auth";
import { validateAuthForm, validatePartialAuthForm } from "@/schema/authForm";
import { validateResetPassword } from "@/schema/resetPassword";
import { User } from "@supabase/supabase-js";

export class AuthService {
  static async signUp({ email, password, username }: {email: string, password: string, username: string}) {
    const { error } = validateAuthForm({
      email,
      password,
      username
    });

    if (error) throw new Error("Please, check form fields");

    return await AuthModel.signUp({
      email,
      password,
      username
    });
  }

  static async signIn({ email, password }: {email: string, password: string}) {
    const { error } = validatePartialAuthForm({
      email,
      password
    });

    if (error) throw new Error("Please, check form fields");

    return await AuthModel.signIn({
      email,
      password
    });
  }

  static async signInWithGoogle() {
    return await AuthModel.signInWithGoogle();
  }

  static async signOut() {
    return await AuthModel.signOut();
  }

  static async resetPasswordForEmail({ email }: {email: string}) {
    const { error } = validatePartialAuthForm({
      email
    });

    if (error) throw new Error("Please, check form fields");

    return await AuthModel.resetPasswordForEmail({
      email
    });
  }

  static async updatePassword({ password }: {password: string}) {
    const { error } = validateResetPassword({
      password,
      confirmPassword: password
    });

    if (error) throw new Error("Please, check form fields");

    return await AuthModel.updatePassword({
      password
    });
  }

  static async getUserSession() {
    return await AuthModel.getUserSession();
  }

  static async getCurrentUser() {
    return await AuthModel.getCurrentUser();
  }

  static async deleteUser({ id }: { id: User["id"] }) {
    return await AuthModel.deleteUser({
      id
    });
  }
}