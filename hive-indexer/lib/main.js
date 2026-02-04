"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_store_1 = require("@subsquid/typeorm-store");
const processor_1 = require("./processor");
const AuditBountyEscrow_1 = require("./abi/AuditBountyEscrow");
const model_1 = require("./model");
const db = new typeorm_store_1.TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: 'squid_processor'
});
processor_1.processor.run(db, async (ctx) => {
    const agents = new Map();
    const bounties = new Map();
    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (log.address !== processor_1.CONTRACT_ADDRESS)
                continue;
            // AgentRegistered
            if (log.topics[0] === AuditBountyEscrow_1.events.AgentRegistered.topic) {
                const { agentAddress, name } = AuditBountyEscrow_1.events.AgentRegistered.decode(log);
                const id = agentAddress.toLowerCase();
                let agent = agents.get(id) || await ctx.store.get(model_1.Agent, id);
                if (!agent) {
                    agent = new model_1.Agent({
                        id,
                        name,
                        bio: '',
                        registeredAt: BigInt(block.header.timestamp),
                        reputation: 0n,
                        isActive: true
                    });
                }
                agents.set(id, agent);
            }
            // BountyCreated
            if (log.topics[0] === AuditBountyEscrow_1.events.BountyCreated.topic) {
                const { bountyId, client, amount, codeUri } = AuditBountyEscrow_1.events.BountyCreated.decode(log);
                const id = bountyId.toString();
                const bounty = new model_1.Bounty({
                    id,
                    client: client.toLowerCase(),
                    amount: BigInt(amount.toString()),
                    codeUri,
                    isOpen: true,
                    createdAt: BigInt(block.header.timestamp),
                    txHash: log.transactionHash
                });
                bounties.set(id, bounty);
            }
            // WorkSubmitted
            if (log.topics[0] === AuditBountyEscrow_1.events.WorkSubmitted.topic) {
                const { bountyId, agent, reportUri } = AuditBountyEscrow_1.events.WorkSubmitted.decode(log);
                const id = bountyId.toString();
                let bounty = bounties.get(id) || await ctx.store.get(model_1.Bounty, id);
                if (bounty) {
                    bounty.reportUri = reportUri;
                    // Link agent
                    const agentId = agent.toLowerCase();
                    let agentEntity = agents.get(agentId) || await ctx.store.get(model_1.Agent, agentId);
                    if (agentEntity) {
                        bounty.assignedAgent = agentEntity;
                    }
                    bounties.set(id, bounty);
                }
            }
            // BountyFinalized
            if (log.topics[0] === AuditBountyEscrow_1.events.BountyFinalized.topic) {
                const { bountyId, agent, amount, isValid } = AuditBountyEscrow_1.events.BountyFinalized.decode(log);
                const id = bountyId.toString();
                let bounty = bounties.get(id) || await ctx.store.get(model_1.Bounty, id);
                if (bounty) {
                    bounty.isOpen = false;
                    bounty.closedAt = BigInt(block.header.timestamp);
                    // Link completing agent
                    const agentId = agent.toLowerCase();
                    let agentEntity = agents.get(agentId) || await ctx.store.get(model_1.Agent, agentId);
                    if (agentEntity) {
                        bounty.completedBy = agentEntity;
                        // Update reputation if valid
                        if (isValid) {
                            agentEntity.reputation = (agentEntity.reputation || 0n) + 10n;
                            agents.set(agentId, agentEntity);
                        }
                    }
                    bounties.set(id, bounty);
                }
            }
        }
    }
    // Persist all changes
    await ctx.store.upsert([...agents.values()]);
    await ctx.store.upsert([...bounties.values()]);
});
