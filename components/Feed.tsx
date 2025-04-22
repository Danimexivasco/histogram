import Image from "next/image";

import { caesarDressing } from "@/assets/fonts";
import { cn } from "@/lib/utils/cn";
import { Post } from "@/schema/post";
import { Profile } from "@/schema/profile";
import Container from "./Container";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FeedPost from "./FeedPost";

export type PostWithProfile = Post & {
  profile?: Profile;
  profileIsLoading?: boolean;
  profileError?: unknown;
};

type FeedProps = {
  posts: PostWithProfile[];
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
          <Container className="flex flex-col items-center space-y-4">
            <p className={cn("text-3xl text-muted-foreground", caesarDressing.className)}>No posts</p>
            <Image
              src="/no_results.gif"
              alt="No results"
              width={500}
              height={500}
              unoptimized={true}
              className="aspect-video rounded"
            />
          </Container>
      }
    </div>
  );
}