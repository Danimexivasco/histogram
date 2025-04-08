import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/Auth";

export const useAuthUser = () => {
  return useQuery({
    queryKey:  ["authUser"],
    queryFn:   AuthService.getCurrentUser,
    staleTime: Infinity,
    retry:     1,
    gcTime:    0
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => AuthService.signIn({
      email,
      password
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["authUser"]
    })
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, username }: { email: string; password: string; username: string }) => AuthService.signUp({
      email,
      password,
      username
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["authUser"]
    })
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.signOut,
    onSuccess:  () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({
        queryKey:    ["authUser"],
        refetchType: "active"
      });
    }
  });
};