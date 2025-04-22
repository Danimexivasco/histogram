"use client";

import Image from "next/image";
import { HeartIcon, LogOut, UserRoundPen } from "lucide-react";
import { caesarDressing } from "@/assets/fonts";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/routes";
import Link from "./ui/Link";
import { Skeleton } from "./ui/Skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { Separator } from "./ui/Separator";
import { Button } from "./ui/Button";
import Container from "./Container";
import ThemeSwitch from "./ThemeSwitch";
import { useAuthUser, useSignOut } from "@/hooks/useAuth";
import useHideLayoutElements from "@/hooks/useHideLayoutElements";
import { useGetProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";

export default function Header() {
  const router = useRouter();
  const { data: user, isFetching: isUserFetching } = useAuthUser();
  const { data: profile, isFetching } = useGetProfile(user?.id ?? "");
  const singOutMutation = useSignOut();
  const withoutHeader = useHideLayoutElements();

  const handleSignOut = async () => {
    await singOutMutation.mutateAsync();
    router.refresh();
  };

  const isLoggedIn = !!user;
  const isLoading = (isFetching || isUserFetching) && !profile;

  if (withoutHeader) return null;

  return (
    <header className="sticky top-0 z-50">
      <Container
        fullWidth
        className="flex items-center justify-between py-2 md:py-4 bg-background"
      >
        <Link
          href={routes.home}
          className="flex items-center gap-2 no-underline"
        >
          <Image
            src={"/histogram.png"}
            alt="Histogram"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <h1 className={cn("font-bold", caesarDressing.className)}>Histogram</h1>
        </Link>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-28 h-12 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-full hidden md:block" />
          </div>
        ) :
          <div className="flex items-center gap-4">
            {!isLoggedIn && !isLoading &&
              <div className="flex items-center gap-4">
                <ThemeSwitch />
                <Link
                  href={routes.login}
                  asButton
                  variant="spartan"
                  className="no-underline hidden md:block"
                >Log in
                </Link>
                <Link
                  href={routes.register}
                  asButton
                  className="no-underline hidden md:block"
                >Register
                </Link>
              </div>
            }
            {isLoggedIn &&
              <div className="flex items-center gap-4">
                <HeartIcon className="md:hidden"/>
                <ThemeSwitch className="hidden md:block" />
                <div className="hidden md:block">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Avatar
                        src={profile?.avatar_url ?? ""}
                        fallback={profile?.username?.[0].toUpperCase() ?? profile?.fullname?.[0].toUpperCase() ?? ""}
                      />
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="space-y-6"
                      align="end"
                    >
                      <div className="grid justify-items-center space-y-2">
                        <Avatar
                          src={profile?.avatar_url ?? ""}
                          fallback={profile?.username?.[0].toUpperCase() ?? profile?.fullname?.[0].toUpperCase() ?? ""}
                        />
                        <p>{profile?.username ?? profile?.fullname}</p>
                        <small>{profile?.email ?? user.email}</small>
                      </div>
                      <Separator />
                      <Link
                        href={routes.editProfile.replace(":username", profile?.username ?? "")}
                        className="no-underline flex gap-2 items-center"
                      >
                        <UserRoundPen />
                        Edit profile
                      </Link>
                      <Separator />
                      <Button
                        onClick={handleSignOut}
                        className="w-full"
                      ><LogOut className="text-spartan-400"/> Log out
                      </Button>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            }
          </div>
        }
      </Container>
    </header>
  );
}