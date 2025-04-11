import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ProfileService } from "@/services/Profile";
import { ToastService } from "@/services/Toast";
import { routes } from "@/lib/routes";

export const useAuthStateChange = () => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;

          // Handle Google OAuth login
          if (user?.app_metadata.provider === "google") {
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
              } catch (error) {
                ToastService.error("Error creating the profile for Google");
                console.error("Error creating profile:", error);
              }
            }
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
