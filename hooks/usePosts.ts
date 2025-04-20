import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/Post";
import { Post } from "@/schema/post";

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