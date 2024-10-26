import {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token");

  if (!token) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
