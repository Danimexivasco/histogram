import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileService } from "@/services/Profile";
import { ToastService } from "@/services/Toast";
import { routes } from "@/lib/routes";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const handleGoogleLoginProfileCreation = async (user: User) => {
  const profileExist = await ProfileService.checkIfProfileExists({
    user_id: user.id
  });

  if (!profileExist) {
    try {
      const { id, email, user_metadata } = user;
      const { full_name, avatar_url, picture } = user_metadata;

      await ProfileService.create({
        id:         id,
        fullname:   full_name ?? "",
        username:   full_name ?? "",
        avatar_url: avatar_url ?? picture,
        email:      email
      });

      ToastService.success("User created successfully");
    } catch {
      ToastService.error("Error creating the profile for Google");
    }
  }
};

const supabase = await createClient();

export const useAuthStateChange = () => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;

          if (user?.app_metadata.provider === "google") {
            handleGoogleLoginProfileCreation(user);
          }

          router.push(routes.home);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);
};
