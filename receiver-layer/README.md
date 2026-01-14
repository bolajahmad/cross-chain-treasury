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

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
