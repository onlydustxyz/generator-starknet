const { starknet } = require("hardhat");

const SPENDER = 9
const NAME = starknet.shortStringToBigInt("Starknet")
const SYMBOL = starknet.shortStringToBigInt("STARK")
const INIT_SUPPLY = { low: 1000n, high: 0n }
const DECIMALS = 18n

async function main() {
  const contractFactory = await starknet.getContractFactory("ERC20");
  const account = await starknet.deployAccount("OpenZeppelin");
  const owner = account.starknetContract.address;

  const contract = await contractFactory.deploy({
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

