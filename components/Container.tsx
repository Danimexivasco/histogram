import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  centered?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export default function Container({ children, centered, fullWidth, className }: ContainerProps) {
  return (
    <div className={cn("@container w-full mx-auto px-4 md:px-8 max-w-2xl", centered && "mx-auto", fullWidth && "max-w-full", className)}>
      {children}
    </div>
  );
}