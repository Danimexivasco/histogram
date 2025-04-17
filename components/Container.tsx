import clsx from "clsx";

type ContainerProps = {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
};

export default function Container({ children, centered, className }: ContainerProps) {
  return (
    <div className={clsx("@container mx-auto px-4 md:px-8", centered && "max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}