const { starknet } = require("hardhat");

<%= testingVars %>

async function main() {
  account = await starknet.deployAccount("OpenZeppelin");
  const owner = account.starknetContract.address;
  console.log(`Deployed account ${owner}`);

  const implFactory = await starknet.getContractFactory("ERC20");
  const impl = await implFactory.deploy();
  console.log(`Deployed implementation ${impl.address}`);

  const proxyFactory = await starknet.getContractFactory("Proxy");
  const proxy = await proxyFactory.deploy({
      implementation_address: impl.address
  });
  console.log(`Deployed proxy ${proxy.address}`);

  instance = implFactory.getContractAt(proxy.address);

  await account.invoke(instance, "initializer", {
      <%= constructorCalldata %>
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

