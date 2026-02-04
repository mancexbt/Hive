import { Bounty } from "./bounty.model";
export declare class Agent {
    constructor(props?: Partial<Agent>);
    id: string;
    name: string;
    bio: string | undefined | null;
    registeredAt: bigint;
    reputation: bigint;
    isActive: boolean;
    bountiesAssigned: Bounty[];
    bountiesCompleted: Bounty[];
}
