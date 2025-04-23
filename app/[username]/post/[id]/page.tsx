"use client";

import Container from "@/components/Container";
import FeedPost from "@/components/FeedPost";
import { Button } from "@/components/ui/Button";
import { usePostById, usePostsWithProfileInfo } from "@/hooks/usePosts";
import { routes } from "@/lib/routes";
import { renderDate } from "@/lib/utils/renderDate";
import { Post } from "@/schema/post";
import { ChevronLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: post } = usePostById(String(id ?? ""));
  const postsWithProfileInfo = usePostsWithProfileInfo([post ?? {} as Post]);

  return post && (
    <Container className="page-margins px-0 mt-4">
      <FeedPost post={postsWithProfileInfo[0]} />
      <Container>
        <small className="text-muted-foreground">{renderDate(postsWithProfileInfo[0].created_at)}</small>
      </Container>

      <Container className="grid place-items-center">
        <Button
          variant="outline"
          className="mt-12 mx-auto"
          onClick={() => router.push(routes.profile.replace(":username", postsWithProfileInfo[0].profile?.username ?? ""))}
        >
          <ChevronLeftIcon /> Go to {postsWithProfileInfo[0].profile?.username ?? "user"}&apos;s profile
        </Button>
      </Container>
    </Container>
  );
}