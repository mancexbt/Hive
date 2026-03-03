import { BetaGate } from '@/components/auth/BetaGate';

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
