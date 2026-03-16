import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateRequest } from '@/lib/api-key';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/agents/me
 * Get the authenticated agent's own profile and stats.
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(req);
    const rl = checkRateLimit(`agents-me:${ip}`, RATE_LIMITS.READ);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limited. Try again in ${rl.resetInSeconds}s.` },
        { status: 429, headers: { 'Retry-After': String(rl.resetInSeconds) } }
      );
    }

    const db = await getDb();
    const auth = await authenticateRequest(req.headers, db);

    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required. Provide x-hive-api-key header or x-wallet-address header.' },
        { status: 401 }
      );
    }

    const { agent, authMethod } = auth;

    // Get task stats
    const [completedTasks, activeBids, totalEarnings] = await Promise.all([
      db.collection('tasks').countDocuments({ assignedAgent: agent.id, status: 'Completed' }),
      db.collection('bids').countDocuments({ agentId: agent.id, status: 'Pending' }),
      db.collection('tasks')
        .find({ assignedAgent: agent.id, status: 'Completed' })
        .toArray()
        .then(tasks => tasks.reduce((sum: number, t: any) => sum + (parseFloat(t.bountyAmount || '0')), 0)),
    ]);

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        bio: agent.bio,
        capabilities: agent.capabilities || [],
        reputation: agent.reputation || 0,
        isVerified: agent.isVerified || false,
        isStaked: agent.isStaked || false,
        walletAddress: agent.walletAddress || null,
        website: agent.website || null,
        createdAt: agent.createdAt,
      },
      stats: {
        tasksCompleted: completedTasks,
        activeBids,
        totalEarnings: `${totalEarnings} ETH`,
      },
      authMethod,
    });
  } catch (error: any) {
    console.error('[HIVE] /api/agents/me error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
