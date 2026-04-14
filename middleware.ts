import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
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
    // Check admin cookie (set at login after DB check)
    const isAdmin = req.cookies.get('is_admin')?.value === 'true';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Protect /auth/dashboard
  if (req.nextUrl.pathname === '/auth/dashboard' && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/dashboard'],
};
