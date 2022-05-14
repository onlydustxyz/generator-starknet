const { NILE, HARDHAT } = require("./constants");
const { formatArgs, formatLines } = require("./utils");

function getConstructorProps(props) {
  if (props.framework === NILE) {
    if (!props.customizeERC20) {
      return nileDefaults();
    }

    return nileCustomized();
  }

  if (props.framework === HARDHAT) {
    if (!props.customizeERC20) {
      return hardhatDefaults();
    }

    return hardhatCustomized();
  }

  function nileDefaults() {
    // Not needed since default template has no string substitution
    return {
      testingVars: "",
      constructorCalldata: "",
    };
  }

  function hardhatDefaults() {
    return {
      testingVars: formatLines([
        "const OWNER = 42",
        'const SPENDER = 9',
        'const NAME = starknet.shortStringToBigInt("Starknet")',
        'const SYMBOL = starknet.shortStringToBigInt("STARK")',
        "const INIT_SUPPLY = { low: 1000, high: 0 }",
        "const DECIMALS = 18",
      ]),
      constructorCalldata: formatArgs([
        "name: NAME",
        "symbol: SYMBOL",
        "decimals: DECIMALS",
        "initial_supply: INIT_SUPPLY",
        "recipient: OWNER",
      ]),
    };
  }

  function nileCustomized() {
    const calldata = [];

    if (props.erc20premint && props.erc20premint !== "0") {
      calldata.push(
        props.erc20upgradeable ? "admin.contract_address" : "OWNER"
      ); // Recipient
    }

    if (props.erc20mintable || props.erc20pausable) {
      calldata.push(
        props.erc20upgradeable ? "admin.contract_address" : "OWNER"
      ); // Owner
    }

    if (props.erc20upgradeable) {
      calldata.push("admin.contract_address"); // Proxy admin
    }

    return {
      testingVars: needsOwnerVariable(calldata)
        ? formatLines([
          "OWNER = 42",
          `NAME = str_to_felt("${props.erc20name}")`,
        ])
        : `NAME = str_to_felt("${props.erc20name}")`,
      constructorCalldata: formatArgs(calldata),
    };
  }

  function hardhatCustomized() {
    const calldata = [];

    if (props.erc20premint && props.erc20premint !== "0") {
      calldata.push(
        props.erc20upgradeable
          ? "recipient: accountAddress"
          : "recipient: OWNER"
      );
    }

    if (props.erc20mintable || props.erc20pausable) {
      calldata.push(
        props.erc20upgradeable ? "owner: accountAddress" : "owner: OWNER"
      );
    }

    if (props.erc20upgradeable) {
      calldata.push("proxy_admin: accountAddress");
    }

    return {
      testingVars: needsOwnerVariable(calldata)
        ? formatLines([
          "const OWNER = 42",
          `const NAME = starknet.shortStringToBigInt("${props.erc20name}")`,
        ])
        : `const NAME = starknet.shortStringToBigInt("${props.erc20name}")`,
      constructorCalldata: formatArgs(calldata),
    };
  }
}

function needsOwnerVariable(calldata) {
  return calldata.some((s) => s.includes("OWNER"));
}

module.exports = { getERC20ConstructorProps: getConstructorProps };
