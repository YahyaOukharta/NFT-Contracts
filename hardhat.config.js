require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const mainnetGwei = 60;
module.exports = {
  
  networks: {
    localhost: {
      url: "http://localhost:8545",
      /*      
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      
      */
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //    url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXX/eth/rinkeby", // <---- YOUR MORALIS ID! (not limited to infura)
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    kovan: {
      url: "https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //    url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXX/eth/kovan", // <---- YOUR MORALIS ID! (not limited to infura)
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/mainnet", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: mainnetGwei * 1000000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/ropsten",// <---- YOUR MORALIS ID! (not limited to infura)
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/goerli", // <---- YOUR MORALIS ID! (not limited to infura)
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      gasPrice: 1000000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      gasPrice: 1000000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    testnetFantom: {
      url: "https://rpc.testnet.fantom.network",
      gasPrice: 1000000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    polygon: {
      url: "https://polygon-rpc.com",
      // url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXx/polygon/mainnet", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: 3200000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      // url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXX/polygon/mumbai", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: 3200000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      gasPrice: 1000000000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    rinkebyArbitrum: {
      url: "https://rinkeby.arbitrum.io/rpc",
      gasPrice: 0,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l1: "rinkeby",
      },
    },
    localArbitrum: {
      url: "http://localhost:8547",
      gasPrice: 0,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l1: "localArbitrumL1",
      },
    },
    localArbitrumL1: {
      url: "http://localhost:7545",
      gasPrice: 0,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l2: "localArbitrum",
      },
    },
    optimism: {
      url: "https://mainnet.optimism.io",
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l1: "mainnet",
      },
    },
    kovanOptimism: {
      url: "https://kovan.optimism.io",
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l1: "kovan",
      },
    },
    localOptimism: {
      url: "http://localhost:8545",
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l1: "localOptimismL1",
      },
    },
    localOptimismL1: {
      url: "http://localhost:9545",
      gasPrice: 0,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
      companionNetworks: {
        l2: "localOptimism",
      },
    },
    localAvalanche: {
      url: "http://localhost:9650/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43112,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    fujiAvalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    mainnetAvalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    testnetHarmony: {
      url: "https://api.s0.b.hmny.io",
      gasPrice: 1000000000,
      chainId: 1666700000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    mainnetHarmony: {
      url: "https://api.harmony.one",
      gasPrice: 1000000000,
      chainId: 1666600000,
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          remappings: [],
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "london",
          libraries: {},
        },
      },
    ],
  },};

