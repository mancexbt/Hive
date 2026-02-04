import { usePrivy } from "@privy-io/react-auth";
import { useReadContract } from "wagmi";

// Hardcoded mock user for development when network is blocked
const MOCK_USER = {
  wallet: {
    address: "0x054e47c8DEF7Efa65Bf9F5bA4e3476c013482298", // Admin/Deployer mock
    chainId: "84532"
  },
  id: "did:privy:mock-user-id",
  email: { address: "dev@luxenlabs.com" }
};

export function useAuth() {
  const privy = usePrivy();
  const mockAuthEnabled = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

  if (mockAuthEnabled) {
    return {
      ...privy,
      ready: true,
      authenticated: true,
      user: MOCK_USER as any,
      login: async () => { console.log("Mock login success"); },
      logout: async () => { console.log("Mock logout"); },
      // Allow overriding checks
      isMock: true
    };
  }

  return { ...privy, isMock: false };
}
