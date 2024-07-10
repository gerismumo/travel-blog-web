import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function middleware(req: NextRequest) {
  const isPreflight = req.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      'Access-Control-Allow-Origin': '*',
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    //authenticate user here
    const user = req.cookies.get('user')?.value && JSON.parse(req.cookies.get('user')?.value as any);
    if (!user) {
      return NextResponse.redirect(new URL('/', req.url));
    }
}

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
