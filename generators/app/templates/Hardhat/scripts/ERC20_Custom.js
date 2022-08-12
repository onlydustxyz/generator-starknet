const hre = require("starknet");

<%= testingVars %>

async function main() {
  const contractFactory = await starknet.getContractFactory("ERC20");
  const account = await starknet.deployAccount("OpenZeppelin");
  const owner = account.starknetContract.address;

  const contract = await contractFactory.deploy({
      <%= constructorCalldata %>
  });

  await contract.deployed();

  console.log(`Deployed contract ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

