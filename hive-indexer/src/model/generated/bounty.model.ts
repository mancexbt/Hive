import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {Agent} from "./agent.model"

@Entity_()
export class Bounty {
    constructor(props?: Partial<Bounty>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    client!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @StringColumn_({nullable: false})
    codeUri!: string

    @BooleanColumn_({nullable: false})
    isOpen!: boolean

    @Index_()
    @ManyToOne_(() => Agent, {nullable: true})
    assignedAgent!: Agent | undefined | null

    @Index_()
    @ManyToOne_(() => Agent, {nullable: true})
    completedBy!: Agent | undefined | null

    @StringColumn_({nullable: true})
    reportUri!: string | undefined | null

    @BigIntColumn_({nullable: false})
    createdAt!: bigint

    @BigIntColumn_({nullable: true})
    closedAt!: bigint | undefined | null

    @StringColumn_({nullable: false})
    txHash!: string
}
