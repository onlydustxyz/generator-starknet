const { NILE, HARDHAT, PROTOSTAR } = require("./constants");
const { formatArgs, formatLines } = require("./utils");
const { erc20, utils } = require("@openzeppelin/wizard-cairo");

function getConstructorProps(props) {
  if (!props.customizeERC20) {
    return;
  }

  if (props.framework === NILE) {
    return nileCustomized();
  }

  if (props.framework === HARDHAT) {
    return hardhatCustomized();
  }

  if (props.framework === PROTOSTAR) {
    return protostarCustomized();
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

    const vars = [];
    if (needsVariable(calldata, "OWNER")) {
      vars.push("OWNER = 42");
    }

    const initialSupply = erc20.getInitialSupply(
      props.erc20premint,
      props.erc20decimals
    );
    vars.push("SPENDER = 9");
    vars.push(`NAME = str_to_felt("${props.erc20name}")`);
    vars.push(`SYMBOL = str_to_felt("${props.erc20symbol}")`);
    vars.push(`INIT_SUPPLY = to_uint(${initialSupply})`);
    vars.push(`DECIMALS = ${props.erc20decimals}`);

    return {
      testingVars: formatLines(vars),
      constructorCalldata: formatArgs(calldata),
      hasOwner: needsVariable(calldata, "OWNER"),
      erc20InitialSupply: initialSupply,
    };
  }

  function hardhatCustomized() {
    const calldata = [];

    if (props.erc20premint && props.erc20premint !== "0") {
      calldata.push("recipient: owner");
    }

    if (props.erc20mintable || props.erc20pausable) {
      calldata.push("owner: owner");
    }

    if (props.erc20upgradeable) {
      calldata.push("proxy_admin: owner");
    }

    const initialSupply = erc20.getInitialSupply(
      props.erc20premint,
      props.erc20decimals
    );
    const initialSupplyUint256 = utils.toUint256(initialSupply);
    const vars = [];
    vars.push(`const SPENDER = 9`);
    vars.push(
      `const NAME = starknet.shortStringToBigInt("${props.erc20name}")`
    );
    vars.push(
      `const SYMBOL = starknet.shortStringToBigInt("${props.erc20symbol}")`
    );
    vars.push(
      `const INIT_SUPPLY = { low: ${initialSupplyUint256.lowBits}n, high: ${initialSupplyUint256.highBits}n }`
    );
    vars.push(`const DECIMALS = ${props.erc20decimals}n`);

    return {
      testingVars: formatLines(vars),
      constructorCalldata: formatArgs(calldata),
      hasOwner: needsVariable(calldata, "owner"),
      erc20InitialSupply: initialSupply,
    };
  }

  function protostarCustomized() {
    const calldata = [];

    if (props.erc20premint && props.erc20premint !== "0") {
      calldata.push("ids.OWNER"); // Recipient
    }

    if (props.erc20mintable || props.erc20pausable) {
      calldata.push("ids.OWNER"); // Owner
    }

    if (props.erc20upgradeable) {
      calldata.push("ids.OWNER"); // Proxy admin
    }

    const initialSupply = erc20.getInitialSupply(
      props.erc20premint,
      props.erc20decimals
    );
    const initialSupplyUint256 = utils.toUint256(initialSupply);
    const vars = [];
    if (needsVariable(calldata, "OWNER")) {
      vars.push("const OWNER = 42");
    }

    vars.push(`const SPENDER = 9`);
    vars.push(`const NAME = '${props.erc20name}'`);
    vars.push(`const SYMBOL = '${props.erc20symbol}'`);
    vars.push(`const INIT_SUPPLY_LOW = ${initialSupplyUint256.lowBits}`);
    vars.push(`const INIT_SUPPLY_HIGH = ${initialSupplyUint256.highBits}`);
    vars.push(`const DECIMALS = ${props.erc20decimals}`);

    return {
      testingVars: formatLines(vars),
      constructorCalldata: formatArgs(calldata),
      hasOwner: needsVariable(calldata, "OWNER"),
      erc20InitialSupplyLowBits: initialSupplyUint256.lowBits,
      erc20InitialSupplyHighBits: initialSupplyUint256.highBits,
    };
  }
}

function needsVariable(calldata, variable) {
  return calldata.some((s) => s.includes(variable));
}

module.exports = { getERC20ConstructorProps: getConstructorProps };
