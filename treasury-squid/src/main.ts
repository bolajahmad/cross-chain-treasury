import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Action, Transfer } from "./model";
import * as erc20abi from "./abi/erc20";
import * as treasuryAbi from "./abi/treasury";
import { makeProcessor } from "./processor";
import { networksConfigs } from "./networksConfigs";
import assert from "assert";

assert(
  networksConfigs.hasOwnProperty(process.argv[2]),
  `Processor executable takes one argument - a network string ID - ` +
    `that must be in ${JSON.stringify(Object.keys(networksConfigs))}. Got "${
      process.argv[2]
    }".`
);

const network = process.argv[2];
const config = networksConfigs[network];

const processor = makeProcessor(config);
const database = new TypeormDatabase({
  supportHotBlocks: true,
  stateSchema: `${network}_processor`, // state schema must vary by processor if there's more than one
});

processor.run(database, async (ctx) => {
  const actions: Action[] = [];
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (log.address === config.contract) {
        if (log.topics[0] == treasuryAbi.events.ActionCreated.topic) {
          let { id, actionType, params } =
            treasuryAbi.events.ActionCreated.decode(log);
          console.log({ id, actionType, params });
          actions.push(new Action({
            id: log.id,
            network: config.chain,
            block: block.header.height,
            timestamp: new Date(block.header.timestamp),
            params,
            status: "PENDING",
            txHash: log.transactionHash,
            actionId: id,
            actionType,
            value: 0n,
          }));
        }
      }
    }
  }
  await ctx.store.insert(actions);
});
