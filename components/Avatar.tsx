import { cn } from "@/lib/utils";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage
} from "./ui/Avatar";
import { ReactNode } from "react";

type AvatarProps = {
  src: string;
  fallback: string | ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallbackClassName?: string;
};

export default function Avatar({ src, fallback, size = "md", className, fallbackClassName }: AvatarProps) {
  const getAvatarClassnamesBySize = () => {
    switch (size) {
    case "sm":
      return "w-8 h-8 md:w-9 md:h-9";
    case "md":
      return "w-11 h-11 md:w-12 md:h-12";
    case "lg":
      return "w-20 h-20 md:w-24 md:h-24";
    }
  };

  return (
    <ShadcnAvatar className={cn(getAvatarClassnamesBySize(), className)}>
      <AvatarImage
        src={src ?? ""}
        alt="Avatar image"
      />
      <AvatarFallback className={fallbackClassName}>{fallback}</AvatarFallback>
    </ShadcnAvatar>
  );
}