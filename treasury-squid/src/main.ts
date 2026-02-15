import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Action, Role } from "./model";
import * as erc20abi from "./abi/erc20";
import * as actionsAbi from "./abi/actions";
import { makeProcessor } from "./processor";
import { networksConfigs } from "./networksConfigs";
import assert from "assert";
import { onActionExecuted, onPayoutFinalized } from "./parsers/actions";

async function handleActionCreated(log: any, block: any, actions: Action[]) {
  let { id, actionType, params } = actionsAbi.events.ActionCreated.decode(log);
  actions.push(
    new Action({
      id: log.id,
      block: block.header.height,
      timestamp: new Date(block.header.timestamp),
      params,
      status: "PENDING",
      txHash: log.transactionHash,
      actionId: id,
      actionType,
      value: 0n,
    }),
  );
}

async function handleRoleGranted(log: any, block: any, roles: Role[]) {
  let { role, sender, account } = actionsAbi.events.RoleGranted.decode(log);
  roles.push(
    new Role({
      id: log.id,
      block: block.header.height,
      timestamp: new Date(block.header.timestamp),
      role,
      sender,
      account,
      txHash: log.transactionHash,
    }),
  );
}

async function handleRoleRevoked(log: any, ctx: any, roles: Role[]) {
  let { role, account } = actionsAbi.events.RoleRevoked.decode(log);
  let isExisting = await ctx.store.findOne(Role, {
    where: { role, account },
  });
  if (isExisting) {
    ctx.store.remove(isExisting);
    roles = roles.filter(
      (r) => !(r.role === role && r.account === account),
    );
  }
}

async function handleTreasuryExecution(log: any, ctx: any, actions: Action[]) {
  console.log("Action Executed Detected", log);
  let { id } = actionsAbi.events.TreasuryExecution.decode(log);
  await onActionExecuted(ctx, id, actions);
  console.log({ actions });
}

async function handlePayoutCompleted(log: any, ctx: any, actions: Action[]) {
  console.log("Payout Completed Detected", log);
  let { id, amount } = actionsAbi.events.PayoutCompleted.decode(log);
  await onPayoutFinalized(ctx, id, amount, actions);
  console.log({ actions });
}

function handleActionFinalized(log: any, actions: Action[]) {
  let { id } = actionsAbi.events.ActionFinalized.decode(log);
  let isExisting = actions.findIndex(({ actionId }) => actionId == id);
  if (isExisting >= 0) {
    actions[isExisting].status = "EXECUTED";
  }
}

async function processLog(log: any, block: any, ctx: any, actions: Action[], roles: Role[], config: any) {
  if (!config.contract.includes(log.address.toLowerCase())) {
    return;
  }

  if (log.topics[0] == actionsAbi.events.ActionCreated.topic) {
    await handleActionCreated(log, block, actions);
  } else if (log.topics[0] == actionsAbi.events.RoleGranted.topic) {
    await handleRoleGranted(log, block, roles);
  } else if (log.topics[0] == actionsAbi.events.RoleRevoked.topic) {
    await handleRoleRevoked(log, ctx, roles);
  } else if (log.topics[0] == actionsAbi.events.TreasuryExecution.topic) {
    await handleTreasuryExecution(log, ctx, actions);
  } else if (log.topics[0] == actionsAbi.events.PayoutCompleted.topic) {
    await handlePayoutCompleted(log, ctx, actions);
  } else if (log.topics[0] == actionsAbi.events.ActionFinalized.topic) {
    handleActionFinalized(log, actions);
  }
}

const config = networksConfigs;

const processor = makeProcessor(config);
const database = new TypeormDatabase({
  supportHotBlocks: true,
  // stateSchema: `squid_processor`, // state schema must vary by processor if there's more than one
});

processor.run(database, async (ctx) => {
  let actions: Action[] = [];
  let roles: Role[] = [];

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      await processLog(log, block, ctx, actions, roles, config);
    }
  }

  await ctx.store.save(actions);
  await ctx.store.insert(roles);
});
