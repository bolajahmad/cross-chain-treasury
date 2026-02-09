import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ActionCreated: event("0x6cdc86f70f2e362bdf42d925f42ef28ec703dbab808751a8bd4356e95aa1a00a", "ActionCreated(bytes32,uint8,bytes)", {"id": indexed(p.bytes32), "actionType": p.uint8, "params": p.bytes}),
    ActionFinalized: event("0x10a95ffcd8b38c7ecb7f5fe8421cf91dce4b2d74229a24741d4ab41e368d3ee8", "ActionFinalized(bytes32)", {"id": indexed(p.bytes32)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PayoutCompleted: event("0xdd866cdf66bea045fdf2006520b8cfe92f4ff548e6be6d9a098407ada7d759b5", "PayoutCompleted(bytes32,address,uint256)", {"id": indexed(p.bytes32), "recipient": p.address, "amount": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    TreasuryExecution: event("0x0e33e2055f99f8760e54593bc0d636b11581c4e084d9fda3441408b72604adf8", "TreasuryExecution(bytes32,uint8)", {"id": indexed(p.bytes32), "actionType": p.uint8}),
}

export const functions = {
    CONTROLLER_ROLE: viewFun("0x092c5b3b", "CONTROLLER_ROLE()", {}, p.bytes32),
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    EXECUTOR_ROLE: viewFun("0x07bd0265", "EXECUTOR_ROLE()", {}, p.bytes32),
    action: viewFun("0xe0bff318", "action(bytes32)", {"actionId": p.bytes32}, p.struct({"record": p.struct({"status": p.uint8, "actionType": p.uint8, "creator": p.address, "data": p.bytes, "executedAt": p.uint256}), "token": p.address})),
    actionCount: viewFun("0x29da5738", "actionCount()", {}, p.uint256),
    cliffsPaid: viewFun("0x83797666", "cliffsPaid(bytes32)", {"actionId": p.bytes32}, p.uint256),
    'createAction(bytes32,uint8,bytes,address)': fun("0x5e50986e", "createAction(bytes32,uint8,bytes,address)", {"_id": p.bytes32, "_type": p.uint8, "_params": p.bytes, "_token": p.address}, ),
    'createAction(bytes32,uint8,bytes)': fun("0x7cca43a9", "createAction(bytes32,uint8,bytes)", {"_id": p.bytes32, "_type": p.uint8, "_params": p.bytes}, ),
    executeAction: fun("0xe125ab9c", "executeAction(bytes32)", {"_id": p.bytes32}, ),
    finalizeAction: fun("0xa6f6a0c8", "finalizeAction(bytes32)", {"_id": p.bytes32}, ),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    lockedBalance: viewFun("0x9ae697bf", "lockedBalance(address)", {"token": p.address}, p.uint256),
    makePayout: fun("0x8a1ff7d1", "makePayout(address,bytes32,address,uint256)", {"token": p.address, "id": p.bytes32, "recipient": p.address, "amount": p.uint256}, ),
    maxActions: viewFun("0x4afd4f0e", "maxActions()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setExecutor: fun("0xfd27055b", "setExecutor(uint8,address)", {"_type": p.uint8, "_executor": p.address}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    updateStatus: fun("0x054372ed", "updateStatus(bytes32,uint8)", {"_id": p.bytes32, "_status": p.uint8}, ),
}

export class Contract extends ContractBase {

    CONTROLLER_ROLE() {
        return this.eth_call(functions.CONTROLLER_ROLE, {})
    }

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    EXECUTOR_ROLE() {
        return this.eth_call(functions.EXECUTOR_ROLE, {})
    }

    action(actionId: ActionParams["actionId"]) {
        return this.eth_call(functions.action, {actionId})
    }

    actionCount() {
        return this.eth_call(functions.actionCount, {})
    }

    cliffsPaid(actionId: CliffsPaidParams["actionId"]) {
        return this.eth_call(functions.cliffsPaid, {actionId})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    lockedBalance(token: LockedBalanceParams["token"]) {
        return this.eth_call(functions.lockedBalance, {token})
    }

    maxActions() {
        return this.eth_call(functions.maxActions, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }
}

/// Event types
export type ActionCreatedEventArgs = EParams<typeof events.ActionCreated>
export type ActionFinalizedEventArgs = EParams<typeof events.ActionFinalized>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PayoutCompletedEventArgs = EParams<typeof events.PayoutCompleted>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type TreasuryExecutionEventArgs = EParams<typeof events.TreasuryExecution>

/// Function types
export type CONTROLLER_ROLEParams = FunctionArguments<typeof functions.CONTROLLER_ROLE>
export type CONTROLLER_ROLEReturn = FunctionReturn<typeof functions.CONTROLLER_ROLE>

export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type EXECUTOR_ROLEParams = FunctionArguments<typeof functions.EXECUTOR_ROLE>
export type EXECUTOR_ROLEReturn = FunctionReturn<typeof functions.EXECUTOR_ROLE>

export type ActionParams = FunctionArguments<typeof functions.action>
export type ActionReturn = FunctionReturn<typeof functions.action>

export type ActionCountParams = FunctionArguments<typeof functions.actionCount>
export type ActionCountReturn = FunctionReturn<typeof functions.actionCount>

export type CliffsPaidParams = FunctionArguments<typeof functions.cliffsPaid>
export type CliffsPaidReturn = FunctionReturn<typeof functions.cliffsPaid>

export type CreateActionParams_0 = FunctionArguments<typeof functions['createAction(bytes32,uint8,bytes,address)']>
export type CreateActionReturn_0 = FunctionReturn<typeof functions['createAction(bytes32,uint8,bytes,address)']>

export type CreateActionParams_1 = FunctionArguments<typeof functions['createAction(bytes32,uint8,bytes)']>
export type CreateActionReturn_1 = FunctionReturn<typeof functions['createAction(bytes32,uint8,bytes)']>

export type ExecuteActionParams = FunctionArguments<typeof functions.executeAction>
export type ExecuteActionReturn = FunctionReturn<typeof functions.executeAction>

export type FinalizeActionParams = FunctionArguments<typeof functions.finalizeAction>
export type FinalizeActionReturn = FunctionReturn<typeof functions.finalizeAction>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type LockedBalanceParams = FunctionArguments<typeof functions.lockedBalance>
export type LockedBalanceReturn = FunctionReturn<typeof functions.lockedBalance>

export type MakePayoutParams = FunctionArguments<typeof functions.makePayout>
export type MakePayoutReturn = FunctionReturn<typeof functions.makePayout>

export type MaxActionsParams = FunctionArguments<typeof functions.maxActions>
export type MaxActionsReturn = FunctionReturn<typeof functions.maxActions>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetExecutorParams = FunctionArguments<typeof functions.setExecutor>
export type SetExecutorReturn = FunctionReturn<typeof functions.setExecutor>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateStatusParams = FunctionArguments<typeof functions.updateStatus>
export type UpdateStatusReturn = FunctionReturn<typeof functions.updateStatus>

