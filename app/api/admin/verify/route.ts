import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/verify?address=0x...
 * Server-side admin verification. The admin address is stored in a
 * server-only env var (ADMIN_ADDRESS) so it never leaks to the client bundle.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ isAdmin: false });
  }

  const adminAddress = process.env.ADMIN_ADDRESS || process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

  if (!adminAddress) {
    return NextResponse.json({ isAdmin: false });
  }

  const isAdmin = address.toLowerCase() === adminAddress.toLowerCase();
  return NextResponse.json({ isAdmin });
}
