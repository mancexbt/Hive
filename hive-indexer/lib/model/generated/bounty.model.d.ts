import { Agent } from "./agent.model";
export declare class Bounty {
    constructor(props?: Partial<Bounty>);
    id: string;
    client: string;
    amount: bigint;
    codeUri: string;
    isOpen: boolean;
    assignedAgent: Agent | undefined | null;
    completedBy: Agent | undefined | null;
    reportUri: string | undefined | null;
    createdAt: bigint;
    closedAt: bigint | undefined | null;
    txHash: string;
}
