"use client";

import { useAuthUser } from "@/hooks/useAuth";
import { useGetProfile } from "@/hooks/useProfile";
import {
  BookOpenIcon,
  HomeIcon,
  LogInIcon,
  PlusIcon,
  SearchIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Link from "./ui/Link";
import { routes } from "@/lib/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "./ui/Skeleton";
import useHideLayoutElements from "@/hooks/useHideLayoutElements";

// TODO: Change links when creating the pages
export default function BottomTabBar() {
  const pathname = usePathname();
  const { data: user, isFetching: fetchingUser } = useAuthUser();
  const { data: profile } = useGetProfile(user?.id ?? "");
  const withoutBottomTabBar = useHideLayoutElements();

  const noUser = !user && !fetchingUser;
  const withUser = user && !fetchingUser;

  if (withoutBottomTabBar) return null;

  return (
    <section className="flex items-center justify-around md:hidden bg-background w-full h-14 fixed bottom-0 border-t-1 border-t-accent-foreground shadow-[0px_-20px_20px_0px_rgba(0,0,15,0.1)]">
      <Link href={routes.home}>
        <HomeIcon
          size={26}
          className={cn(pathname === routes.home && "text-spartan-500")}
        />
      </Link>
      <SearchIcon size={26} />
      <Link
        href={routes.createPost}
        className="-translate-y-4"
      >
        <div className="bg-spartan-500 p-3 rounded-full shadow-sm shadow-muted-foreground text-white">
          <PlusIcon
            size={30}
          />
        </div>
      </Link>
      <BookOpenIcon size={26} />
      {fetchingUser && <Skeleton className="w-8 h-8 rounded-full" />}
      {noUser &&
      <Link href={routes.login}>
        <LogInIcon size={26}/>
      </Link>
      }
      {withUser && (
        <Link
          href={routes.profile.replace(":username", profile?.username ?? "")}
          className={cn("no-underline rounded-full", pathname === `/${profile?.username}` && "ring-2 ring-spartan-500")}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url ?? ""}/>
            <AvatarFallback>{profile?.username?.[0].toUpperCase() ?? profile?.fullname?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
      )}
    </section>
  );
}