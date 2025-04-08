import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/Auth";

type SignInCredentials = { email: string; password: string };
type SignUpCredentials = { email: string; password: string; username: string };
type ResetPasswordCredentials = { email: string };
type UpdatePasswordCredentials = { password: string };

const AUTH_KEYS = {
  user: ["authUser"]
};

export const useAuthUser = () => {
  return useQuery({
    queryKey:  AUTH_KEYS.user,
    queryFn:   AuthService.getCurrentUser,
    staleTime: Infinity,
    retry:     1,
    gcTime:    0
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: SignInCredentials) => AuthService.signIn({
      email,
      password
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: AUTH_KEYS.user
    })
  });
};

export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.signInWithGoogle(),
    onSuccess:  () => queryClient.invalidateQueries({
      queryKey: AUTH_KEYS.user
    })
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, username }: SignUpCredentials) => AuthService.signUp({
      email,
      password,
      username
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: AUTH_KEYS.user
    }),
    onError: () => {
      queryClient.setQueryData(AUTH_KEYS.user, null);
    }
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.signOut,
    onSuccess:  () => {
      queryClient.setQueryData(AUTH_KEYS.user, null);
    }
  });
};

export const useResetPasswordForEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email }: ResetPasswordCredentials) => AuthService.resetPasswordForEmail({
      email
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: AUTH_KEYS.user
    })
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ password }: UpdatePasswordCredentials) => AuthService.updatePassword({
      password
    }),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: AUTH_KEYS.user
    })
  });
};