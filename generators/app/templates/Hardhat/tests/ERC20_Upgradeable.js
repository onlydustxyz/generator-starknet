const { expect } = require("chai");
const { starknet } = require("hardhat");

<%= testingVars %>

describe("Test contract : ERC20", function () {

    let account;
    let instance;

    this.timeout(300_000);

    before(async () => {
        account = await starknet.deployAccount("OpenZeppelin");
        const accountAddress = account.starknetContract.address;
        console.log(`Deployed account ${accountAddress}`);
        
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
    });

    describe("Deploy", function () {
        it("Should deploy an ERC20 contract and make sure it has the correct name", async function () {
            const { name } = await account.call(instance, "name");
            expect(name).to.equal(NAME);
        });
    });
});

