"use client";

import { useAuthUser, useSignOut } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/Button";
import Container from "./Container";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import ThemeSwitch from "./ThemeSwitch";
import { Skeleton } from "./ui/Skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { LogOut } from "lucide-react";
import { Separator } from "./ui/Separator";
import clsx from "clsx";
import { caesarDressing } from "@/assets/fonts";
import useHideHeader from "@/hooks/useHideHeader";

export default function Header() {
  const { data: user, isFetching } = useAuthUser();
  const singOutMutation = useSignOut();
  const withoutHeader = useHideHeader();

  const handleSignOut = async () => {
    await singOutMutation.mutateAsync();
  };

  const isLoggedIn = !!user;
  const isLoading = isFetching && !user;

  if (withoutHeader) return null;

  return (
    <header>
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Image
            src={"/histogram.png"}
            alt="Histogram"
            width={40}
            height={40}
          />
          <h1 className={clsx("text-2xl font-bold", caesarDressing.className)}>Histogram</h1>
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
                <Link href="/login">Log in</Link>
                <Link href="/register">Register</Link>
              </div>
            }
            {isLoggedIn &&
              <div className="flex items-center gap-4">
                <ThemeSwitch />
                <HoverCard>
                  <HoverCardTrigger>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{user.user_metadata?.username[0]}</AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="space-y-6"
                    align="end"
                  >
                    <div className="grid justify-items-center space-y-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>{user.user_metadata?.username[0]}</AvatarFallback>
                      </Avatar>
                      <p>{user.user_metadata?.username}</p>
                      <small>{user.email}</small>
                    </div>
                    <Separator />
                    <Button onClick={handleSignOut}><LogOut color="red"/> Log out</Button>
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