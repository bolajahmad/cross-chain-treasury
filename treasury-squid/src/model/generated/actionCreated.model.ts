import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, StringColumn as StringColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class ActionCreated {
    constructor(props?: Partial<ActionCreated>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    actionType!: number

    @IntColumn_({nullable: false})
    index!: number

    @BytesColumn_({nullable: false})
    params!: Uint8Array

    @IntColumn_({nullable: false})
    block!: number

    @Index_()
    @StringColumn_({nullable: false})
    txnHash!: string
}
