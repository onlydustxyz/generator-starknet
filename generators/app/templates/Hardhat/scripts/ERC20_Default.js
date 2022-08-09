const { starknet } = require("hardhat");

const SPENDER = 9
const NAME = starknet.shortStringToBigInt("Starknet")
const SYMBOL = starknet.shortStringToBigInt("STARK")
const INIT_SUPPLY = { low: 1000n, high: 0n }
const DECIMALS = 18n

async function main() {
  contractFactory = await starknet.getContractFactory("ERC20");
  account = await starknet.deployAccount("OpenZeppelin");
  owner = account.starknetContract.address;

  contract = await contractFactory.deploy({
      name: NAME,
      symbol: SYMBOL,
      decimals: DECIMALS,
      initial_supply: INIT_SUPPLY,
      recipient: owner,
  });

  await contract.deployed();

  console.log(`Deployed contract ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

