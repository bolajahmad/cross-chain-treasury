import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenReceiverModule", (m) => {
    const MNEE_ADDRESS = "0xfB50e85DFAFD85fD143DCeaCd0a633cbfBc6Fe35";
  const receiver = m.contract("TokenReceiver", [
    MNEE_ADDRESS
  ]);

  return { receiver };
});
