import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * POST /api/agents/verify-claim
 * Handles the one-click verification from the link generated at registration.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(req);
    const rl = checkRateLimit(`verify-claim:${ip}`, RATE_LIMITS.VERIFY_CLAIM);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limited. Try again in ${rl.resetInSeconds}s.` },
        { status: 429, headers: { 'Retry-After': String(rl.resetInSeconds) } }
      );
    }

    const db = await getDb();
    const body = await req.json();
    const { verificationId } = body;

    if (!verificationId) {
      return NextResponse.json(
        { error: 'verificationId is required.' },
        { status: 400 }
      );
    }

    let agent;
    try {
      agent = await db.collection(COLLECTIONS.AGENTS).findOne({ _id: new ObjectId(verificationId) });
    } catch (error) {
      // Handles cases where the ID is not a valid ObjectId
      return NextResponse.json({ error: 'Invalid verification ID format.' }, { status: 400 });
    }

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found or link is invalid.' }, { status: 404 });
    }

    // Optional: link wallet address to the agent
    const { walletAddress } = body;

    if (agent.isVerified) {
      // Even if already verified, allow linking a wallet if one is provided and not already set
      if (walletAddress && !agent.walletAddress) {
        await db.collection(COLLECTIONS.AGENTS).updateOne(
          { _id: new ObjectId(verificationId) },
          { $set: { walletAddress, updatedAt: new Date() } }
        );
      }
      return NextResponse.json(
        { message: 'Agent is already verified.', walletLinked: !!(walletAddress && !agent.walletAddress) },
        { status: 200 }
      );
    }

    // Build the update: verify + optionally link wallet
    const updateFields: Record<string, any> = {
      isVerified: true,
      verifiedAt: new Date(),
      updatedAt: new Date(),
    };

    // If the agent has no wallet and one is provided, link it
    if (walletAddress && !agent.walletAddress) {
      updateFields.walletAddress = walletAddress;
    }

    // Mark the agent as verified (+ link wallet)
    const updateResult = await db.collection(COLLECTIONS.AGENTS).updateOne(
      { _id: new ObjectId(verificationId) },
      { $set: updateFields }
    );

    if (updateResult.modifiedCount === 0) {
        return NextResponse.json({ error: 'Failed to update agent status.' }, { status: 500 });
    }

    // Log this activity
    await db.collection(COLLECTIONS.ACTIVITY).insertOne({
      type: 'AgentVerified',
      agentId: verificationId,
      actorName: agent.name,
      metadata: {
        method: 'claim_url',
        walletLinked: !!walletAddress,
        walletAddress: walletAddress || null,
      },
      createdAt: new Date(),
    });

    return NextResponse.json({
      verified: true,
      agent_id: verificationId,
      walletLinked: !!(walletAddress && !agent.walletAddress),
      message: `Agent "${agent.name}" has been successfully verified.${walletAddress ? ' Wallet linked.' : ''}`,
    });

  } catch (error: any) {
    console.error('[HIVE] Claim Verification Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred during verification.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/verify-claim?id=<agentId>
 * Check verification status without triggering verification.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required.' }, { status: 400 });
    }

    const db = await getDb();

    let agent;
    try {
      agent = await db.collection(COLLECTIONS.AGENTS).findOne({ _id: new ObjectId(id) });
    } catch {
      return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    }

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found.' }, { status: 404 });
    }

    return NextResponse.json({
      verified: !!agent.isVerified,
      agent_name: agent.name || 'Unnamed Agent',
      agent_id: id,
    });
  } catch (error: any) {
    console.error('[HIVE] Verify-claim GET error:', error);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}
