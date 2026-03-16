import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/db';

/**
 * GET /api/leaderboard
 * Paginated, performant leaderboard. Uses MongoDB aggregation
 * instead of N+1 queries per agent.
 *
 * Query: ?page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const db = await getDb();

    // Get total agent count for stats/pagination
    const totalAgents = await db.collection(COLLECTIONS.AGENTS).countDocuments({});

    // Use aggregation pipeline to calculate stats efficiently
    const pipeline = [
      // Lookup bids (proposals) for each agent
      {
        $lookup: {
          from: COLLECTIONS.BIDS,
          let: { agentId: { $toString: '$_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$agentId', '$$agentId'] } } },
            { $count: 'count' },
          ],
          as: 'bidStats',
        },
      },
      // Lookup submissions for each agent
      {
        $lookup: {
          from: 'submissions',
          let: { agentId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$agentId', '$$agentId'] },
                    { $in: ['$status', ['Approved', 'Submitted']] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'submissionStats',
        },
      },
      // Add computed fields
      {
        $addFields: {
          totalProposals: {
            $ifNull: [{ $arrayElemAt: ['$bidStats.count', 0] }, 0],
          },
          completedTasks: {
            $ifNull: [{ $arrayElemAt: ['$submissionStats.count', 0] }, 0],
          },
        },
      },
      {
        $addFields: {
          computedReputation: {
            $add: [
              { $multiply: ['$completedTasks', 100] },
              { $multiply: ['$totalProposals', 10] },
            ],
          },
        },
      },
      // Sort by reputation
      { $sort: { computedReputation: -1 as const } },
      // Facet for pagination + totals
      {
        $facet: {
          agents: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                id: { $toString: '$_id' },
                name: { $ifNull: ['$name', 'Unnamed Agent'] },
                bio: { $ifNull: ['$bio', 'No bio provided'] },
                address: { $ifNull: ['$walletAddress', ''] },
                reputation: '$computedReputation',
                completedTasks: 1,
                totalProposals: 1,
                registeredAt: { $ifNull: ['$createdAt', '$registeredAt'] },
              },
            },
          ],
          totals: [
            {
              $group: {
                _id: null,
                totalReputation: { $sum: '$computedReputation' },
                totalCompleted: { $sum: '$completedTasks' },
              },
            },
          ],
        },
      },
    ];

    const [result] = await db.collection(COLLECTIONS.AGENTS).aggregate(pipeline).toArray();

    const agents = result?.agents || [];
    const totals = result?.totals?.[0] || { totalReputation: 0, totalCompleted: 0 };

    return NextResponse.json({
      agents,
      total: totalAgents,
      page,
      limit,
      totalPages: Math.ceil(totalAgents / limit),
      stats: {
        totalAgents,
        totalReputation: totals.totalReputation,
        totalCompleted: totals.totalCompleted,
      },
    });
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
