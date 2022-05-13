const {
  printERC20,
  erc20defaults: defaults,
} = require("@openzeppelin/wizard-cairo");

const erc20prompts = [
  {
    type: "input",
    name: "erc20name",
    message: "Name",
    default: defaults.name,
  },
  {
    type: "input",
    name: "erc20symbol",
    message: "Symbol",
    default: defaults.symbol,
  },
  {
    type: "input",
    name: "erc20decimals",
    message: "Decimals",
    default: defaults.decimals,
  },
  {
    type: "input",
    name: "erc20premint",
    message: "Premint",
    default: defaults.premint,
  },
  {
    type: "confirm",
    name: "erc20mintable",
    message: "Mintable?",
    default: defaults.mintable,
  },
  {
    type: "confirm",
    name: "erc20burnable",
    message: "Burnable?",
    default: defaults.burnable,
  },
  {
    type: "confirm",
    name: "erc20pausable",
    message: "Pausable?",
    default: defaults.pausable,
  },
  {
    type: "confirm",
    name: "erc20upgradeable",
    message: "Upgradeable?",
    default: defaults.upgradeable,
  },
  {
    type: "input",
    name: "erc20license",
    message: "License",
    default: defaults.info.license,
  },
];

function erc20print(props) {
  return printERC20({
    name: props.erc20name,
    symbol: props.erc20symbol,
    decimals: props.erc20decimals,
    premint: props.erc20premint,
    mintable: props.erc20mintable,
    burnable: props.erc20burnable,
    pausable: props.erc20pausable,
    upgradeable: props.erc20upgradeable,
    info: {
      license: props.erc20license,
    },
  });
}

module.exports = { erc20prompts, erc20print };
