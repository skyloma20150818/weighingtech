import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 生产环境下保护 /dev-editor 路由
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/dev-editor')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/dev-editor/:path*',
};
