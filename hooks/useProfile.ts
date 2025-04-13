import { Profile } from "@/schema/profile";
import { ProfileService } from "@/services/Profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PROFILE_KEYS = {
  profile: ["Profile"],
  avatar:  ["Avatar"]
};
const FIVE_MINUTES = 5 * 60 * 1000;

export const useGetProfile = (user_id: string) => {
  return useQuery({
    queryKey: [...PROFILE_KEYS.profile, user_id],
    queryFn:  () => ProfileService.getById({
      user_id
    }),
    staleTime:            FIVE_MINUTES,
    refetchOnWindowFocus: true,
    refetchOnMount:       true,
    enabled:              !!user_id,
    retry:                1
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user_id, username, fullname, bio, avatar_url, updated_at }: Partial<Profile>) => ProfileService.update({
      user_id,
      username,
      fullname,
      bio,
      avatar_url,
      updated_at
    }),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_KEYS.profile
      });

      const previousProfile = queryClient.getQueryData(PROFILE_KEYS.profile);

      queryClient.setQueryData(PROFILE_KEYS.profile, (old: Profile) => {
        return {
          ...old,
          ...payload
        };
      });

      return {
        previousProfile
      };
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData(PROFILE_KEYS.profile, context?.previousProfile);
    },
    onSettled: () => queryClient.invalidateQueries({
      queryKey: PROFILE_KEYS.profile
    })
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => ProfileService.uploadAvatar(formData),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_KEYS.avatar
      });

      const previousProfile = queryClient.getQueryData(PROFILE_KEYS.avatar);

      return {
        previousProfile
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEYS.avatar, data?.avatarUrl);
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData(PROFILE_KEYS.avatar, context?.previousProfile);
    },
    onSettled: () => queryClient.invalidateQueries({
      queryKey: PROFILE_KEYS.avatar
    })
  });
};

