const { NILE, HARDHAT } = require("./constants");
const { formatArgs, formatLines } = require("./utils");

function getConstructorProps(props) {
  if (props.framework === NILE) {
    if (!props.customizeERC721) {
      return nileDefaults();
    }

    return nileCustomized(props);
  }

  if (props.framework === HARDHAT) {
    if (!props.customizeERC721) {
      return hardhatDefaults();
    }

    return hardhatCustomized(props);
  }

  function nileDefaults() {
    return {
      testingVars: formatLines([
        "OWNER = 42",
        'NAME = str_to_felt("Starknet NFT")',
        'SYMBOL = str_to_felt("STARK")',
      ]),
      constructorCalldata: "NAME, SYMBOL, OWNER",
    };
  }

  function hardhatDefaults() {
    return {
      testingVars: formatLines([
        "const OWNER = 42",
        'const NAME = starknet.shortStringToBigInt("Starknet NFT")',
        'const SYMBOL = starknet.shortStringToBigInt("STARK")',
      ]),
      constructorCalldata: formatArgs([
        "name: NAME",
        "symbol: SYMBOL",
        "owner: OWNER",
      ]),
    };
  }

  function nileCustomized(props) {
    const calldata = [];

    if (props.erc721mintable || props.erc721pausable) {
      calldata.push(
        props.erc721upgradeable ? "admin.contract_address" : "OWNER"
      ); // Owner
    }

    if (props.erc721upgradeable) {
      calldata.push("admin.contract_address"); // Proxy admin
    }

    return {
      testingVars: needsOwnerVariable(calldata)
        ? formatLines([
            "OWNER = 42",
            `NAME = str_to_felt("${props.erc721name}")`,
          ])
        : `NAME = str_to_felt("${props.erc721name}")`,
      constructorCalldata: formatArgs(calldata),
    };
  }

  function hardhatCustomized(props) {
    const calldata = [];

    if (props.erc721mintable || props.erc721pausable) {
      calldata.push(
        props.erc721upgradeable ? "owner: accountAddress" : "owner: OWNER"
      );
    }

    if (props.erc721upgradeable) {
      calldata.push("proxy_admin: accountAddress"); // Proxy admin
    }

    return {
      testingVars: needsOwnerVariable(calldata)
        ? formatLines([
            "const OWNER = 42",
            `const NAME = starknet.shortStringToBigInt("${props.erc721name}")`,
          ])
        : `const NAME = starknet.shortStringToBigInt("${props.erc721name}")`,
      constructorCalldata: formatArgs(calldata),
    };
  }
}

function needsOwnerVariable(calldata) {
  return calldata.some((s) => s.includes("OWNER"));
}

module.exports = { getERC721ConstructorProps: getConstructorProps };
