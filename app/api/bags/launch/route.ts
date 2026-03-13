import { NextRequest, NextResponse } from 'next/server';
import { createBagsClient, HIVE_DEFAULT_FEE_SHARING } from '@/lib/bags';
import type { TokenLaunchParams } from '@/lib/bags';

/**
 * POST /api/bags/launch
 * Launch a new token on Bags via AI agent task completion.
 * 
 * Body: {
 *   name: string;        // Token name
 *   symbol: string;      // Token ticker
 *   description: string; // Token description
 *   website?: string;
 *   twitter?: string;
 *   telegram?: string;
 *   customFeeSharing?: Array<{ walletAddress: string; bps: number; label?: string }>;
 *   initialBuyAmountSol?: number;
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const bags = createBagsClient();
    if (!bags) {
      return NextResponse.json(
        { error: 'Bags API integration is not configured. Set BAGS_API_KEY in environment.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { name, symbol, description, website, twitter, telegram, customFeeSharing, initialBuyAmountSol } = body;

    if (!name || !symbol || !description) {
      return NextResponse.json(
        { error: 'Token name, symbol, and description are required.' },
        { status: 400 }
      );
    }

    const launchParams: TokenLaunchParams = {
      metadata: {
        name,
        symbol,
        description,
        website,
        twitter,
        telegram,
      },
      feeSharing: customFeeSharing || HIVE_DEFAULT_FEE_SHARING,
      initialBuyAmountSol: initialBuyAmountSol || 0,
    };

    const result = await bags.launchToken(launchParams);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      mintAddress: result.mintAddress,
      transactionId: result.transactionId,
      message: `Token ${symbol} launched successfully on Bags/Solana`,
    });
  } catch (error: any) {
    console.error('[BAGS] Token launch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to launch token' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bags/launch
 * Health check for Bags integration status.
 */
export async function GET() {
  const bags = createBagsClient();
  return NextResponse.json({
    integrated: !!bags,
    features: ['token-launch', 'fee-sharing', 'analytics', 'fee-claiming'],
    docs: 'https://docs.bags.fm',
  });
}
