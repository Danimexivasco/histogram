import { HeartIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ToastService } from "@/services/Toast";
import { PostWithLike } from "@/schema/post";

type LikeButtonProps = {
  post: PostWithLike
};

export default function LikeButton({ post }: LikeButtonProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  const toggleLike = async () => {
    try {
      likeButtonRef.current?.classList[liked ? "remove" : "add"]("likeAnimation");

      setLiked(prevLike => !prevLike);

      const res = await fetch(`/api/likes`, {
        method: liked ? "DELETE" : "POST",
        body:   JSON.stringify({
          post_id: post.id
        })
      });

      if (!res.ok) {
        if (res.status === 401) {
          ToastService.error("You must be logged in to like a post");
          return setLiked(prevLike => !prevLike);
        }
        ToastService.error("Error with like action");
        return setLiked(prevLike => !prevLike);
      }
    } catch {
      ToastService.error("Error liking post");
      setLiked(prevLike => !prevLike);
    }
  };

  return (
    <button
      ref={likeButtonRef}
      className="p-2 cursor-pointer group"
      aria-label={liked ? "heart button for unliking post" : "heart button for liking post"}
    >
      <HeartIcon
        onClick={toggleLike}
        role="button"
        size={24}
        className={cn("transition group-hover:text-muted-foreground",
          liked && "fill-spartan-500 text-spartan-500 group-hover:text-spartan-500"
        )}
      />
    </button>
  );
}
