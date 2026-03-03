import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface BetaGateProps {
  children: React.ReactNode;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function BetaGate({ children, searchParams }: BetaGateProps) {
  const cookieStore = await cookies();
  const resolvedParams = searchParams ? await searchParams : {};
  
  // Check if secret param is provided — grant access
  const secret = resolvedParams?.secret;
  if (secret === 'hive-beta-access') {
    // Set the cookie for future visits
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
