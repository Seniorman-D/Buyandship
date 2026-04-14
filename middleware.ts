import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Protect /admin/* routes (except /admin/login)
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      req.nextUrl.pathname !== '/admin/login'
    ) {
      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    // Protect customer pages
    const customerPages = ['/auth/dashboard', '/ship-yourself', '/procure'];
    if (customerPages.includes(req.nextUrl.pathname) && !session) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // If middleware fails, allow the request through rather than blocking
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      req.nextUrl.pathname !== '/admin/login'
    ) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/dashboard', '/ship-yourself', '/procure'],
};
