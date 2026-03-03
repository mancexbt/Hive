import { BetaGate } from '@/components/auth/BetaGate';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
