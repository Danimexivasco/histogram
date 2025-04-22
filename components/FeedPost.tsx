import { HeartIcon } from "lucide-react";
import { routes } from "@/lib/routes";
import Container from "./Container";
import Avatar from "./Avatar";
import Carousel from "./Carousel";
import { PostWithProfile } from "./Feed";
import Link from "./ui/Link";
import Media from "./Media";

const PostHeader = ({ profile }: {profile: PostWithProfile["profile"] | undefined}) => {
  return (
    <Container className="w-full mb-4 md:px-2">
      <Link
        href={routes.profile.replace(":username", profile?.username ?? "")}
        className="flex items-center gap-4 w-fit no-underline"
      >
        <Avatar
          src={profile?.avatar_url ?? ""}
          fallback={profile?.username?.[0].toUpperCase() ?? ""}
          fallbackClassName="text-xl"
          size="md"
        />
        <p className="font-bold">{profile?.username}</p>
      </Link>
    </Container>
  );
};

// TODO: Add comments and show more... when multiple line content exceed X lines
const PostFooter = ({ post }: {post: PostWithProfile}) => {
  const { profile } = post;

  return (
    <Container className="mt-4 space-y-4 md:px-2">
      <div className="flex items-center gap-4">
        <HeartIcon />
      </div>
      <div className="grid grid-cols-[0.2fr_1fr] align-content-start gap-4">
        <Link
          href={routes.profile.replace(":username", profile?.username ?? "")}
          className="flex items-center gap-4 self-start no-underline font-bold"
        >
          {profile?.username}
        </Link>
        <p >{post.caption}</p>
      </div>
    </Container>
  );
};

export default function FeedPost({ post }: {post: PostWithProfile}) {
  const { profile } = post;

  return (
    <div className="px-0 md:px-8">
      <PostHeader profile={profile}/>

      <div className="aspect-[4/5]">
        {post.media.length > 1 ? (
          <Carousel mediaItems={post.media}/>
        ) : (
          <Media media={post.media[0]} />
        )}
      </div>

      <PostFooter post={post} />
    </div>
  );
}