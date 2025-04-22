"use client";

import { usePosts, usePostsWithProfileInfo } from "@/hooks/usePosts";
import Spinner from "@/components/ui/Spinner";
import Container from "@/components/Container";
import Feed from "@/components/Feed";

export default function Home() {
  const { data: posts, isFetching, error } = usePosts();
  const postsWithProfileInfo = usePostsWithProfileInfo(posts ?? []);

  const isLoading = isFetching || !posts;

  if (isLoading) return (
    <Container className="grid place-items-center min-h-screen">
      <Spinner />
    </Container>
  );

  return (
    <div className="page-margins grid items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <Container
        centered
        className="mt-6 px-0"
      >
        {error && <p>Error fetching posts</p>}
        {!isFetching &&
          <Feed posts={postsWithProfileInfo} />
        }
      </Container>
    </div>
  );
}
