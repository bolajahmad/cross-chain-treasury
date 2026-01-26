import { network } from "hardhat";
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { encodeActionData, encodeControllerAcceptData, encodeReceiverData } from "./utils/codec.js";
import { encodePacked } from "viem";

const { viem } = await network.connect();

describe("ActionController", () => {
  let deployer: any;
  let treasury: any;
  let dispatcher: any;
  let controller: any;
  let receiver: any;

  let sourceChain: any;
  let sourceApp: any;

  beforeEach(async () => {
    const [a,b ] = await viem.getWalletClients();
    deployer = a;
    receiver = b

    sourceChain = 84532;
    sourceApp = "0x2Cea0acbab5D5788d241D7279b2ebE0C5d49512D";

    treasury = await viem.deployContract("MockTreasury", [10n])
    dispatcher = await viem.deployContract("MockDispatcher");
    controller = await viem.deployContract("TreasuryController", [
      dispatcher.address,
      treasury.address,
      sourceChain,
      sourceApp,
    ]);
  });

  it("initialized with correct configurations", async () => {
    const host = await controller.read.host();
    const treasuryAddress = await controller.read.treasury();

    assert.equal(
      host.toLowerCase(),
      dispatcher.address.toLowerCase(),
      "Host should be correct",
    );
    assert.equal(
      treasuryAddress.toLowerCase(),
      treasury.address.toLowerCase(),
      "Treasury should initialize correctly!",
    );
  });

  it("allows owner to update treasury", async () => {
    let [a, b] = await viem.getWalletClients();
    const owner = a;

    const newTreasury = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    await controller.write.changeTreasury([newTreasury], {
      account: owner.account,
    });

    assert.equal(
      (await controller.read.treasury()).toLowerCase(),
      newTreasury.toLowerCase(),
      "Treasury should be updated!",
    );

    const attacker = b;
    assert.rejects(async () => {
      await controller.write.changeTreasury([treasury.account.address], {
        account: attacker.account,
      });
    });
  });

  it("decodes valid action type payload", async () => {
    const actionType = 1;
    const amount = 1e18;
    const metadata = "0x7564756487364647364736473647373647373647373";

    const action = encodeActionData(deployer.account.address, BigInt(amount), metadata);
    const body = encodeControllerAcceptData(
      actionType,
      BigInt(amount),
      action,
    );
    console.log("MockDispatcher address:", dispatcher.address);

    let sourceApp = await controller.read.SOURCE_APP();
    let sourceChain = await controller.read.SOURCE_CHAIN();

    await dispatcher.write.callOnAccept([
      controller.address,
      {
        request: {
          source: sourceChain,
          body,
          dest: "0x",
          from: sourceApp,
          nonce: 0n,
          timeoutTimestamp: 0n,
          to: receiver.account.address,
        },
        relayer: deployer.account.address,
      },
    ], { account: deployer.account});
  });
});
