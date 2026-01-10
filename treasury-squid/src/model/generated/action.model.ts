import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Action {
    constructor(props?: Partial<Action>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    network!: string

    @Index_()
    @IntColumn_({nullable: false})
    block!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    actionId!: string

    @IntColumn_({nullable: false})
    actionType!: number

    @StringColumn_({nullable: false})
    params!: string

    @BigIntColumn_({nullable: false})
    value!: bigint

    @StringColumn_({nullable: false})
    status!: string

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string
}
