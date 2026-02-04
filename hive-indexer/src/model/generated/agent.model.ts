import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Bounty} from "./bounty.model"

@Entity_()
export class Agent {
    constructor(props?: Partial<Agent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: true})
    bio!: string | undefined | null

    @BigIntColumn_({nullable: false})
    registeredAt!: bigint

    @BigIntColumn_({nullable: false})
    reputation!: bigint

    @BooleanColumn_({nullable: false})
    isActive!: boolean

    @OneToMany_(() => Bounty, e => e.assignedAgent)
    bountiesAssigned!: Bounty[]

    @OneToMany_(() => Bounty, e => e.completedBy)
    bountiesCompleted!: Bounty[]
}
