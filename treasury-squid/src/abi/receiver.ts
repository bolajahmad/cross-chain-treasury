import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    DepositIntent: event("0x5513ba15870e541c60711d43d00f7a7903ebb6de7ff51d70e95ead85c811eb98", "DepositIntent(address,bytes32,bytes)", {"from": indexed(p.address), "commitment": indexed(p.bytes32), "body": p.bytes}),
}

export const functions = {
    MESSENGER_HOST: viewFun("0x0bafe30d", "MESSENGER_HOST()", {}, p.address),
    deposit: fun("0xe5c76cb9", "deposit(address,uint256,uint8,bytes,uint256)", {"receiverAccount": p.address, "amount": p.uint256, "actionType": p.uint8, "action": p.bytes, "fee": p.uint256}, ),
    deposits: viewFun("0xfc7e286d", "deposits(address)", {"_0": p.address}, p.uint256),
    feeToken: viewFun("0x647846a5", "feeToken()", {}, p.address),
    mnee: viewFun("0x79b34cce", "mnee()", {}, p.address),
    totalDeposits: viewFun("0x7d882097", "totalDeposits()", {}, p.uint256),
}

export class Contract extends ContractBase {

    MESSENGER_HOST() {
        return this.eth_call(functions.MESSENGER_HOST, {})
    }

    deposits(_0: DepositsParams["_0"]) {
        return this.eth_call(functions.deposits, {_0})
    }

    feeToken() {
        return this.eth_call(functions.feeToken, {})
    }

    mnee() {
        return this.eth_call(functions.mnee, {})
    }

    totalDeposits() {
        return this.eth_call(functions.totalDeposits, {})
    }
}

/// Event types
export type DepositIntentEventArgs = EParams<typeof events.DepositIntent>

/// Function types
export type MESSENGER_HOSTParams = FunctionArguments<typeof functions.MESSENGER_HOST>
export type MESSENGER_HOSTReturn = FunctionReturn<typeof functions.MESSENGER_HOST>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositsParams = FunctionArguments<typeof functions.deposits>
export type DepositsReturn = FunctionReturn<typeof functions.deposits>

export type FeeTokenParams = FunctionArguments<typeof functions.feeToken>
export type FeeTokenReturn = FunctionReturn<typeof functions.feeToken>

export type MneeParams = FunctionArguments<typeof functions.mnee>
export type MneeReturn = FunctionReturn<typeof functions.mnee>

export type TotalDepositsParams = FunctionArguments<typeof functions.totalDeposits>
export type TotalDepositsReturn = FunctionReturn<typeof functions.totalDeposits>

