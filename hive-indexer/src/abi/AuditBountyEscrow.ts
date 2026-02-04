import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AgentRegistered: event("0xda816ca2fc37b9eecec62ae8263008ec6be1afb38dc28bc9c7c51d7e348da9c2", "AgentRegistered(address,string)", {"agentAddress": indexed(p.address), "name": p.string}),
    BountyCreated: event("0xaa830c985894057f0d100743defcad006f0a1abc40d080c9a23acc9a81106849", "BountyCreated(uint256,address,uint256,string)", {"bountyId": indexed(p.uint256), "client": indexed(p.address), "amount": p.uint256, "codeUri": p.string}),
    BountyFinalized: event("0xb83e349a728a54646364f9a2137d98e9ba63bf182cc5fff571516f66313cd64d", "BountyFinalized(uint256,address,uint256,bool)", {"bountyId": indexed(p.uint256), "agent": indexed(p.address), "amount": p.uint256, "isValid": p.bool}),
    BountyRefunded: event("0xf1ed347f033f54c0d6f1589c933d81b4256cf2f72a785106e3653a565f7433a2", "BountyRefunded(uint256,address,uint256)", {"bountyId": indexed(p.uint256), "client": indexed(p.address), "amount": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    WorkSubmitted: event("0xd5d9bc882dc95f198786a74e52a0b87e49a07c80921b74821ba374339e394d30", "WorkSubmitted(uint256,address,string)", {"bountyId": indexed(p.uint256), "agent": indexed(p.address), "reportUri": p.string}),
}

export const functions = {
    agentList: viewFun("0x2f80c54f", "agentList(uint256)", {"_0": p.uint256}, p.address),
    agentReputation: viewFun("0x54de6e32", "agentReputation(address)", {"_0": p.address}, p.uint256),
    agents: viewFun("0xfd66091e", "agents(address)", {"_0": p.address}, {"name": p.string, "bio": p.string, "wallet": p.address, "isRegistered": p.bool, "registeredAt": p.uint256}),
    bounties: viewFun("0xdc2f8744", "bounties(uint256)", {"_0": p.uint256}, {"client": p.address, "amount": p.uint256, "codeUri": p.string, "isOpen": p.bool, "assignedAgent": p.address, "reportUri": p.string, "createdAt": p.uint256}),
    bountyCounter: viewFun("0xa0d59787", "bountyCounter()", {}, p.uint256),
    createBounty: fun("0x06868c4b", "createBounty(string)", {"_codeUri": p.string}, ),
    finalizeBounty: fun("0x1aafcd53", "finalizeBounty(uint256,address,bool,uint256)", {"_bountyId": p.uint256, "_agent": p.address, "_isValid": p.bool, "_scoreToAdd": p.uint256}, ),
    getAllAgents: viewFun("0x860e4ac6", "getAllAgents()", {}, p.array(p.struct({"name": p.string, "bio": p.string, "wallet": p.address, "isRegistered": p.bool, "registeredAt": p.uint256}))),
    getBounty: viewFun("0xee8c4bbf", "getBounty(uint256)", {"_bountyId": p.uint256}, p.struct({"client": p.address, "amount": p.uint256, "codeUri": p.string, "isOpen": p.bool, "assignedAgent": p.address, "reportUri": p.string, "createdAt": p.uint256})),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    refundBounty: fun("0x58b1f29c", "refundBounty(uint256)", {"_bountyId": p.uint256}, ),
    registerAgent: fun("0xff17aca4", "registerAgent(string,string)", {"_name": p.string, "_bio": p.string}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    submitWork: fun("0xda8accf9", "submitWork(uint256,string)", {"_bountyId": p.uint256, "_reportUri": p.string}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
}

export class Contract extends ContractBase {

    agentList(_0: AgentListParams["_0"]) {
        return this.eth_call(functions.agentList, {_0})
    }

    agentReputation(_0: AgentReputationParams["_0"]) {
        return this.eth_call(functions.agentReputation, {_0})
    }

    agents(_0: AgentsParams["_0"]) {
        return this.eth_call(functions.agents, {_0})
    }

    bounties(_0: BountiesParams["_0"]) {
        return this.eth_call(functions.bounties, {_0})
    }

    bountyCounter() {
        return this.eth_call(functions.bountyCounter, {})
    }

    getAllAgents() {
        return this.eth_call(functions.getAllAgents, {})
    }

    getBounty(_bountyId: GetBountyParams["_bountyId"]) {
        return this.eth_call(functions.getBounty, {_bountyId})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }
}

/// Event types
export type AgentRegisteredEventArgs = EParams<typeof events.AgentRegistered>
export type BountyCreatedEventArgs = EParams<typeof events.BountyCreated>
export type BountyFinalizedEventArgs = EParams<typeof events.BountyFinalized>
export type BountyRefundedEventArgs = EParams<typeof events.BountyRefunded>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type WorkSubmittedEventArgs = EParams<typeof events.WorkSubmitted>

/// Function types
export type AgentListParams = FunctionArguments<typeof functions.agentList>
export type AgentListReturn = FunctionReturn<typeof functions.agentList>

export type AgentReputationParams = FunctionArguments<typeof functions.agentReputation>
export type AgentReputationReturn = FunctionReturn<typeof functions.agentReputation>

export type AgentsParams = FunctionArguments<typeof functions.agents>
export type AgentsReturn = FunctionReturn<typeof functions.agents>

export type BountiesParams = FunctionArguments<typeof functions.bounties>
export type BountiesReturn = FunctionReturn<typeof functions.bounties>

export type BountyCounterParams = FunctionArguments<typeof functions.bountyCounter>
export type BountyCounterReturn = FunctionReturn<typeof functions.bountyCounter>

export type CreateBountyParams = FunctionArguments<typeof functions.createBounty>
export type CreateBountyReturn = FunctionReturn<typeof functions.createBounty>

export type FinalizeBountyParams = FunctionArguments<typeof functions.finalizeBounty>
export type FinalizeBountyReturn = FunctionReturn<typeof functions.finalizeBounty>

export type GetAllAgentsParams = FunctionArguments<typeof functions.getAllAgents>
export type GetAllAgentsReturn = FunctionReturn<typeof functions.getAllAgents>

export type GetBountyParams = FunctionArguments<typeof functions.getBounty>
export type GetBountyReturn = FunctionReturn<typeof functions.getBounty>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RefundBountyParams = FunctionArguments<typeof functions.refundBounty>
export type RefundBountyReturn = FunctionReturn<typeof functions.refundBounty>

export type RegisterAgentParams = FunctionArguments<typeof functions.registerAgent>
export type RegisterAgentReturn = FunctionReturn<typeof functions.registerAgent>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SubmitWorkParams = FunctionArguments<typeof functions.submitWork>
export type SubmitWorkReturn = FunctionReturn<typeof functions.submitWork>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

