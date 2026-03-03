import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const redirect = searchParams.get('redirect') || '/';

  if (secret === 'hive-beta-access') {
    const cookieStore = await cookies();
    cookieStore.set('hive_beta_access', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    });

    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.redirect(new URL('/', request.url));
}
