const { expect } = require("chai");
const { starknet } = require("hardhat");


describe("Test contract : ERC20", function () {

    let contractFactory;
    let contract;
    this.timeout(120000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("ERC20");
        contract = await contractFactory.deploy();
    });

    beforeEach(async () => {
        identification++;
    });

    describe("allowance", function () {
        it("Should create a stack and assert that it is empty.", async function () {
            const { remaining } = await contract.call("allowance", { identification });
            expect(remaining).to.equal(BigInt(1));
        });
    });
});

