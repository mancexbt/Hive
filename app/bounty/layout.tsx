import { BetaGate } from '@/components/auth/BetaGate';

export default async function BountyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
