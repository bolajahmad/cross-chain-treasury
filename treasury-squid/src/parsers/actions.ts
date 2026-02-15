import { DataHandlerContext } from "@subsquid/evm-processor";
import { Action } from "../model";
import { Store } from "@subsquid/typeorm-store";

type StoreContext = DataHandlerContext<
  Store,
  {
    log: {
      transactionHash: true;
    };
  }
>;

const checkIfActionExists = async (
  ctx: StoreContext,
  id: string,
  actions: Action[] = [],
) => {
  return (
    (await ctx.store.findOne(Action, {
      where: {
        actionId: id,
      },
    })) || actions.find(({ actionId, actionType }) => actionId == id)
  );
};

export const onActionExecuted = async (
  ctx: StoreContext,
  aId: string,
  actions: Action[],
) => {
  let action = await checkIfActionExists(ctx, aId, actions);

  if (action && [3, 4, 5].includes(action.actionType)) {
    // Check the action type to determine the new status
    // Then the referenced action must be stopped,
    let refAId = action.params;

    // Update the status
    let refAction = await checkIfActionExists(ctx, refAId, actions);
    if (refAction) {
      refAction.status =
        action.actionType == 3
          ? "STOPPED"
          : action.actionType == 4
            ? "PAUSED"
            : "PENDING";

      // Check if action exists in temp actions list
      let isExisting = actions.findIndex(({ actionId: aid }) => aid == refAId);
      if (isExisting >= 0) {
        actions[isExisting] = refAction;
      } else {
        actions.push(refAction);
      }
    }
  }
};

export const onPayoutFinalized = async (
  ctx: StoreContext,
  aId: string,
  amount: bigint,
  actions: Action[],
) => {
  let action =
    (await ctx.store.findOne(Action, {
      where: {
        actionId: aId,
      },
    })) || actions.find(({ actionId, actionType }) => actionId == aId);
  if (action) {
    action.value += amount;
    let isExisting = actions.findIndex(
      ({ actionId: aid }) => aid == action.actionId,
    );
    if (isExisting >= 0) {
      actions[isExisting] = action;
    } else {
      actions.push(action);
    }
  }
};
