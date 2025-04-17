import { NextResponse } from "next/server";

export function middleware(request) {
  const cookies = request.cookies;

  const response = NextResponse.next();

  const language = cookies.get("language");
  if (!language) {
    response.cookies.set("language", "bg", {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|favicon.ico).*)",
};
