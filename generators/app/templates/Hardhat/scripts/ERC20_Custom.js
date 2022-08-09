const hre = require("starknet");

<%= testingVars %>

async function main() {
  contractFactory = await starknet.getContractFactory("ERC20");
  account = await starknet.deployAccount("OpenZeppelin");
  owner = account.starknetContract.address;

  contract = await contractFactory.deploy({
      <%= constructorCalldata %>
  });

  await contract.deployed();

  console.log(`Deployed contract ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

