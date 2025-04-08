import clsx from "clsx";
import { default as NextLink } from "next/link";
import { buttonVariants } from "./Button";
import { VariantProps } from "class-variance-authority";

type LinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  asButton?: boolean;
  variant?: string;
  size?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Link({ href, asButton = false, variant = "default", size = "default", className, children }: LinkProps) {
  return (
    <NextLink
      href={href}
      className={clsx(asButton && buttonVariants({
        variant,
        size
      }),
      className
      )}
    >
      {children}
    </NextLink>
  );
}