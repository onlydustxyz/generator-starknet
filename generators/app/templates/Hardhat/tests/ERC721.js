
//we import expect to test values
const { expect } = require("chai");
// These two lines allow us to play with our testnet and access our deployed contract 
const { starknet } = require("hardhat");
const { StarknetContract, StarknetContractFactory } = require("hardhat/types/runtime");


describe("Test contract : ER721", function () {

    let contractFactory;
    let contract;
    this.timeout(120000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("Stack");
        contract = await contractFactory.deploy();

    });
    beforeEach(async () => {
        // Done to use a different stack each time
        identification++;
    });


    describe("Testing creation & empty", function () {
        it("Should create a stack and assert that it is empty.", async function () {
            const { isEmpty } = await contract.call("empty", { identification });
            expect(isEmpty).to.equal(BigInt(1));
        });

        it("Should create a stack, push a value and expect that it is not empty.", async function () {
            await contract.invoke("push", { identification, valueToPush: 1 });
            const { isEmpty } = await contract.call("empty", { identification });
            expect(isEmpty).to.equal(BigInt(0));
        });
    });

