import NoPosts from "./NoPosts";
import Image from "next/image";
import { isImage, isVideo } from "@/lib/utils/mediaCheck";
import { ImagesIcon, PlayIcon } from "lucide-react";
import Link from "./ui/Link";
import { routes } from "@/lib/routes";
import { PostWithProfile } from "./Feed";

type PostsGridProps = {
  posts: PostWithProfile[]
};

export default function PostsGrid({ posts }: PostsGridProps) {
  return (
    <div>
      {
        posts && posts?.length > 0 ?
          <div className="grid grid-cols-3 gap-1">
            {posts?.map((post, idx) => {
              const format = post.media[0].split(".").pop();
              const multiple = post.media.length > 1;

              return (
                <div
                  key={post.id}
                  className="aspect-[4/5]"
                >
                  {isImage({
                    format
                  }) &&
                  <Link
                    href={routes.post.replace(":username", post.profile?.username ?? "").replace(":id", post.id)}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={post.media[0]}
                      alt={`post-image-${idx}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    {multiple && <ImagesIcon
                      className="absolute top-2 right-2 text-white"

                    />}
                  </Link>
                  }
                  {isVideo({
                    format
                  }) &&
                  <Link
                    href={routes.post.replace(":username", post.profile?.username ?? "").replace(":id", post.id)}
                    className="relative w-full h-full"
                  >
                    <video
                      muted
                      src={post.media[0]}
                      className="w-full h-full object-cover"
                    />
                    {multiple ? <ImagesIcon
                      className="absolute top-2 right-2 text-white"
                    />
                      :
                      <PlayIcon
                        className="absolute top-2 right-2 text-white"
                        fill="currentColor"
                      />
                    }
                  </Link>
                  }
                </div>
              );
            }
            )}
          </div>
          :
          <NoPosts />
      }
    </div>
  );
}