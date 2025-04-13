"use client";

import Link from "@/components/ui/Link";
import Image from "next/image";
import { LogOut, UserRoundPen } from "lucide-react";
import { useAuthUser, useSignOut } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { caesarDressing } from "@/assets/fonts";
import useHideHeader from "@/hooks/useHideHeader";
import Container from "./Container";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Skeleton } from "./ui/Skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { Separator } from "./ui/Separator";
import { routes } from "@/lib/routes";
import { useGetProfile } from "@/hooks/useProfile";

export default function Header() {
  const { data: user } = useAuthUser();
  const { data: profile, isFetching } = useGetProfile(user?.id ?? "");
  const singOutMutation = useSignOut();
  const withoutHeader = useHideHeader();

  const handleSignOut = async () => {
    await singOutMutation.mutateAsync();
  };

  const isLoggedIn = !!user;
  const isLoading = isFetching && !profile;

  if (withoutHeader) return null;

  return (
    <header>
      <Container className="flex items-center justify-between py-4">
        <Link
          href={routes.home}
          className="flex items-center gap-2 no-underline"
        >
          <Image
            src={"/histogram.png"}
            alt="Histogram"
            width={40}
            height={40}
          />
          <h1 className={cn("text-2xl font-bold", caesarDressing.className)}>Histogram</h1>
        </Link>
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-28 h-12 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-full" />
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
                  className="no-underline"
                >Log in
                </Link>
                <Link
                  href={routes.register}
                  asButton
                  className="no-underline"
                >Register
                </Link>
              </div>
            }
            {isLoggedIn &&
              <div className="flex items-center gap-4">
                <ThemeSwitch />
                <HoverCard>
                  <HoverCardTrigger>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={profile?.avatar_url ?? ""} />
                      <AvatarFallback>{profile?.username?.[0].toUpperCase() ?? profile?.fullname?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="space-y-6"
                    align="end"
                  >
                    <div className="grid justify-items-center space-y-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile?.avatar_url ?? ""} />
                        <AvatarFallback>{profile?.username?.[0].toUpperCase() ?? profile?.fullname?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <p>{profile?.username ?? profile?.fullname}</p>
                      <small>{user.email}</small>
                    </div>
                    <Separator />
                    <Link
                      href={routes.profile}
                      className="no-underline flex gap-2 items-center"
                    >
                      <UserRoundPen />
                      Edit profile
                    </Link>
                    <Separator />
                    <Button
                      onClick={handleSignOut}
                      className="w-full"
                    ><LogOut color="red"/> Log out
                    </Button>
                  </HoverCardContent>
                </HoverCard>
              </div>
            }
          </div>
        }
      </Container>
    </header>
  );
}