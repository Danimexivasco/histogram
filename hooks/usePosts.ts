import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries
} from "@tanstack/react-query";
import { PostService } from "@/services/Post";
import { Post } from "@/schema/post";
import { ProfileService } from "@/services/Profile";
import { FIVE_MINUTES } from "@/lib/constants";

const POST_KEYS = {
  posts: ["posts"]
};

export const usePosts = () => {
  return useQuery({
    queryKey: POST_KEYS.posts,
    queryFn:  PostService.getAll
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user_id, media, caption }: { user_id: Post["user_id"], media: Post["media"], caption: Post["caption"] }) =>
      PostService.create({
        user_id,
        media,
        caption
      }),
    onMutate: async (payload: Partial<Post>) => {
      await queryClient.cancelQueries({
        queryKey: POST_KEYS.posts
      });

      const previousPosts = queryClient.getQueryData<Post[]>(POST_KEYS.posts);

      const temporaryPost: Post = {
        user_id:    payload.user_id ?? "",
        media:      payload.media ?? [],
        caption:    payload.caption,
        id:         "",
        created_at: ""
      };

      queryClient.setQueryData(POST_KEYS.posts, (previousData: Post[] = []) => [...previousData, temporaryPost]);

      return {
        previousPosts
      };
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData(POST_KEYS.posts, context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        {
          queryKey: POST_KEYS.posts
        }
      );
    },
    onSuccess: (data: Post) => {
      queryClient.setQueryData(POST_KEYS.posts, (previousData: Post[] = []) => {
        const index = previousData.findIndex((post) => post.id === "");
        if (index !== -1) {
          previousData[index] = data;
        } else {
          previousData.push(data);
        }
        return [...previousData];
      });
    }
  });
};

export const usePostsWithProfileInfo = (posts: Post[]) => {
  const profileQueries = useQueries({
    queries: posts?.map((post) => ({
      queryKey: [POST_KEYS.posts, post.id],
      queryFn:  () => ProfileService.getById({
        user_id: post.user_id
      }),
      enabled:              !!post.user_id,
      staleTime:            FIVE_MINUTES,
      refetchOnWindowFocus: true,
      refetchOnMount:       true,
      retry:                1
    })) ?? []
  });

  const postsWithProfileInfo = posts?.map((post, index) => ({
    ...post,
    profile:          profileQueries[index]?.data,
    profileIsLoading: profileQueries[index]?.isLoading,
    profileError:     profileQueries[index]?.error
  }));

  return postsWithProfileInfo;
};