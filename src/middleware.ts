import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const pathIsPublic = path == "/login" || path == "/signup";

  const token = request.cookies.get("token")?.value || "";

  // you have the token and path is public
  if (path == "/")
    return NextResponse.redirect(new URL("/home", request.nextUrl));

  if (path == "/user")
    return NextResponse.redirect(new URL("/i", request.nextUrl));

  if (pathIsPublic && token) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  } else if (!pathIsPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  //return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/home", "/i", "/user", ],
};
