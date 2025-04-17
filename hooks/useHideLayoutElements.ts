import { authRoutes } from "@/lib/routes";
import { usePathname } from "next/navigation";

export default function useHideLayoutElements() {
  const pathname = usePathname();

  const hideElements = authRoutes.includes(pathname);

  return hideElements;
}