# X-Chain Programmable Vault

This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

## Project Overview

This project includes:

- A Mock token contract
- A [TokenReceiver](./contracts/TokenReceiver.sol) contract
- A [Controller](./contracts/TreasuryController.sol) contract
- A final [Actions](./contracts/Treasury.sol) contract

## Deploying

The smart contracts each rely on the other and to deploy them, they have to follow a structure.

a. First, deploy the Mock token contract (as this is needed in the constructor of TokenReceiver)
b. Deploy the token receiver contract
c. Deploy the Controller 
d. Deploy the last one, Actions contract

### Actions Contract

This contract houses a number of *predetermined* actions, which are technically instructions describing what should happen on-chain. An Action comprises of multiple `Executor` contracts with the base interface below:

```
    interface IExecutor {
        function execute(address treasury, bytes32 id) external;
    }
```

The core concept around this is that, ac Action should be a persisted instruction that only describes:
i. who gets paid
ii. how much is involved
iii. conditions for payment
iv. the execution strategy

The actions are not payments themselves, they only signify intent to pay. Once an action is created, it can only be stopped by the *creator*.

The ActionsContract is a source of truth for actions. It:
1. Stores all action state(s)
2. Validates whether an action can be executed
3. Routes desired execution to the correct executor(s)
4. Enforces invariants, handles all fraud-checks also

### Action Lifecycle

1. Initialization
   Deploy the ActionsContract, this only expects one parameter (the maxActions)
2. Creation
   There are 2 paths to creating an Action, directly from an EOA and Cross-chain through a Controller. The easier one is with an EOA.

   a. EOA-triggered -> An EOA (the creator), calls the createAction message. Some tokens will be paid, this is specified in the parameter. If token is the zeroAddress, then the token is the native token. The amount is locked, unti the action is executed

   b. Cross-chain triggered -> In this case, no tokens are locked by Actions (because the tokens exist on the source chain). This overload can only be called by a CONTROLLER contract. This contract encodes the cross-chain message and picks out the Actions parameters.

3. Execution
   Execution is done by calling an *executeAction* message, passing in only the actionID. Anyone can call this message but the conditions for completing the action is determined on-chain. In the future, we will add a logic to ensure only a combination of the creator and receiver can execute the action(s).

   Execution starts on the Action contract but is routed to one of the set executor contracts.

### Executors

Executors are stateless logic modules that:
- Compute how much can be paid
- Update the action states
- Trigger trasury transfers

They rely on ActionsContract for validaion and storage. Once an executor is set on a contract, it cannot be changed again and only a EOA with the EXECUTOR role can set one.

Executors hold no funds as they rely only on the Actions contract for this.

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

