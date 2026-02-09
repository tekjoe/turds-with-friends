import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need session handling
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/auth/");

  // For public routes, just pass through without checking session
  if (isPublicRoute) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect authenticated routes
    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/log") ||
      pathname.startsWith("/leaderboard") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/friends") ||
      pathname.startsWith("/activity");

    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users without a username to onboarding
    if (user && pathname !== "/onboarding") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!profile?.username) {
        console.log("Middleware: No username found for user", user.id, "Profile:", profile);
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      } else {
        console.log("Middleware: Username found", profile.username);
      }
    }

    return supabaseResponse;
  } catch (error) {
    // If there's an error, just pass through
    console.error("Middleware error:", error);
    return NextResponse.next({ request });
  }
}
