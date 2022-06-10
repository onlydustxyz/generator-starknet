const { NILE, HARDHAT, PROTOSTAR } = require("./constants");
const { formatArgs, formatLines } = require("./utils");

function getConstructorProps(props) {
  if (!props.customizeERC721) {
    return;
  }

  if (props.framework === NILE) {
    return nileCustomized(props);
  }

  if (props.framework === HARDHAT) {
    return hardhatCustomized(props);
  }

  if (props.framework === PROTOSTAR) {
    return protostarCustomized(props);
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

  function protostarCustomized(props) {
    const calldata = [];

    if (props.erc721mintable || props.erc721pausable) {
      calldata.push("ids.OWNER"); // Owner
    }

    if (props.erc721upgradeable) {
      calldata.push("ids.OWNER"); // Proxy admin
    }

    return {
      testingVars: needsOwnerVariable(calldata)
        ? formatLines([
            "const OWNER = 42",
            `const NAME = '${props.erc721name}'`,
          ])
        : `const NAME = '${props.erc721name}'`,
      constructorCalldata: formatArgs(calldata),
    };
  }
}

function needsOwnerVariable(calldata) {
  return calldata.some((s) => s.includes("OWNER"));
}

module.exports = { getERC721ConstructorProps: getConstructorProps };
