import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ActionCreated: event("0x6cdc86f70f2e362bdf42d925f42ef28ec703dbab808751a8bd4356e95aa1a00a", "ActionCreated(bytes32,uint8,bytes)", {"id": indexed(p.bytes32), "actionType": p.uint8, "params": p.bytes}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    TreasuryExecution: event("0xe54f376c16c9814fd3dfc2049ffe795da7f2707e2c8ee002b1190c0f7d3ea421", "TreasuryExecution(bytes32,uint8,uint256,bytes)", {"id": indexed(p.bytes32), "actionType": p.uint8, "amount": p.uint256, "params": p.bytes}),
}

export const functions = {
    CONTROLLER_ROLE: viewFun("0x092c5b3b", "CONTROLLER_ROLE()", {}, p.bytes32),
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    actionCount: viewFun("0x29da5738", "actionCount()", {}, p.uint256),
    'createAction(bytes32,uint8,bytes,address)': fun("0x5e50986e", "createAction(bytes32,uint8,bytes,address)", {"_id": p.bytes32, "_type": p.uint8, "_params": p.bytes, "_token": p.address}, ),
    'createAction(bytes32,uint8,bytes)': fun("0x7cca43a9", "createAction(bytes32,uint8,bytes)", {"_id": p.bytes32, "_type": p.uint8, "_params": p.bytes}, ),
    executeTreasuryAction: fun("0x84de3c55", "executeTreasuryAction(bytes32)", {"_id": p.bytes32}, ),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    maxActions: viewFun("0x4afd4f0e", "maxActions()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
}

export class Contract extends ContractBase {

    CONTROLLER_ROLE() {
        return this.eth_call(functions.CONTROLLER_ROLE, {})
    }

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    actionCount() {
        return this.eth_call(functions.actionCount, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
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
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type TreasuryExecutionEventArgs = EParams<typeof events.TreasuryExecution>

/// Function types
export type CONTROLLER_ROLEParams = FunctionArguments<typeof functions.CONTROLLER_ROLE>
export type CONTROLLER_ROLEReturn = FunctionReturn<typeof functions.CONTROLLER_ROLE>

export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type ActionCountParams = FunctionArguments<typeof functions.actionCount>
export type ActionCountReturn = FunctionReturn<typeof functions.actionCount>

export type CreateActionParams_0 = FunctionArguments<typeof functions['createAction(bytes32,uint8,bytes,address)']>
export type CreateActionReturn_0 = FunctionReturn<typeof functions['createAction(bytes32,uint8,bytes,address)']>

export type CreateActionParams_1 = FunctionArguments<typeof functions['createAction(bytes32,uint8,bytes)']>
export type CreateActionReturn_1 = FunctionReturn<typeof functions['createAction(bytes32,uint8,bytes)']>

export type ExecuteTreasuryActionParams = FunctionArguments<typeof functions.executeTreasuryAction>
export type ExecuteTreasuryActionReturn = FunctionReturn<typeof functions.executeTreasuryAction>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

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

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

