import { BetaGate } from '@/components/auth/BetaGate';

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
