import { BetaGate } from '@/components/auth/BetaGate';

export default async function BountiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
