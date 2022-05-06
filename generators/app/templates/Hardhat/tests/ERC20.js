const { expect } = require("chai");
const { starknet } = require("hardhat");

const OWNER = 42
const NAME = starknet.shortStringToBigInt("Starknet")
const SYMBOL = starknet.shortStringToBigInt("STARK")
const INIT_SUPPLY = { low: 1000, high: 0 }
const DECIMALS = 18

describe("Test contract : ERC20", function () {

    let contractFactory;
    let contract;
    this.timeout(300_000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("ERC20");
        contract = await contractFactory.deploy({
            name: NAME,
            symbol: SYMBOL,
            decimals: DECIMALS,
            initial_supply: INIT_SUPPLY,
            recipient: OWNER
        });
    });

    describe("Deploy", function () {
        it("Should deploy an ERC20 contract and make sure it has the correct name", async function () {
            const { name } = await contract.call("name", {});
            expect(name).to.equal(NAME);
        });
    });
});


