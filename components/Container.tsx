import clsx from "clsx";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx("@container mx-auto px-4 md:px-8", className)}>
      {children}
    </div>
  );
}