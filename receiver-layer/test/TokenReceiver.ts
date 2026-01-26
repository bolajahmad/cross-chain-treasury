import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import {
  encodeAbiParameters,
  encodePacked,
  hexToBytes,
  keccak256,
  parseUnits,
  toHex,
  zeroAddress,
} from "viem";
import { randomBytes } from "node:crypto";
import { encodeReceiverData } from "./utils/codec.js";

const { viem } = await network.connect();

describe("TokenReceiver", () => {
  let deployer: any;
  let user: any;
  let recipient: any;

  let mnee: any;
  let feeToken: any;
  let dispatcher: any;
  let receiver: any;

  const ACTION = toHex(randomBytes(32));
  const AMOUNT = parseUnits("10", 18);
  const FEE = parseUnits("1", 18);

  beforeEach(async () => {
    const [a, b, c] = await viem.getWalletClients();
    deployer = a;
    user = b;
    recipient = c;

    // Deploy mock ERC20s
    mnee = await viem.deployContract("MockERC20", ["MNEE", "MNEE"]);
    feeToken = await viem.deployContract("MockERC20", ["FEE", "FEE"]);

    // Deploy mock dispatcher
    dispatcher = await viem.deployContract("MockDispatcher");

    // Deploy TokenReceiver
    receiver = await viem.deployContract("TokenReceiver", [
      mnee.address,
      feeToken.address,
      dispatcher.address,
    ]);

    // Mint balances
    await mnee.write.mint([user.account.address, AMOUNT]);
    await feeToken.write.mint([user.account.address, FEE]);

    // Approvals
    await mnee.write.approve([receiver.address, AMOUNT * 100n], {
      account: user.account,
    });
    await feeToken.write.approve([receiver.address, FEE * 50n], {
      account: user.account,
    });
  });

  it("creates escrow on deposit", async () => {
    await receiver.write.deposit(
      [recipient.account.address, AMOUNT, 0, ACTION, FEE],
      { account: user.account },
    );

    const escrow = await receiver.read.escrows([keccak256(hexToBytes(ACTION))]);

    assert.equal(escrow[0].toLowerCase(), user.account.address.toLowerCase());
    assert.equal(escrow[1], AMOUNT);
    assert.equal(escrow[2], 0n);
    assert.equal(escrow[3], 0); // LOCKED
  });

  it("rejects zero amount deposits", async () => {
    await assert.rejects(async () => {
      await receiver.write.deposit(
        [recipient.account.address, 0n, 1, ACTION, FEE],
        { account: user.account },
      );
    });
  });

  it("releases funds via onAccept", async () => {
    await receiver.write.deposit(
      [recipient.account.address, AMOUNT, 0, ACTION, FEE],
      { account: user.account },
    );

    const body = encodeReceiverData(
      0, ACTION, recipient.account.address, AMOUNT,
    );

    let network = await receiver.read.currentNetwork();
    await dispatcher.write.callOnAccept(
      [
        receiver.address,
        {
          request: {
            source: network,
            body,
            dest: "0x",
            from: "0x",
            nonce: 0n,
            timeoutTimestamp: 0n,
            to: "0x",
          },
          relayer: deployer.account.address,
        },
      ],
      { account: deployer.account },
    );

    const escrow = await receiver.read.escrows([keccak256(hexToBytes(ACTION))]);

    assert.equal(escrow[2], AMOUNT);
    assert.equal(escrow[3], 2); // PARTIAL
  });

  it("completes escrow when fully released", async () => {
    await receiver.write.deposit(
      [recipient.account.address, AMOUNT, 1, ACTION, FEE],
      { account: user.account },
    );

    const body = encodeReceiverData(
     1, ACTION, recipient.account.address, AMOUNT,
    );

    let network = await receiver.read.currentNetwork();
    await dispatcher.write.callOnAccept(
      [
        receiver.address,
        {
          request: {
            source: network,
            body,
            dest: "0x",
            from: "0x",
            nonce: 0n,
            timeoutTimestamp: 0n,
            to: "0x",
          },
          relayer: deployer.account.address,
        },
      ],
      { account: deployer.account },
    );

    const escrow = await receiver.read.escrows([keccak256(hexToBytes(ACTION))]);
    console.log({ escrow });
    assert.equal(escrow[3], 2); // COMPLETED
    assert.equal(escrow[2], AMOUNT);
  });

  it("refunds remaining funds when actionType == 3", async () => {
    await receiver.write.deposit(
      [recipient.account.address, AMOUNT, 1, ACTION, FEE],
      { account: user.account },
    );

    const body = encodeReceiverData(
      3, ACTION, zeroAddress, 0n,
    );

    let network = await receiver.read.currentNetwork();
    await dispatcher.write.callOnAccept(
      [
        receiver.address,
        {
          request: {
            source: network,
            body,
            dest: "0x",
            from: "0x",
            nonce: 0n,
            timeoutTimestamp: 0n,
            to: "0x",
          },
          relayer: deployer.account.address,
        },
      ],
      { account: deployer.account },
    );

    const escrow = await receiver.read.escrows([keccak256(hexToBytes(ACTION))]);
    assert.equal(escrow[3], 3); // REFUNDED
  });

  it("prevents over-release", async () => {
    await receiver.write.deposit(
      [recipient.account.address, AMOUNT, 1, ACTION, FEE],
      { account: user.account },
    );

    const body = encodeReceiverData(
      1, ACTION, recipient.account.address, parseUnits("20", 18)
    );

    await assert.rejects(async () => {
      let network = await receiver.read.currentNetwork();
      await dispatcher.write.callOnAccept(
        [
          receiver.address,
          {
            request: {
              source: network,
              body,
              dest: "0x",
              from: "0x",
              nonce: 0n,
              timeoutTimestamp: 0n,
              to: "0x",
            },
            relayer: deployer.account.address,
          },
        ],
        { account: deployer.account },
      );
    });
  });
});
