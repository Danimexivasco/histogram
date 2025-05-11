import { PostWithLike } from "@/schema/post";
import { Profile } from "@/schema/profile";
import FeedPost from "./FeedPost";
import NoPosts from "./NoPosts";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type PostWithProfile = PostWithLike & {
  profile?: Profile;
  profileIsLoading?: boolean;
  profileError?: unknown;
};

type FeedProps = {
  posts: PostWithProfile[] ;
};

export default function Feed({ posts = [] }: FeedProps) {
  return (
    <div className="space-y-12">
      {
        posts && posts?.length > 0 ?
          (posts?.map((post) =>
            <FeedPost
              key={post.id}
              post={post}
            /> ))
          :
          <NoPosts />
      }
    </div>
  );
}