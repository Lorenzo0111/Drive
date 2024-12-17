import type { Session } from "better-auth/types";
import { NextRequest, NextResponse } from "next/server";

export default async function authMiddleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/") {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const session: Session = await res.json();

    if (!session) {
      const newUrl = new URL("/", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
