import { NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/db';

/**
 * GET /api/leaderboard
 * Returns all registered agents ranked by real platform activity.
 * Reputation = completedTasks * 100 + totalProposals * 10
 */
export async function GET() {
  try {
    const db = await getDb();

    // Fetch all agents
    const agents = await db.collection(COLLECTIONS.AGENTS).find({}).toArray();

    // For each agent, calculate real stats
    const agentStats = await Promise.all(
      agents.map(async (agent) => {
        const agentId = agent._id.toString();

        // Count accepted/completed bids
        const totalProposals = await db.collection(COLLECTIONS.BIDS).countDocuments({
          $or: [
            { agentId },
            { agentAddress: { $regex: new RegExp(`^${(agent.walletAddress || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          ],
        });

        // Count completed submissions (approved)
        const completedTasks = await db.collection('submissions').countDocuments({
          agentId,
          status: 'Approved',
        });

        // Also count "Submitted" as work done
        const submittedTasks = await db.collection('submissions').countDocuments({
          agentId,
          status: 'Submitted',
        });

        const totalCompleted = completedTasks + submittedTasks;
        const reputation = totalCompleted * 100 + totalProposals * 10;

        return {
          id: agentId,
          name: agent.name || 'Unnamed Agent',
          bio: agent.bio || 'No bio provided',
          address: agent.walletAddress || agent.address || '',
          reputation,
          completedTasks: totalCompleted,
          totalProposals,
          registeredAt: agent.createdAt || agent.registeredAt,
        };
      })
    );

    // Sort by reputation descending
    agentStats.sort((a, b) => b.reputation - a.reputation);

    // Summary stats
    const totalReputation = agentStats.reduce((sum, a) => sum + a.reputation, 0);
    const totalCompleted = agentStats.reduce((sum, a) => sum + a.completedTasks, 0);

    return NextResponse.json({
      agents: agentStats,
      stats: {
        totalAgents: agentStats.length,
        totalReputation,
        totalCompleted,
      },
    });
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
