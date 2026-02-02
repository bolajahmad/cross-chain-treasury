import { network } from "hardhat";
import { randomBytes } from "node:crypto";
import { before, beforeEach, describe, it } from "node:test";
import { keccak256, parseEther, parseUnits, toHex } from "viem";
import {
  encodeActionData,
  encodeBatchPayoutData,
  encodeStreamStartData,
} from "./utils/codec.js";
import assert from "node:assert/strict";

const { viem } = await network.connect();

describe("Treasury", async () => {
  let deployer: any,
    user: any,
    user2: any,
    recipient: any,
    treasury: any,
    token: any;

  const ACTION = toHex(randomBytes(32));
  const AMOUNT = parseUnits("1000000", 18);

  beforeEach(async () => {
    const [a, b, c, d] = await viem.getWalletClients();

    deployer = a;
    user = b;
    user2 = d;
    recipient = c;

    token = await viem.deployContract("MockERC20", ["MNEE", "MNEE"]);
    treasury = await viem.deployContract("ActionsContract", [10n]);

    // Mint balances
    await token.write.mint([deployer.account.address, AMOUNT]);
    await token.write.mint([user.account.address, AMOUNT]);

    // Approve allowances
    await token.write.approve([treasury.address, AMOUNT * 100n], {
      account: deployer.account,
    });
    await token.write.approve([treasury.address, AMOUNT * 100n], {
      account: user.account,
    });
  });

  describe("Treasury.createAction", async () => {
    it("allows controller to create action", async () => {
      const id = keccak256("0x01");
      const params = encodeActionData(
        recipient.account.address,
        AMOUNT,
        ACTION,
        token.address,
      );

      await treasury.write.createAction([id, 0, params], {
        account: deployer.account,
      });
      const action = await treasury.read.action([id]);

      assert.equal(
        action.record.actionType,
        0,
        "Action Type should be correct",
      );
      assert.equal(action.record.status, 1, "Status should be correct");

      assert.equal(
        action.token.toLowerCase(),
        deployer.account.address.toLowerCase(),
        "Token should be correct",
      );
    });

    it("reverts if non-controller tries to create action", async () => {
      const id = keccak256("0x01");

      await assert.rejects(
        treasury.write.createAction([id, 0, "0x00394393"], {
          account: user.account,
        }),
        "Only controller can call this function",
      );
    });

    it("Allows anyone create action", async () => {
      const id = keccak256("0x01");
      const value = parseEther("1");

      // Get the locked balance
      const prevLocked = await treasury.read.lockedBalance([token.address]);

      const params = encodeActionData(
        recipient.account.address,
        value,
        ACTION,
        token.address,
      );
      await treasury.write.createAction([id, 0, params, token.address], {
        account: user.account,
      });
      const action = await treasury.read.action([id]);

      assert.equal(
        action.record.actionType,
        0,
        "Action Type should be correct",
      );
      assert.equal(action.record.status, 1, "Status should be correct");

      assert.equal(
        action.token.toLowerCase(),
        token.address.toLowerCase(),
        "Token should be correct",
      );

      // Should increase lock balances
      const newLocked = await treasury.read.lockedBalance([token.address]);
      assert.equal(
        newLocked,
        prevLocked + value,
        "Locked balance should increase",
      );
    });

    it("Should update contract balance on createAction", async () => {
      const id = keccak256("0x01");
      const value = parseUnits("50", 18);
      const params = encodeActionData(
        recipient.account.address,
        value,
        ACTION,
        token.address,
      );

      const prevBalance = await token.read.balanceOf([treasury.address]);

      await treasury.write.createAction([id, 0, params, token.address], {
        account: user.account,
      });
      const lockedBalance = await treasury.read.lockedBalance([token.address]);

      const newBalance = await token.read.balanceOf([treasury.address]);
      assert.equal(
        newBalance,
        prevBalance + value,
        "Treasury balance should increase",
      );

      assert.equal(lockedBalance, value, "Locked balance should be correct");
    });

    describe("BATCH_PAYOUT action", async () => {
      it("creates BATCH_PAYOUT action", async () => {
        const id = keccak256("0x02");
        const value = parseUnits("2", 18);

        const params = encodeBatchPayoutData(
          [
            recipient.account.address,
            deployer.account.address,
            user2.account.address,
          ],
          [value, value, value],
          ACTION,
          token.address,
        );
        let userBalance = await token.read.balanceOf([user.account.address]);

        await treasury.write.createAction([id, 1, params, token.address], {
          account: user.account,
        });
        assert.equal(
          await treasury.read.lockedBalance([token.address]),
          value * 3n,
          "Locked balance should be correct",
        );
        assert.equal(
          userBalance,
          (await token.read.balanceOf([user.account.address])) + 3n * value,
        );
      });

      it("user must have sufficient funds", async () => {
        const id = keccak256("0x02");
        const value = parseUnits("200000", 18);

        const params = encodeBatchPayoutData(
          [
            recipient.account.address,
            deployer.account.address,
            user2.account.address,
          ],
          [value, value, value],
          ACTION,
          token.address,
        );

        await assert.rejects(
          treasury.write.createAction([id, 1, params, token.address], {
            account: user2.account,
          }),
        );
      });
    });

    describe("STREAM_START", async () => {
      it("creates STREAM_START action", async () => {
        const id = keccak256("0x88");
        const value = parseUnits("2", 18);
        const startTime = Math.round(Date.now() / 1000),
          cliff = 60 * 5;

        const params = encodeStreamStartData(
          recipient.account.address,
          value,
          BigInt(startTime),
          BigInt(cliff),
        );

        await treasury.write.createAction([id, 2, params, token.address], {
          account: user.account,
        });

        assert.equal(
          await treasury.read.lockedBalance([token.address]),
          value,
          "Value should be locked"
        );
      });
    });
  });

  describe("Treasury.executeAction", async () => {
    before(async () => {});
    it("rejects execution of non-existent action", async () => {
      await assert.rejects(
        treasury.write.executeTreasuryAction([keccak256("0x00439493")], {
          account: deployer.account,
        }),
        (err: any) => {
          return err.message.includes("Action does not exist");
        },
      );
    });

    it("executes existing actions", async () => {
      const id = keccak256("0x01");
      const value = parseUnits("50", 18);

      const params = encodeActionData(
        recipient.account.address,
        value,
        ACTION,
        token.address,
      );

      await treasury.write.createAction([id, 0, params, token.address], {
        account: user.account,
      });

      // Execute the action
      await treasury.write.executeTreasuryAction([id], {
        account: user.account,
      });

      // Should have same balance
      const recipientBalance = await token.read.balanceOf([
        recipient.account.address,
      ]);
      assert.equal(
        recipientBalance,
        value,
        "Recipient should receive correct amount",
      );
    });

    describe("BATCH_PAYOUT actions", async () => {
      it("executes BATCH_PAYOUT action", async () => {
        const id = keccak256("0x02");
        const value = parseUnits("2", 18);

        const params = encodeBatchPayoutData(
          [recipient.account.address, deployer.account.address],
          [value, value],
          ACTION,
          token.address,
        );
        let recipientBalance = await token.read.balanceOf([
          recipient.account.address,
        ]);
        let deployerBalance = await token.read.balanceOf([
          deployer.account.address,
        ]);

        await treasury.write.createAction([id, 1, params, token.address], {
          account: user.account,
        });
        await treasury.write.executeTreasuryAction([id], {
          account: user.account,
        });

        assert(
          recipientBalance <
            (await token.read.balanceOf([recipient.account.address])),
          "Recipient should receive funds",
        );
        assert.equal(
          deployerBalance + value,
          await token.read.balanceOf([deployer.account.address]),
          "Deployer should receive funds",
        );
        assert.equal(
          await treasury.read.lockedBalance([token.address]),
          0n,
          "Locked tokens should be released"
        )
      });
    });
  });
});
