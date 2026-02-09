import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ActionReceived: event("0xacef58d49a9b7bb06b84c12b76a71fcf5e4a6db3144c4bb33f971e46415f0b09", "ActionReceived(address,bytes32,uint256)", {"recipient": indexed(p.address), "actionId": indexed(p.bytes32), "amount": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
}

export const functions = {
    SOURCE_APP: viewFun("0xd6ab9597", "SOURCE_APP()", {}, p.bytes),
    SOURCE_CHAIN: viewFun("0xa0609ea5", "SOURCE_CHAIN()", {}, p.bytes),
    changeTreasury: fun("0xb14f2a39", "changeTreasury(address)", {"_treasury": p.address}, ),
    feeToken: viewFun("0x647846a5", "feeToken()", {}, p.address),
    host: viewFun("0xf437bc59", "host()", {}, p.address),
    onAccept: fun("0x0fee32ce", "onAccept(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),address))", {"incoming": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "relayer": p.address})}, ),
    onGetResponse: fun("0x44ab20f8", "onGetResponse((((bytes,bytes,uint64,address,uint64,bytes[],uint64,bytes),(bytes,bytes)[]),address))", {"_0": p.struct({"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.address, "timeoutTimestamp": p.uint64, "keys": p.array(p.bytes), "height": p.uint64, "context": p.bytes}), "values": p.array(p.struct({"key": p.bytes, "value": p.bytes}))}), "relayer": p.address})}, ),
    onGetTimeout: fun("0xd0fff366", "onGetTimeout((bytes,bytes,uint64,address,uint64,bytes[],uint64,bytes))", {"_0": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.address, "timeoutTimestamp": p.uint64, "keys": p.array(p.bytes), "height": p.uint64, "context": p.bytes})}, ),
    onPostRequestTimeout: fun("0xbc0dd447", "onPostRequestTimeout((bytes,bytes,uint64,bytes,bytes,uint64,bytes))", {"_0": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes})}, ),
    onPostResponse: fun("0xb2a01bf5", "onPostResponse((((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64),address))", {"_0": p.struct({"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeoutTimestamp": p.uint64}), "relayer": p.address})}, ),
    onPostResponseTimeout: fun("0x0bc37bab", "onPostResponseTimeout(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64))", {"_0": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeoutTimestamp": p.uint64})}, ),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    processed: viewFun("0xac13e2cf", "processed(bytes)", {"_0": p.bytes}, p.bool),
    'quote((bytes,bytes,bytes,uint64,uint256,address))': viewFun("0x108bc1dd", "quote((bytes,bytes,bytes,uint64,uint256,address))", {"request": p.struct({"dest": p.bytes, "to": p.bytes, "body": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quote((bytes,uint64,bytes[],uint64,uint256,bytes))': viewFun("0xbca96c39", "quote((bytes,uint64,bytes[],uint64,uint256,bytes))", {"request": p.struct({"dest": p.bytes, "height": p.uint64, "keys": p.array(p.bytes), "timeout": p.uint64, "fee": p.uint256, "context": p.bytes})}, p.uint256),
    'quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))': viewFun("0xdd92a316", "quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))", {"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative((bytes,bytes,bytes,uint64,uint256,address))': viewFun("0x4f3f7c05", "quoteNative((bytes,bytes,bytes,uint64,uint256,address))", {"request": p.struct({"dest": p.bytes, "to": p.bytes, "body": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))': viewFun("0x632e235a", "quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))", {"request": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))': viewFun("0xd24740fb", "quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))", {"request": p.struct({"dest": p.bytes, "height": p.uint64, "keys": p.array(p.bytes), "timeout": p.uint64, "fee": p.uint256, "context": p.bytes})}, p.uint256),
    relayExecutionResult: fun("0xcda77f8f", "relayExecutionResult(bytes)", {"action": p.bytes}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    treasury: viewFun("0x61d027b3", "treasury()", {}, p.address),
    updateSourceApp: fun("0x1656c6f6", "updateSourceApp(address)", {"_sourceApp": p.address}, ),
    updateSourceChain: fun("0x764374f2", "updateSourceChain(uint256)", {"_sourceChainId": p.uint256}, ),
}

export class Contract extends ContractBase {

    SOURCE_APP() {
        return this.eth_call(functions.SOURCE_APP, {})
    }

    SOURCE_CHAIN() {
        return this.eth_call(functions.SOURCE_CHAIN, {})
    }

    feeToken() {
        return this.eth_call(functions.feeToken, {})
    }

    host() {
        return this.eth_call(functions.host, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    processed(_0: ProcessedParams["_0"]) {
        return this.eth_call(functions.processed, {_0})
    }

    'quote((bytes,bytes,bytes,uint64,uint256,address))'(request: QuoteParams_0["request"]) {
        return this.eth_call(functions['quote((bytes,bytes,bytes,uint64,uint256,address))'], {request})
    }

    'quote((bytes,uint64,bytes[],uint64,uint256,bytes))'(request: QuoteParams_1["request"]) {
        return this.eth_call(functions['quote((bytes,uint64,bytes[],uint64,uint256,bytes))'], {request})
    }

    'quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'(response: QuoteParams_2["response"]) {
        return this.eth_call(functions['quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'], {response})
    }

    'quoteNative((bytes,bytes,bytes,uint64,uint256,address))'(request: QuoteNativeParams_0["request"]) {
        return this.eth_call(functions['quoteNative((bytes,bytes,bytes,uint64,uint256,address))'], {request})
    }

    'quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'(request: QuoteNativeParams_1["request"]) {
        return this.eth_call(functions['quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'], {request})
    }

    'quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))'(request: QuoteNativeParams_2["request"]) {
        return this.eth_call(functions['quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))'], {request})
    }

    treasury() {
        return this.eth_call(functions.treasury, {})
    }
}

/// Event types
export type ActionReceivedEventArgs = EParams<typeof events.ActionReceived>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type SOURCE_APPParams = FunctionArguments<typeof functions.SOURCE_APP>
export type SOURCE_APPReturn = FunctionReturn<typeof functions.SOURCE_APP>

export type SOURCE_CHAINParams = FunctionArguments<typeof functions.SOURCE_CHAIN>
export type SOURCE_CHAINReturn = FunctionReturn<typeof functions.SOURCE_CHAIN>

export type ChangeTreasuryParams = FunctionArguments<typeof functions.changeTreasury>
export type ChangeTreasuryReturn = FunctionReturn<typeof functions.changeTreasury>

export type FeeTokenParams = FunctionArguments<typeof functions.feeToken>
export type FeeTokenReturn = FunctionReturn<typeof functions.feeToken>

export type HostParams = FunctionArguments<typeof functions.host>
export type HostReturn = FunctionReturn<typeof functions.host>

export type OnAcceptParams = FunctionArguments<typeof functions.onAccept>
export type OnAcceptReturn = FunctionReturn<typeof functions.onAccept>

export type OnGetResponseParams = FunctionArguments<typeof functions.onGetResponse>
export type OnGetResponseReturn = FunctionReturn<typeof functions.onGetResponse>

export type OnGetTimeoutParams = FunctionArguments<typeof functions.onGetTimeout>
export type OnGetTimeoutReturn = FunctionReturn<typeof functions.onGetTimeout>

export type OnPostRequestTimeoutParams = FunctionArguments<typeof functions.onPostRequestTimeout>
export type OnPostRequestTimeoutReturn = FunctionReturn<typeof functions.onPostRequestTimeout>

export type OnPostResponseParams = FunctionArguments<typeof functions.onPostResponse>
export type OnPostResponseReturn = FunctionReturn<typeof functions.onPostResponse>

export type OnPostResponseTimeoutParams = FunctionArguments<typeof functions.onPostResponseTimeout>
export type OnPostResponseTimeoutReturn = FunctionReturn<typeof functions.onPostResponseTimeout>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type ProcessedParams = FunctionArguments<typeof functions.processed>
export type ProcessedReturn = FunctionReturn<typeof functions.processed>

export type QuoteParams_0 = FunctionArguments<typeof functions['quote((bytes,bytes,bytes,uint64,uint256,address))']>
export type QuoteReturn_0 = FunctionReturn<typeof functions['quote((bytes,bytes,bytes,uint64,uint256,address))']>

export type QuoteParams_1 = FunctionArguments<typeof functions['quote((bytes,uint64,bytes[],uint64,uint256,bytes))']>
export type QuoteReturn_1 = FunctionReturn<typeof functions['quote((bytes,uint64,bytes[],uint64,uint256,bytes))']>

export type QuoteParams_2 = FunctionArguments<typeof functions['quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>
export type QuoteReturn_2 = FunctionReturn<typeof functions['quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>

export type QuoteNativeParams_0 = FunctionArguments<typeof functions['quoteNative((bytes,bytes,bytes,uint64,uint256,address))']>
export type QuoteNativeReturn_0 = FunctionReturn<typeof functions['quoteNative((bytes,bytes,bytes,uint64,uint256,address))']>

export type QuoteNativeParams_1 = FunctionArguments<typeof functions['quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>
export type QuoteNativeReturn_1 = FunctionReturn<typeof functions['quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>

export type QuoteNativeParams_2 = FunctionArguments<typeof functions['quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))']>
export type QuoteNativeReturn_2 = FunctionReturn<typeof functions['quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))']>

export type RelayExecutionResultParams = FunctionArguments<typeof functions.relayExecutionResult>
export type RelayExecutionResultReturn = FunctionReturn<typeof functions.relayExecutionResult>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TreasuryParams = FunctionArguments<typeof functions.treasury>
export type TreasuryReturn = FunctionReturn<typeof functions.treasury>

export type UpdateSourceAppParams = FunctionArguments<typeof functions.updateSourceApp>
export type UpdateSourceAppReturn = FunctionReturn<typeof functions.updateSourceApp>

export type UpdateSourceChainParams = FunctionArguments<typeof functions.updateSourceChain>
export type UpdateSourceChainReturn = FunctionReturn<typeof functions.updateSourceChain>

