import { NextRequest, NextResponse } from 'next/server';


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
}

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
