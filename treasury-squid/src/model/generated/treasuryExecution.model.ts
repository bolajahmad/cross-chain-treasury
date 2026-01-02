import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BytesColumn as BytesColumn_, StringColumn as StringColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class TreasuryExecution {
    constructor(props?: Partial<TreasuryExecution>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    actionType!: number

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BytesColumn_({nullable: false})
    params!: Uint8Array

    @IntColumn_({nullable: false})
    block!: number

    @Index_()
    @StringColumn_({nullable: false})
    txnHash!: string
}
