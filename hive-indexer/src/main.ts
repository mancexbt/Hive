import 'dotenv/config'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor, CONTRACT_ADDRESS } from './processor'
import { events } from './abi/AuditBountyEscrow'
import { Agent, Bounty } from './model'

const db = new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: 'squid_processor'
})

processor.run(db, async (ctx) => {
    const agents: Map<string, Agent> = new Map()
    const bounties: Map<string, Bounty> = new Map()

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (log.address !== CONTRACT_ADDRESS) continue

            // AgentRegistered
            if (log.topics[0] === events.AgentRegistered.topic) {
                const { agentAddress, name } = events.AgentRegistered.decode(log)
                const id = agentAddress.toLowerCase()
                
                let agent = agents.get(id) || await ctx.store.get(Agent, id)
                if (!agent) {
                    agent = new Agent({
                        id,
                        name,
                        bio: '',
                        registeredAt: BigInt(block.header.timestamp),
                        reputation: 0n,
                        isActive: true
                    })
                }
                agents.set(id, agent)
            }

            // BountyCreated
            if (log.topics[0] === events.BountyCreated.topic) {
                const { bountyId, client, amount, codeUri } = events.BountyCreated.decode(log)
                const id = bountyId.toString()
                
                const bounty = new Bounty({
                    id,
                    client: client.toLowerCase(),
                    amount: BigInt(amount.toString()),
                    codeUri,
                    isOpen: true,
                    createdAt: BigInt(block.header.timestamp),
                    txHash: log.transactionHash
                })
                bounties.set(id, bounty)
            }

            // WorkSubmitted
            if (log.topics[0] === events.WorkSubmitted.topic) {
                const { bountyId, agent, reportUri } = events.WorkSubmitted.decode(log)
                const id = bountyId.toString()
                
                let bounty = bounties.get(id) || await ctx.store.get(Bounty, id)
                if (bounty) {
                    bounty.reportUri = reportUri
                    // Link agent
                    const agentId = agent.toLowerCase()
                    let agentEntity = agents.get(agentId) || await ctx.store.get(Agent, agentId)
                    if (agentEntity) {
                        bounty.assignedAgent = agentEntity
                    }
                    bounties.set(id, bounty)
                }
            }

            // BountyFinalized
            if (log.topics[0] === events.BountyFinalized.topic) {
                const { bountyId, agent, amount, isValid } = events.BountyFinalized.decode(log)
                const id = bountyId.toString()
                
                let bounty = bounties.get(id) || await ctx.store.get(Bounty, id)
                if (bounty) {
                    bounty.isOpen = false
                    bounty.closedAt = BigInt(block.header.timestamp)
                    
                    // Link completing agent
                    const agentId = agent.toLowerCase()
                    let agentEntity = agents.get(agentId) || await ctx.store.get(Agent, agentId)
                    if (agentEntity) {
                        bounty.completedBy = agentEntity
                        // Update reputation if valid
                        if (isValid) {
                            agentEntity.reputation = (agentEntity.reputation || 0n) + 10n
                            agents.set(agentId, agentEntity)
                        }
                    }
                    bounties.set(id, bounty)
                }
            }
        }
    }

    // Persist all changes
    await ctx.store.upsert([...agents.values()])
    await ctx.store.upsert([...bounties.values()])
})
