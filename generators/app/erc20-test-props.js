const { NILE, HARDHAT, PROTOSTAR } = require("./constants");
const { formatArgs, formatLines } = require("./utils");
const { erc20 } = require("@openzeppelin/wizard-cairo");

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
    if (needsOwnerVariable(calldata)) {
      vars.push("OWNER = 42");
    }

    vars.push("SPENDER = 9");
    vars.push(`NAME = str_to_felt("${props.erc20name}")`);
    vars.push(`SYMBOL = str_to_felt("${props.erc20symbol}")`);
    vars.push(
      `INIT_SUPPLY = to_uint(${erc20.getInitialSupply(
        props.erc20premint,
        props.erc20decimals
      )})`
    );
    vars.push(`DECIMALS = ${props.erc20decimals}`);

    return {
      testingVars: formatLines(vars),
      constructorCalldata: formatArgs(calldata),
      hasOwner: needsOwnerVariable(calldata),
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

  function protostarCustomized() {
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
        ? formatLines(["const OWNER = 42", `const NAME = '${props.erc20name}'`])
        : `const NAME = '${props.erc20name}'`,
      constructorCalldata: formatArgs(calldata),
    };
  }
}

function needsOwnerVariable(calldata) {
  return calldata.some((s) => s.includes("OWNER"));
}

module.exports = { getERC20ConstructorProps: getConstructorProps };
