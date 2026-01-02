import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ActionCreated: event("0x6cdc86f70f2e362bdf42d925f42ef28ec703dbab808751a8bd4356e95aa1a00a", "ActionCreated(bytes32,uint8,bytes)", {"id": indexed(p.bytes32), "actionType": p.uint8, "params": p.bytes}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    TreasuryExecution: event("0xe54f376c16c9814fd3dfc2049ffe795da7f2707e2c8ee002b1190c0f7d3ea421", "TreasuryExecution(bytes32,uint8,uint256,bytes)", {"id": indexed(p.bytes32), "actionType": p.uint8, "amount": p.uint256, "params": p.bytes}),
}

export const functions = {
    actionCount: viewFun("0x29da5738", "actionCount()", {}, p.uint256),
    actions: viewFun("0xf3abde32", "actions(bytes32)", {"_0": p.bytes32}, {"status": p.uint8, "actionType": p.uint8, "exists": p.bool, "executedAt": p.uint256, "dataHash": p.bytes}),
    controller: viewFun("0xf77c4791", "controller()", {}, p.address),
    createAction: fun("0x7cca43a9", "createAction(bytes32,uint8,bytes)", {"_id": p.bytes32, "_type": p.uint8, "_params": p.bytes}, ),
    executeTreasuryAction: fun("0x84de3c55", "executeTreasuryAction(bytes32)", {"_id": p.bytes32}, ),
    generateActionId: viewFun("0xc230f812", "generateActionId()", {}, p.bytes32),
    maxActions: viewFun("0x4afd4f0e", "maxActions()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
}

export class Contract extends ContractBase {

    actionCount() {
        return this.eth_call(functions.actionCount, {})
    }

    actions(_0: ActionsParams["_0"]) {
        return this.eth_call(functions.actions, {_0})
    }

    controller() {
        return this.eth_call(functions.controller, {})
    }

    generateActionId() {
        return this.eth_call(functions.generateActionId, {})
    }

    maxActions() {
        return this.eth_call(functions.maxActions, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }
}

/// Event types
export type ActionCreatedEventArgs = EParams<typeof events.ActionCreated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type TreasuryExecutionEventArgs = EParams<typeof events.TreasuryExecution>

/// Function types
export type ActionCountParams = FunctionArguments<typeof functions.actionCount>
export type ActionCountReturn = FunctionReturn<typeof functions.actionCount>

export type ActionsParams = FunctionArguments<typeof functions.actions>
export type ActionsReturn = FunctionReturn<typeof functions.actions>

export type ControllerParams = FunctionArguments<typeof functions.controller>
export type ControllerReturn = FunctionReturn<typeof functions.controller>

export type CreateActionParams = FunctionArguments<typeof functions.createAction>
export type CreateActionReturn = FunctionReturn<typeof functions.createAction>

export type ExecuteTreasuryActionParams = FunctionArguments<typeof functions.executeTreasuryAction>
export type ExecuteTreasuryActionReturn = FunctionReturn<typeof functions.executeTreasuryAction>

export type GenerateActionIdParams = FunctionArguments<typeof functions.generateActionId>
export type GenerateActionIdReturn = FunctionReturn<typeof functions.generateActionId>

export type MaxActionsParams = FunctionArguments<typeof functions.maxActions>
export type MaxActionsReturn = FunctionReturn<typeof functions.maxActions>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

