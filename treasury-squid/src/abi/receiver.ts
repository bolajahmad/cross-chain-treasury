import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    DepositIntent: event("0x5513ba15870e541c60711d43d00f7a7903ebb6de7ff51d70e95ead85c811eb98", "DepositIntent(address,bytes32,bytes)", {"from": indexed(p.address), "actionId": indexed(p.bytes32), "body": p.bytes}),
    FundsReleased: event("0x88e5b5e2ee845e7f79ac6ece4ce2f64dd062d4b61938eae49a0c2c47a224ea73", "FundsReleased(bytes,address,uint256)", {"action": indexed(p.bytes), "recipient": indexed(p.address), "amount": p.uint256}),
    Refunded: event("0x6c9494ede298a51901601c909d8bf308490d2c7f31de3b8c6e0d0ce37797ac01", "Refunded(bytes,address,uint256)", {"action": indexed(p.bytes), "depositor": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    deposit: fun("0xe5c76cb9", "deposit(address,uint256,uint8,bytes,uint256)", {"receiverAccount": p.address, "amount": p.uint256, "actionType": p.uint8, "action": p.bytes, "fee": p.uint256}, ),
    escrows: viewFun("0x6b55a8f7", "escrows(bytes)", {"_0": p.bytes}, {"depositor": p.address, "action": p.bytes, "amount": p.uint256, "released": p.uint256, "status": p.uint8}),
    feeToken: viewFun("0x647846a5", "feeToken()", {}, p.address),
    host: viewFun("0xf437bc59", "host()", {}, p.address),
    mnee: viewFun("0x79b34cce", "mnee()", {}, p.address),
    network: viewFun("0x6739afca", "network()", {}, p.uint256),
    onAccept: fun("0x0fee32ce", "onAccept(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),address))", {"incoming": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "relayer": p.address})}, ),
    onGetResponse: fun("0x44ab20f8", "onGetResponse((((bytes,bytes,uint64,address,uint64,bytes[],uint64,bytes),(bytes,bytes)[]),address))", {"_0": p.struct({"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.address, "timeoutTimestamp": p.uint64, "keys": p.array(p.bytes), "height": p.uint64, "context": p.bytes}), "values": p.array(p.struct({"key": p.bytes, "value": p.bytes}))}), "relayer": p.address})}, ),
    onGetTimeout: fun("0xd0fff366", "onGetTimeout((bytes,bytes,uint64,address,uint64,bytes[],uint64,bytes))", {"_0": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.address, "timeoutTimestamp": p.uint64, "keys": p.array(p.bytes), "height": p.uint64, "context": p.bytes})}, ),
    onPostRequestTimeout: fun("0xbc0dd447", "onPostRequestTimeout((bytes,bytes,uint64,bytes,bytes,uint64,bytes))", {"_0": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes})}, ),
    onPostResponse: fun("0xb2a01bf5", "onPostResponse((((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64),address))", {"_0": p.struct({"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeoutTimestamp": p.uint64}), "relayer": p.address})}, ),
    onPostResponseTimeout: fun("0x0bc37bab", "onPostResponseTimeout(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64))", {"_0": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeoutTimestamp": p.uint64})}, ),
    'quote((bytes,bytes,bytes,uint64,uint256,address))': viewFun("0x108bc1dd", "quote((bytes,bytes,bytes,uint64,uint256,address))", {"request": p.struct({"dest": p.bytes, "to": p.bytes, "body": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quote((bytes,uint64,bytes[],uint64,uint256,bytes))': viewFun("0xbca96c39", "quote((bytes,uint64,bytes[],uint64,uint256,bytes))", {"request": p.struct({"dest": p.bytes, "height": p.uint64, "keys": p.array(p.bytes), "timeout": p.uint64, "fee": p.uint256, "context": p.bytes})}, p.uint256),
    'quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))': viewFun("0xdd92a316", "quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))", {"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative((bytes,bytes,bytes,uint64,uint256,address))': viewFun("0x4f3f7c05", "quoteNative((bytes,bytes,bytes,uint64,uint256,address))", {"request": p.struct({"dest": p.bytes, "to": p.bytes, "body": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))': viewFun("0x632e235a", "quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))", {"request": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))': viewFun("0xd24740fb", "quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))", {"request": p.struct({"dest": p.bytes, "height": p.uint64, "keys": p.array(p.bytes), "timeout": p.uint64, "fee": p.uint256, "context": p.bytes})}, p.uint256),
    updateNetworkId: fun("0x004b06dd", "updateNetworkId(uint256)", {"_network": p.uint256}, ),
}

export class Contract extends ContractBase {

    escrows(_0: EscrowsParams["_0"]) {
        return this.eth_call(functions.escrows, {_0})
    }

    feeToken() {
        return this.eth_call(functions.feeToken, {})
    }

    host() {
        return this.eth_call(functions.host, {})
    }

    mnee() {
        return this.eth_call(functions.mnee, {})
    }

    network() {
        return this.eth_call(functions.network, {})
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
}

/// Event types
export type DepositIntentEventArgs = EParams<typeof events.DepositIntent>
export type FundsReleasedEventArgs = EParams<typeof events.FundsReleased>
export type RefundedEventArgs = EParams<typeof events.Refunded>

/// Function types
export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type EscrowsParams = FunctionArguments<typeof functions.escrows>
export type EscrowsReturn = FunctionReturn<typeof functions.escrows>

export type FeeTokenParams = FunctionArguments<typeof functions.feeToken>
export type FeeTokenReturn = FunctionReturn<typeof functions.feeToken>

export type HostParams = FunctionArguments<typeof functions.host>
export type HostReturn = FunctionReturn<typeof functions.host>

export type MneeParams = FunctionArguments<typeof functions.mnee>
export type MneeReturn = FunctionReturn<typeof functions.mnee>

export type NetworkParams = FunctionArguments<typeof functions.network>
export type NetworkReturn = FunctionReturn<typeof functions.network>

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

export type UpdateNetworkIdParams = FunctionArguments<typeof functions.updateNetworkId>
export type UpdateNetworkIdReturn = FunctionReturn<typeof functions.updateNetworkId>

