"use client";

import { usePosts } from "@/hooks/usePosts";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { caesarDressing } from "@/assets/fonts";
import Container from "@/components/Container";

export default function Home() {
  const { data: posts, isFetching, error } = usePosts();

  const isLoading = isFetching && !posts;

  if (isLoading) return (
    <Container className="grid place-items-center min-h-screen">
      <Spinner />
    </Container>
  );
  // TODO: Now media is an array, to handle it properly
  return (
    <Container className="page-margins grid items-center justify-items-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mt-12">
        {error && <p>Error fetching posts</p>}
        {!isFetching &&
          (posts && posts?.length > 0 ?
            (posts?.map((post) =>
              <div
                key={post.id}
                className="p-4 border-b"
              >
                <img
                  src={post.media[0]}
                  alt="Post"
                  className="w-full rounded-lg"
                />
                <p className="mt-2">{post.caption}</p>
              </div>
            ))
            :
            <div className="flex flex-col items-center space-y-4">
              <p className={cn("text-3xl text-muted-foreground", caesarDressing.className)}>No posts</p>
              <Image
                src="/no_results.gif"
                alt="No results"
                width={500}
                height={500}
                unoptimized={true}
                className="aspect-video rounded"
              />
            </div>
          )
        }
      </div>
    </Container>
  );
}
