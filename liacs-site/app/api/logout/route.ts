import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Clear the token cookie
  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // Expire immediately
      expires: new Date(0),
      path: '/',
    })
  );
  return response;
}
