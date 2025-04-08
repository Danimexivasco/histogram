import { routesWithoutHeader } from "@/lib/routes";
import { usePathname } from "next/navigation";

export default function useHideHeader() {
  const pathname = usePathname();

  const hideElements = routesWithoutHeader.includes(pathname);

  return hideElements;
}