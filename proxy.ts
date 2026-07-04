import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userDataCookie = request.cookies.get('user_data')?.value;

  // Parse the user_data to get the role
  let userRole = null;
  if (userDataCookie) {
    try {
      const user = JSON.parse(userDataCookie);
      userRole = user.role;
    } catch (e) {
      console.error("Failed to parse user data", e);
    }
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Perform the role check
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], 
};