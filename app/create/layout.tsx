import { BetaGate } from '@/components/auth/BetaGate';

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BetaGate>{children}</BetaGate>;
}
