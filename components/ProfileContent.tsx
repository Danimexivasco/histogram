"use client";

import { useGetProfileByUsername } from "@/hooks/useProfile";
import Link from "./ui/Link";
import { routes } from "@/lib/routes";
import { Profile } from "@/schema/profile";
import Container from "./Container";
import Avatar from "./Avatar";
import Spinner from "./ui/Spinner";
import { Button } from "./ui/Button";
import { GalleryVerticalIcon, Grid3X3Icon, LogOutIcon } from "lucide-react";
import { useAuthUser, useSignOut } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Separator } from "./ui/Separator";
import PostsGrid from "./PostsGrid";
import { useEffect, useState } from "react";
import Feed, { PostWithProfile } from "./Feed";
import { usePostsByUser } from "@/hooks/usePosts";
import { cn } from "@/lib/utils/cn";

type ProfileContentProps = {
  username: string;
};

type ProfileHeaderProps = {
  profile: Profile,
  postsLength: number
};

// TODO: Add PostService, followers and following counters
function Header({ profile, postsLength = 0 }: ProfileHeaderProps) {
  const router = useRouter();
  const singOutMutation = useSignOut();
  const { data: user } = useAuthUser();

  const handleSignOut = async () => {
    await singOutMutation.mutateAsync();
    router.refresh();
  };

  const isOwner = user?.id === profile?.user_id;

  const handleFollow = () => {
    // TODO: Handle follow logic
    return;
  };

  return profile && (
    <section className="space-y-8 mt-6 md:mt-12">
      <Container className="max-w-lg space-y-8">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Avatar
            src={profile?.avatar_url ?? ""}
            fallback={profile?.username?.[0].toUpperCase() ?? ""}
            fallbackClassName="text-3xl"
            size="lg"
          />
          <div className="space-y-4">
            <h1>{profile.username}</h1>
            {isOwner &&
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href={routes.editProfile.replace(":username", profile?.username ?? "")}
                  asButton
                  className="no-underline"
                >Edit Profile
                </Link>
                <Button
                  variant={"outline"}
                  onClick={handleSignOut}
                ><LogOutIcon className="text-spartan-400"/>Log out
                </Button>
              </div>
            }
            {!isOwner && (
              user ? (
                <Button
                  variant="spartan"
                  className="w-full min-w-32"
                  onClick={handleFollow}
                >Follow
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="spartan"
                      className="w-full min-w-32"
                    >Follow
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="prose mt-2">
                    <p className="font-bold">¿Do you want to follow this user?</p>
                    <p className="mt-2 text-muted-foreground">Log in to follow this user.</p>
                    <Link
                      href={routes.login}
                      asButton
                      variant="spartan"
                      className="no-underline mt-6 w-full"
                    >Log in
                    </Link>
                  </PopoverContent>
                </Popover>

              )
            )
            }
          </div>
        </div>
        <div className="space-y-2 mt-6">
          <p className="font-bold">{profile.fullname}</p>
          <p>{profile.bio}</p>
        </div>
      </Container>
      <div>
        <Separator />
        <div className="flex items-center justify-between px-4 py-2">
          <div className="grid place-items-center">
            <p>{postsLength}</p>
            <p className="text-muted-foreground">posts</p>
          </div>
          <div className="grid place-items-center">
            <p>X</p>
            <p className="text-muted-foreground">followers</p>
          </div>
          <div className="grid place-items-center">
            <p>X</p>
            <p className="text-muted-foreground">following</p>
          </div>
        </div>
        <Separator />
      </div>
    </section>
  );
}

function Posts({ posts }: {posts: PostWithProfile[] | null}) {
  const [layout, setLayout] = useState<"grid" | "feed">("grid");

  return (
    <section
      id="posts"
      aria-label="posts-section"
    >
      <div className="flex items-center gap-8 justify-center px-4 py-2">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setLayout("grid")}
        ><Grid3X3Icon className={cn("!w-8 !h-8", layout === "grid" && "text-spartan-500")}/>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setLayout("feed")}
        ><GalleryVerticalIcon className={cn("!w-8 !h-8", layout === "feed" && "text-spartan-500")}/>
        </Button>
      </div>
      <Separator />
      {posts && layout === "feed" &&
      <div className="mt-4">
        <Feed posts={posts}/>
      </div>
      }
      {posts && layout === "grid" && <PostsGrid posts={posts}/>}
    </section>
  );
}

export default function ProfileContent({ username }: ProfileContentProps) {
  const { data: profile } = useGetProfileByUsername(username);
  const { data: posts, isFetching } = usePostsByUser(profile?.user_id ?? "");
  const [postsWithProfielInfo, setPostsWithProfileInfo] = useState<PostWithProfile[]>([]);

  useEffect(() => {
    if(profile && posts && posts.length > 0) {
      setPostsWithProfileInfo(
        posts.map((post) => ({
          ...post,
          profile:          profile,
          profileIsLoading: false,
          profileError:     null
        }))
      );
    }
  }, [profile, posts]);

  if (!profile || isFetching) return (
    <Container className="grid place-items-center min-h-screen">
      <Spinner />
    </Container>
  );

  return (
    <Container
      centered
      className="page-margins px-0"
    >
      <Header
        profile={profile}
        postsLength={posts?.length ?? 0}
      />
      <Posts posts={postsWithProfielInfo ?? null}/>
    </Container>
  );
}