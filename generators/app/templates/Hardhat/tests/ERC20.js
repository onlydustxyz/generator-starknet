const { expect } = require("chai");
const { starknet } = require("hardhat");

<%= testingVars %>

describe("Test contract : ERC20", function () {

    let contractFactory;
    let contract;
    this.timeout(300_000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("ERC20");
        contract = await contractFactory.deploy({
            <%= constructorCalldata %>
        });
    });

    describe("Deploy", function () {
        it("Should deploy an ERC20 contract and make sure it has the correct name", async function () {
            const { name } = await contract.call("name", {});
            expect(name).to.equal(NAME);
        });
    });
});


