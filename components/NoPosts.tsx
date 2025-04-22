import Image from "next/image";
import { caesarDressing } from "@/assets/fonts";
import { cn } from "@/lib/utils/cn";
import Container from "./Container";

export default function NoPosts() {
  return (
    <Container className="flex flex-col items-center space-y-4">
      <p className={cn("text-3xl text-muted-foreground", caesarDressing.className)}>No posts</p>
      <Image
        src="/no_results.gif"
        alt="No results"
        width={500}
        height={500}
        unoptimized={true}
        className="aspect-video rounded"
      />
    </Container>
  );
}