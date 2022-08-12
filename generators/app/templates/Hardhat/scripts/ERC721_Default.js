const { starknet } = require("hardhat");

const OWNER = 42
const NAME = starknet.shortStringToBigInt("Starknet NFT")
const SYMBOL = starknet.shortStringToBigInt("STARK")

async function main() {
  const contractFactory = await starknet.getContractFactory("ERC721");
  const contract = await contractFactory.deploy({
      name: NAME,
      symbol: SYMBOL,
      owner: OWNER,
  });

  await contract.deployed();

  console.log(`Deployed contract ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

