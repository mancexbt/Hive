import { BetaGate } from '@/components/auth/BetaGate';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
