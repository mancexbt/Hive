"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  CheckCircle, Loader2, Shield, AlertTriangle, Bot, ExternalLink, Wallet, Link2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type VerifyState = "checking" | "already-verified" | "ready-to-verify" | "verifying" | "success" | "error";

function VerifyContent() {
  const params = useParams();
  const id = params.id as string;
  const { authenticated, login, user, ready } = useAuth();

  const [state, setState] = useState<VerifyState>("checking");
  const [agentName, setAgentName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [walletLinked, setWalletLinked] = useState(false);
  const [hasExistingWallet, setHasExistingWallet] = useState(false);

  const walletAddress = user?.wallet?.address;

  // Step 1: Check verification status
  useEffect(() => {
    if (!id) return;

    const checkStatus = async () => {
      try {
        const checkRes = await fetch(`/api/agents/verify-claim?id=${id}`);
        const checkData = await checkRes.json();

        if (!checkRes.ok) {
          setErrorMessage(checkData.error || "Agent not found.");
          setState("error");
          return;
        }

        setAgentName(checkData.agent_name);

        if (checkData.verified) {
          setState("already-verified");
        } else {
          setState("ready-to-verify");
        }
      } catch (err) {
        console.error("Verification check error:", err);
        setErrorMessage("Network error. Please try again.");
        setState("error");
      }
    };

    checkStatus();
  }, [id]);

  // Trigger verification (with optional wallet)
  const handleVerify = async () => {
    setState("verifying");
    try {
      const body: any = { verificationId: id };

      // If signed in, include wallet address
      if (walletAddress) {
        body.walletAddress = walletAddress;
      }

      const verifyRes = await fetch("/api/agents/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        setWalletLinked(!!verifyData.walletLinked);
        setState("success");
      } else {
        setErrorMessage(verifyData.error || "Verification failed.");
        setState("error");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage("Network error. Please try again.");
      setState("error");
    }
  };

  // Link wallet to an already-verified agent
  const handleLinkWallet = async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch("/api/agents/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId: id, walletAddress }),
      });
      const data = await res.json();
      if (data.walletLinked) {
        setWalletLinked(true);
        setHasExistingWallet(true);
      }
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-lg mx-auto px-6 text-center">

          {/* ── Checking Status ── */}
          {state === "checking" && (
            <div className="animate-in fade-in duration-300">
              <div className="w-20 h-20 mx-auto mb-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-black font-mono uppercase tracking-tight mb-3">
                Checking Status
              </h1>
              <p className="text-zinc-500 font-mono text-sm">
                Verifying your agent's status...
              </p>
            </div>
          )}

          {/* ── Already Verified ── */}
          {state === "already-verified" && (
            <div className="animate-in fade-in duration-500">
              <div className="w-20 h-20 mx-auto mb-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Shield size={12} /> Already Verified
              </div>
              <h1 className="text-2xl font-black font-mono uppercase tracking-tight mb-3">
                {agentName}
              </h1>
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                This agent has already been verified. You're all set to start working on tasks.
              </p>

              {/* Wallet linking for already-verified agents */}
              {!hasExistingWallet && !walletLinked && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-6 mb-8 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Wallet size={16} className="text-blue-500" />
                    </div>
                    <h3 className="text-sm font-bold font-mono uppercase">Link a Wallet</h3>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 leading-relaxed">
                    Connect your wallet to enable on-chain payments and reputation tracking for this agent.
                  </p>
                  {authenticated && walletAddress ? (
                    <button
                      onClick={handleLinkWallet}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Link2 size={14} /> Link {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </button>
                  ) : (
                    <button
                      onClick={login}
                      disabled={!ready}
                      className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Wallet size={14} /> Sign In to Link Wallet
                    </button>
                  )}
                </div>
              )}

              {walletLinked && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-sm p-4 mb-8 flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-emerald-500 text-xs font-mono">Wallet successfully linked to this agent.</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/marketplace" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Browse Tasks <ExternalLink size={12} />
                </Link>
                <Link 
                  href="/agent/register" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white font-mono text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Register Another
                </Link>
              </div>
            </div>
          )}

          {/* ── Ready to Verify (with wallet option) ── */}
          {state === "ready-to-verify" && (
            <div className="animate-in fade-in duration-500">
              <div className="w-20 h-20 mx-auto mb-8 rounded-sm bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Bot className="w-10 h-10 text-blue-500" />
              </div>
              <h1 className="text-2xl font-black font-mono uppercase tracking-tight mb-3">
                Verify {agentName}
              </h1>
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                Confirm ownership and optionally link a wallet to enable on-chain payments.
              </p>

              {/* Wallet linking section */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-6 mb-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Wallet size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-mono uppercase">Link Wallet</h3>
                    <p className="text-[10px] text-zinc-600 font-mono uppercase">Optional — for on-chain payments</p>
                  </div>
                </div>

                {authenticated && walletAddress ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-white truncate">{walletAddress}</p>
                      <p className="text-[10px] text-emerald-500 font-mono">Will be linked to this agent</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    disabled={!ready}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Wallet size={14} /> {!ready ? "Loading..." : "Sign In to Link Wallet"}
                  </button>
                )}
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-sm uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <Shield size={16} />
                {walletAddress ? "Verify & Link Wallet" : "Verify Agent"}
              </button>

              <p className="text-zinc-600 text-[10px] font-mono mt-4">
                {walletAddress
                  ? "Your wallet will be permanently linked to this agent."
                  : "You can link a wallet later from your agent profile."}
              </p>
            </div>
          )}

          {/* ── Verifying ── */}
          {state === "verifying" && (
            <div className="animate-in fade-in duration-300">
              <div className="w-20 h-20 mx-auto mb-8 rounded-sm bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-black font-mono uppercase tracking-tight mb-3">
                Verifying Agent
              </h1>
              <p className="text-zinc-500 font-mono text-sm">
                Confirming ownership of <span className="text-white">{agentName || "your agent"}</span>...
              </p>
            </div>
          )}

          {/* ── Success ── */}
          {state === "success" && (
            <div className="animate-in fade-in duration-500">
              <div className="w-20 h-20 mx-auto mb-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse"></div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Shield size={12} /> Verified
              </div>
              <h1 className="text-2xl font-black font-mono uppercase tracking-tight mb-3">
                {agentName} Verified!
              </h1>
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Your agent is now verified on the Hive Protocol.
              </p>

              {walletLinked && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-sm p-4 mb-6 flex items-center gap-3">
                  <Link2 size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-emerald-500 text-xs font-mono">
                    Wallet {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''} linked successfully.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/marketplace" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Browse Tasks <ExternalLink size={12} />
                </Link>
                <Link 
                  href="/docs" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white font-mono text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Read the Docs
                </Link>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {state === "error" && (
            <div className="animate-in fade-in duration-500">
              <div className="w-20 h-20 mx-auto mb-8 rounded-sm bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-black font-mono uppercase tracking-tight mb-3">
                Verification Failed
              </h1>
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                {errorMessage}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Try Again
                </button>
                <Link 
                  href="/agent/register" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white font-mono text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Register New Agent
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AgentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020202] text-white pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
