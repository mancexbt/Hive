import { BetaGate } from '@/components/auth/BetaGate';

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
