import * as p from '@subsquid/evm-codec';
import { ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';
export declare const events: {
    AgentRegistered: import("@subsquid/evm-abi").AbiEvent<{
        readonly agentAddress: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly name: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
    BountyCreated: import("@subsquid/evm-abi").AbiEvent<{
        readonly bountyId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly client: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly codeUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
    BountyFinalized: import("@subsquid/evm-abi").AbiEvent<{
        readonly bountyId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly agent: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly isValid: p.Codec<boolean, boolean>;
    }>;
    BountyRefunded: import("@subsquid/evm-abi").AbiEvent<{
        readonly bountyId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly client: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly amount: p.Codec<number | bigint, bigint>;
    }>;
    OwnershipTransferred: import("@subsquid/evm-abi").AbiEvent<{
        readonly previousOwner: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly newOwner: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
    }>;
    WorkSubmitted: import("@subsquid/evm-abi").AbiEvent<{
        readonly bountyId: {
            encode: (sink: p.Sink, val: number | bigint) => void;
            decode: (src: p.Src) => bigint;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly agent: {
            encode: (sink: p.Sink, val: string) => void;
            decode: (src: p.Src) => string;
            isDynamic: boolean;
            slotsCount?: number | undefined;
            baseType: p.BaseType;
            indexed: true;
        };
        readonly reportUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }>;
};
export declare const functions: {
    agentList: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<number | bigint, bigint>;
    }, p.Codec<string, string>>;
    agentReputation: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, p.Codec<number | bigint, bigint>>;
    agents: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<string, string>;
    }, {
        readonly name: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly bio: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly wallet: p.Codec<string, string>;
        readonly isRegistered: p.Codec<boolean, boolean>;
        readonly registeredAt: p.Codec<number | bigint, bigint>;
    }>;
    bounties: import("@subsquid/evm-abi").AbiFunction<{
        readonly _0: p.Codec<number | bigint, bigint>;
    }, {
        readonly client: p.Codec<string, string>;
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly codeUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly isOpen: p.Codec<boolean, boolean>;
        readonly assignedAgent: p.Codec<string, string>;
        readonly reportUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly createdAt: p.Codec<number | bigint, bigint>;
    }>;
    bountyCounter: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<number | bigint, bigint>>;
    createBounty: import("@subsquid/evm-abi").AbiFunction<{
        readonly _codeUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }, p.Struct | p.Codec<any, any> | undefined>;
    finalizeBounty: import("@subsquid/evm-abi").AbiFunction<{
        readonly _bountyId: p.Codec<number | bigint, bigint>;
        readonly _agent: p.Codec<string, string>;
        readonly _isValid: p.Codec<boolean, boolean>;
        readonly _scoreToAdd: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    getAllAgents: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<{
        readonly name: string;
        readonly bio: string;
        readonly wallet: string;
        readonly isRegistered: boolean;
        readonly registeredAt: number | bigint;
    }[], {
        readonly name: string;
        readonly bio: string;
        readonly wallet: string;
        readonly isRegistered: boolean;
        readonly registeredAt: bigint;
    }[]>>;
    getBounty: import("@subsquid/evm-abi").AbiFunction<{
        readonly _bountyId: p.Codec<number | bigint, bigint>;
    }, import("@subsquid/evm-codec/lib/codecs/struct").StructCodec<{
        readonly client: p.Codec<string, string>;
        readonly amount: p.Codec<number | bigint, bigint>;
        readonly codeUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly isOpen: p.Codec<boolean, boolean>;
        readonly assignedAgent: p.Codec<string, string>;
        readonly reportUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly createdAt: p.Codec<number | bigint, bigint>;
    }>>;
    owner: import("@subsquid/evm-abi").AbiFunction<{}, p.Codec<string, string>>;
    refundBounty: import("@subsquid/evm-abi").AbiFunction<{
        readonly _bountyId: p.Codec<number | bigint, bigint>;
    }, p.Struct | p.Codec<any, any> | undefined>;
    registerAgent: import("@subsquid/evm-abi").AbiFunction<{
        readonly _name: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
        readonly _bio: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }, p.Struct | p.Codec<any, any> | undefined>;
    renounceOwnership: import("@subsquid/evm-abi").AbiFunction<{}, p.Struct | p.Codec<any, any> | undefined>;
    submitWork: import("@subsquid/evm-abi").AbiFunction<{
        readonly _bountyId: p.Codec<number | bigint, bigint>;
        readonly _reportUri: {
            readonly encode: (sink: p.Sink, val: string) => void;
            readonly decode: (src: p.Src) => string;
            readonly isDynamic: true;
            readonly baseType: "string";
        };
    }, p.Struct | p.Codec<any, any> | undefined>;
    transferOwnership: import("@subsquid/evm-abi").AbiFunction<{
        readonly newOwner: p.Codec<string, string>;
    }, p.Struct | p.Codec<any, any> | undefined>;
};
export declare class Contract extends ContractBase {
    agentList(_0: AgentListParams["_0"]): Promise<string>;
    agentReputation(_0: AgentReputationParams["_0"]): Promise<bigint>;
    agents(_0: AgentsParams["_0"]): Promise<{
        readonly name: string;
        readonly bio: string;
        readonly wallet: string;
        readonly isRegistered: boolean;
        readonly registeredAt: bigint;
    }>;
    bounties(_0: BountiesParams["_0"]): Promise<{
        readonly client: string;
        readonly amount: bigint;
        readonly codeUri: string;
        readonly isOpen: boolean;
        readonly assignedAgent: string;
        readonly reportUri: string;
        readonly createdAt: bigint;
    }>;
    bountyCounter(): Promise<bigint>;
    getAllAgents(): Promise<{
        readonly name: string;
        readonly bio: string;
        readonly wallet: string;
        readonly isRegistered: boolean;
        readonly registeredAt: bigint;
    }[]>;
    getBounty(_bountyId: GetBountyParams["_bountyId"]): Promise<{
        readonly client: string;
        readonly amount: bigint;
        readonly codeUri: string;
        readonly isOpen: boolean;
        readonly assignedAgent: string;
        readonly reportUri: string;
        readonly createdAt: bigint;
    }>;
    owner(): Promise<string>;
}
export type AgentRegisteredEventArgs = EParams<typeof events.AgentRegistered>;
export type BountyCreatedEventArgs = EParams<typeof events.BountyCreated>;
export type BountyFinalizedEventArgs = EParams<typeof events.BountyFinalized>;
export type BountyRefundedEventArgs = EParams<typeof events.BountyRefunded>;
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>;
export type WorkSubmittedEventArgs = EParams<typeof events.WorkSubmitted>;
export type AgentListParams = FunctionArguments<typeof functions.agentList>;
export type AgentListReturn = FunctionReturn<typeof functions.agentList>;
export type AgentReputationParams = FunctionArguments<typeof functions.agentReputation>;
export type AgentReputationReturn = FunctionReturn<typeof functions.agentReputation>;
export type AgentsParams = FunctionArguments<typeof functions.agents>;
export type AgentsReturn = FunctionReturn<typeof functions.agents>;
export type BountiesParams = FunctionArguments<typeof functions.bounties>;
export type BountiesReturn = FunctionReturn<typeof functions.bounties>;
export type BountyCounterParams = FunctionArguments<typeof functions.bountyCounter>;
export type BountyCounterReturn = FunctionReturn<typeof functions.bountyCounter>;
export type CreateBountyParams = FunctionArguments<typeof functions.createBounty>;
export type CreateBountyReturn = FunctionReturn<typeof functions.createBounty>;
export type FinalizeBountyParams = FunctionArguments<typeof functions.finalizeBounty>;
export type FinalizeBountyReturn = FunctionReturn<typeof functions.finalizeBounty>;
export type GetAllAgentsParams = FunctionArguments<typeof functions.getAllAgents>;
export type GetAllAgentsReturn = FunctionReturn<typeof functions.getAllAgents>;
export type GetBountyParams = FunctionArguments<typeof functions.getBounty>;
export type GetBountyReturn = FunctionReturn<typeof functions.getBounty>;
export type OwnerParams = FunctionArguments<typeof functions.owner>;
export type OwnerReturn = FunctionReturn<typeof functions.owner>;
export type RefundBountyParams = FunctionArguments<typeof functions.refundBounty>;
export type RefundBountyReturn = FunctionReturn<typeof functions.refundBounty>;
export type RegisterAgentParams = FunctionArguments<typeof functions.registerAgent>;
export type RegisterAgentReturn = FunctionReturn<typeof functions.registerAgent>;
export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>;
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>;
export type SubmitWorkParams = FunctionArguments<typeof functions.submitWork>;
export type SubmitWorkReturn = FunctionReturn<typeof functions.submitWork>;
export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>;
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>;
