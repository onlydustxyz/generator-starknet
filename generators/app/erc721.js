const {
  printERC721,
  erc721defaults: defaults,
} = require("@openzeppelin/wizard-cairo");

const erc721prompts = [
  {
    type: "input",
    name: "erc721name",
    message: "Name",
    default: defaults.name,
  },
  {
    type: "input",
    name: "erc721symbol",
    message: "Symbol",
    default: defaults.symbol,
  },
  {
    type: "confirm",
    name: "erc721mintable",
    message: "Mintable?",
    default: defaults.mintable,
  },
  {
    type: "confirm",
    name: "erc721burnable",
    message: "Burnable?",
    default: defaults.burnable,
  },
  {
    type: "confirm",
    name: "erc721pausable",
    message: "Pausable?",
    default: defaults.pausable,
  },
  {
    type: "confirm",
    name: "erc721upgradeable",
    message: "Upgradeable?",
    default: defaults.upgradeable,
  },
  {
    type: "input",
    name: "erc721license",
    message: "License",
    default: defaults.info.license,
  },
];

function erc721print(props) {
  return printERC721({
    name: props.erc721name,
    symbol: props.erc721symbol,
    mintable: props.erc721mintable,
    burnable: props.erc721burnable,
    pausable: props.erc721pausable,
    upgradeable: props.erc721upgradeable,
    info: {
      license: props.erc721license,
    },
  });
}

module.exports = { erc721prompts, erc721print };
