import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const setupRoutes = ["/setup"];

export async function middleware(request: NextRequest) {
  // Check for setup route access
  const isSetupRoute = setupRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if setup is already complete via environment variable
  // This will be set to 'true' after setup completion
  const isSetupComplete = process.env.SETUP_COMPLETE === "true";

  // If the user requests the root path and setup isn't complete,
  // redirect them to the setup page.
  if (request.nextUrl.pathname === "/" && !isSetupComplete) {
    const url = request.nextUrl.clone();
    url.pathname = "/setup";
    return NextResponse.redirect(url);
  }

  if (isSetupRoute) {
    // Only allow setup access in development mode
    if (process.env.NODE_ENV !== "development") {
      const url = request.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.redirect(url);
    }

    // Check for force parameter
    const forceSetup = request.nextUrl.searchParams.get("force") === "true";

    if (isSetupComplete && !forceSetup) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redirect to landing page, not dashboard
      return NextResponse.redirect(url);
    }

    // Allow access to setup
    return NextResponse.next({ request });
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
