const { expect } = require("chai");
const { starknet } = require("hardhat");

<%= testingVars %>

describe("Testing contract : ERC721", function () {

    let contractFactory;
    let contract;
    this.timeout(300_000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("ERC721");
        contract = await contractFactory.deploy({
            <%= constructorCalldata %>
        });
    });

    describe("Deploy", function () {
        it("Should deploy an ERC721 contract and make sure it has the correct name", async function () {
            const { name } = await contract.call("name", {});
            expect(name).to.equal(NAME);
        });
    });
});



