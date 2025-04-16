import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authRoutes, protectedRoutes, routes } from "../routes";

function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    const pattern = new RegExp("^" + route.replace(/:\w+/g, "[^/]+") + "$");
    return pattern.test(pathname);
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && matchRoute(request.nextUrl.pathname, protectedRoutes)) return NextResponse.redirect(new URL(routes.login, request.url));

  if (user && matchRoute(request.nextUrl.pathname, authRoutes)) return NextResponse.redirect(new URL(routes.home, request.url));

  return supabaseResponse;
}
