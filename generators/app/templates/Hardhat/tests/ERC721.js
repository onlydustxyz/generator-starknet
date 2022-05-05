const { expect } = require("chai");
const { starknet } = require("hardhat");

describe("Test contract : ER721", function () {

    let contractFactory;
    let contract;
    this.timeout(120000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("ERC721");
        contract = await contractFactory.deploy();
    });

    beforeEach(async () => {
        identification++;
    });

    describe("Testing creation & empty", function () {
        it("Should create a stack and assert that it is empty.", async function () {
            const { isEmpty } = await contract.call("empty", { identification });
            expect(isEmpty).to.equal(BigInt(1));
        });
    });
});