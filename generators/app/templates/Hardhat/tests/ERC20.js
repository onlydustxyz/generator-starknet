const { expect } = require("chai");
const { starknet } = require("hardhat");

<%= testingVars %>

describe("Test contract : ERC20", function () {

        let contractFactory;
        let contract;
        this.timeout(300_000);

        before(async () => {
            contractFactory = await starknet.getContractFactory("ERC20");
            account = await starknet.deployAccount("OpenZeppelin");
            owner = account.starknetContract.address;
            contract = await contractFactory.deploy({
              recipient: owner,
              <%= constructorCalldata %>
        });
    });

    describe("Testing deploy ERC20", function () {
        it("Should make sure it has the correct name", async function () {
            const { name } = await contract.call("name", {});
            expect(name).to.equal(NAME);
        });
        it("Should make sure it has the correct symbol", async function () {
            const { symbol } = await contract.call("symbol", {});
            expect(symbol).to.equal(SYMBOL);
        });
        it("Should make sure it has the correct decimals", async function () {
            const { decimals } = await contract.call("decimals", {});
            expect(decimals).to.equal(DECIMALS);
        });
        it("Should make sure it has the correct totalSupply", async function () {
            const { totalSupply } = await contract.call("totalSupply", {});
            expect(totalSupply.low).to.equal(INIT_SUPPLY.low);
            expect(totalSupply.high).to.equal(INIT_SUPPLY.high);
        });
        it("Should make sure the initial supply is correctly transfered to the owner", async function () {
            const { balance } = await contract.call("balanceOf", { account: owner });
            expect(balance.low).to.equal(INIT_SUPPLY.low);
            expect(balance.high).to.equal(INIT_SUPPLY.high);
        });
    });

    describe("Testing approval", function () {
        it("Should check that the default allowance is zero then increase it and make sure it is correctly increased", async function () {
            const { remaining: r1 } = await contract.call("allowance", { owner: owner, spender: SPENDER });
            expect(r1.low).to.equal(0n);
            expect(r1.high).to.equal(0n);
            await account.invoke(contract, "approve", { spender: SPENDER, amount: { low: 10n, high: 11n } });
            const { remaining: r2 } = await contract.call("allowance", { owner: owner, spender: SPENDER });
            expect(r2.low).to.equal(10n);
            expect(r2.high).to.equal(11n);
        });
        it("Should fail when calling approve when the spender is the zero address", async function () {
            try {
                await account.invoke(contract, "approve", { spender: 0n, amount: { low: 10n, high: 11n } });
                expect.fail("Should have failed when the spender is the zero address");
            } catch (err) {
                expect(err.message).to.contain("ERC20: cannot approve to the zero address");
            }
        });
        it("Should fail when calling approve when the caller is the zero address", async function () {
            try {
                await contract.invoke("approve", { spender: SPENDER, amount: { low: 10n, high: 11n } });
                expect.fail("Should have failed when the spender is the zero address");
            } catch (err) {
                expect(err.message).to.contain("ERC20: zero address cannot approve");
            }
        });
        it("Should make sure that an event is triggered when calling approve", async function () {
            const txHash = await account.invoke(contract, "approve", { spender: SPENDER, amount: { low: 10n, high: 11n } });
            const receipt = await starknet.getTransactionReceipt(txHash);
            const firstEvent = receipt.events[0]
            expect(parseHexToBigInt(firstEvent.data[0])).to.equal(parseHexToBigInt(owner))
            expect(parseHexToBigInt(firstEvent.data[1])).to.equal(9n)
            expect(parseHexToBigInt(firstEvent.data[2])).to.equal(10n)
            expect(parseHexToBigInt(firstEvent.data[3])).to.equal(11n)
            expect(parseHexToBigInt(firstEvent.from_address)).to.equal(parseHexToBigInt(contract.address))
            expect(firstEvent.keys[0]).to.equal("0x134692b230b9e1ffa39098904722134159652b09c5bc41d88d6698779d228ff") // "Aproval"
        });
    });
    describe("Testing transfer", function () {
        it("Should mak sure that when trasfering the balance are correctly updated", async function () {
            await account.invoke(contract, "approve", { spender: SPENDER, amount: { low: 10n, high: 0 } });
            await account.invoke(contract, "transfer", { recipient: SPENDER, amount: { low: 10n, high: 0 } });
            const { balance: b1 } = await contract.call("balanceOf", { account: owner });
            expect(b1.low).to.equal(990n);
            expect(b1.high).to.equal(0n);
            const { balance: b2 } = await contract.call("balanceOf", { account: SPENDER });
            expect(b2.low).to.equal(10n);
            expect(b2.high).to.equal(0n);
        });
    });
});

function parseHexToBigInt(hexValue) {
    return BigInt(parseInt(hexValue, 16))
}



