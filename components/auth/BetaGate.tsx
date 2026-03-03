import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function BetaGate({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Parse the URL to check for secret param
  const fullUrl = headersList.get('x-url') || headersList.get('x-forwarded-url') || '';
  const referer = headersList.get('referer') || '';
  
  // Check URL search params for secret (from referer or custom header)
  const urlToCheck = fullUrl || referer;
  let hasSecret = false;
  try {
    if (urlToCheck) {
      const url = new URL(urlToCheck);
      hasSecret = url.searchParams.get('secret') === 'hive-beta-access';
    }
  } catch {
    // Invalid URL, ignore
  }

  // If secret param is provided, set cookie and allow access
  if (hasSecret) {
    cookieStore.set('hive_beta_access', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    });
    return <>{children}</>;
  }

  // Check if beta access cookie exists
  const betaAccess = cookieStore.get('hive_beta_access');
  if (betaAccess?.value === 'true') {
    return <>{children}</>;
  }

  // No access — redirect to landing page
  redirect('/');
}
