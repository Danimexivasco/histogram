"use client";

import { routes } from "@/lib/routes";
import Link from "./ui/Link";
import {
  BookOpenIcon,
  HeartIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { useAuthUser } from "@/hooks/useAuth";
import { useGetProfile } from "@/hooks/useProfile";
import useHideLayoutElements from "@/hooks/useHideLayoutElements";

// TODO: Change links when creating the pages
export default function AsideMenu() {
  const pathname = usePathname();
  const { data: user } = useAuthUser();
  const { data: profile } = useGetProfile(user?.id ?? "");
  const withoutAsideMenu = useHideLayoutElements();

  if (withoutAsideMenu) return null;

  return (
    <aside className="hidden md:block sticky top-20 p-4 space-y-8 self-start">
      <Link
        href={routes.home}
        className="grid place-items-center no-underline space-y-0.5"
      >
        <HomeIcon
          size={26}
          className={cn(pathname === routes.home && "text-spartan-500")}
        />
        <small>Home</small>
      </Link>
      <Link
        href={routes.home}
        className="grid place-items-center no-underline space-y-0.5"
      >
        <SearchIcon size={26} />
        <small>Search</small>
      </Link>
      <Link
        href={routes.home}
        className="grid place-items-center no-underline space-y-0.5"
      >
        <HeartIcon size={26} />
        <small>Notifications</small>
      </Link>
      <Link
        href={routes.home}
        className="grid place-items-center no-underline space-y-0.5"
      >
        <BookOpenIcon size={26} />
        <small>Library</small>
      </Link>
      {user &&
      <div className="space-y-8">
        <Link
          href={routes.createPost}
          className="grid place-items-center no-underline space-y-0.5"
        >
          <div className="bg-spartan-500 p-3 rounded-full shadow text-white">
            <PlusIcon
              size={30}
            />
          </div>
          <small>Add post</small>
        </Link>
        <Link
          href={routes.profile.replace(":username", profile?.username ?? "")}
          className="grid place-items-center no-underline space-y-0.5"
        >
          <Avatar
            src={profile?.avatar_url ?? ""}
            fallback={profile?.username?.[0].toUpperCase() ?? profile?.fullname?.[0].toUpperCase() ?? ""}
            className={cn(pathname === `/${profile?.username}` && "ring-2 ring-spartan-500")}
          />
          <small>Profile</small>
        </Link>
      </div>
      }
    </aside>
  );
}