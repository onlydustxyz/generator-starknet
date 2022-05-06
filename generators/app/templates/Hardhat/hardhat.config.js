require("@shardlabs/starknet-hardhat-plugin");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  starknet: {
    network: "develop"
  },
  networks: {
    develop: {
      url: "http://127.0.0.1:5050"
    }
  },
  cairo: {
    version: "0.6.2"
  },
  paths: {
    // Where are our contracts: ./contracts
    starknetSources: __dirname + "/src",
    // Where are our artifacts (build contract): ./stark-artifacts, not use repository "artifacts" which is reserved by hardhat to solidity
    starknetArtifacts: __dirname + "/stark-artifacts",
  },
  mocha: {
    starknetNetwork: "develop"
  }
};

