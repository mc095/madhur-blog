// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only apply to the admin blog editor route
  if (request.nextUrl.pathname.startsWith('/admin/secret-blog-editor')) {
    const authHeader = request.headers.get('authorization');
    
    // This is a simple implementation. For production, use a more secure method.
    const validAuth = process.env.BASIC_AUTH_CREDENTIALS || 'Basic YWRtaW46YWRtaW4='; // admin:admin
    
    if (authHeader !== validAuth) {
      // Return a response that triggers the browser's HTTP authentication
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Blog Editor"',
        },
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};