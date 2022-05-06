const { expect } = require("chai");
const { starknet } = require("hardhat");

const OWNER = 42
const NAME = starknet.shortStringToBigInt("Starknet NFT")
const SYMBOL = starknet.shortStringToBigInt("STARK")

describe("Test contract : ERC721", function () {

    let contractFactory;
    let contract;
    this.timeout(300_000);

    before(async () => {
        contractFactory = await starknet.getContractFactory("ERC721");
        contract = await contractFactory.deploy({
            name: NAME,
            symbol: SYMBOL,
            owner: OWNER,
        });
    });

    describe("Deploy", function () {
        it("Should deploy an ERC721 contract and make sure it has the correct name", async function () {
            const { name } = await contract.call("name", {});
            expect(name).to.equal(NAME);
        });
    });
});


