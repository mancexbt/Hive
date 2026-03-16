import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";

export function useAuth() {
  const privy = usePrivy();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  
  const [prevAddress, setPrevAddress] = useState<string | null>(null);
  const [authStabilized, setAuthStabilized] = useState(false);

  // Stabilization delay: after Privy authenticates, wait for wagmi to sync
  // This prevents the wallet switch detection from firing too early
  // (especially for email sign-in where an embedded wallet is created)
  useEffect(() => {
    if (!privy.authenticated) {
      setAuthStabilized(false);
      return;
    }

    // Give wagmi 3 seconds to sync with the new Privy session
    const timer = setTimeout(() => {
      setAuthStabilized(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [privy.authenticated]);

  // Check if user has an embedded wallet (email/social sign-in)
  const hasEmbeddedWallet = privy.user?.linkedAccounts?.some(
    (account: any) => account.type === 'wallet' && account.walletClientType === 'privy'
  );

  // Detect MetaMask wallet switches via wagmi
  // Only runs for external wallet users (not email/social sign-in)
  // and only after auth has stabilized (wagmi has had time to sync)
  useEffect(() => {
    if (!privy.authenticated || !wagmiAddress || !authStabilized || hasEmbeddedWallet) return;

    const currentPrivyAddress = privy.user?.wallet?.address?.toLowerCase();
    const currentWagmiAddress = wagmiAddress?.toLowerCase();

    // If this is the first time, store and skip
    if (!prevAddress) {
      setPrevAddress(currentWagmiAddress || null);
      return;
    }

    // If wagmi detects a different address than what Privy knows
    if (currentWagmiAddress && currentPrivyAddress && currentWagmiAddress !== currentPrivyAddress) {
      console.log(`Wallet switch detected: ${currentPrivyAddress} → ${currentWagmiAddress}`);
      toast.info("Wallet changed", {
        description: "Reconnecting with the new wallet..."
      });
      privy.logout().then(() => {
        setPrevAddress(null);
      });
    }
  }, [wagmiAddress, privy.authenticated, privy.user?.wallet?.address, authStabilized, hasEmbeddedWallet, prevAddress, privy]);

  // Handle disconnect from wagmi side (user disconnected in MetaMask)
  // Skip for embedded wallet users — their wallet is managed by Privy, not wagmi
  useEffect(() => {
    if (!authStabilized || hasEmbeddedWallet) return;
    if (privy.authenticated && prevAddress && !wagmiConnected) {
      console.log("Wallet disconnected externally");
      privy.logout().then(() => {
        setPrevAddress(null);
      });
    }
  }, [wagmiConnected, privy.authenticated, prevAddress, authStabilized, hasEmbeddedWallet, privy]);

  return privy;
}
