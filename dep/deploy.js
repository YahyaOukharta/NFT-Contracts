const { network } = require("hardhat");
const hre = require("hardhat");
const deployed = require("../deployed.json");
const dotenv = require("dotenv")
dotenv.config()

async function main() {
  await hre.run('compile');

  console.log("1 | Deploy contract for collection "+process.env.COLLECTION_NAME);
  console.log("----------")
  console.log("Network :", network.name);
  console.log("----------")

  // -> Get Signer
  const [deployer] = await ethers.getSigners();
  console.log("Account "+(deployer.address)+" balance:", (await deployer.getBalance()).toString());
  console.log("----------")

  if (!process.env.GO)
  {
    console.log("Add GO=1 before the command to continue the deployment");
    process.exit()
  }

  // -> Deploy Contract:
  const NFTContractFactory = await hre.ethers.getContractFactory(process.env.COLLECTION_NAME, deployer); 
  const NFTContract = await NFTContractFactory.deploy();
  await NFTContract.deployed();

  const fs = require('fs');
  fs.writeFileSync('deployed.json', JSON.stringify({...deployed, address:NFTContract.address},null,2))
  
  console.log(process.env.COLLECTION_NAME, "contract deployed to:", NFTContract.address, " saved to ./deployed.json");
  console.log("----------")

  // -> Set Proxy Registry Address for OpenSea:
  // rinkeby: 0xf57b2c51ded3a29e6891aba85459d600256cf317
  // mainnet: 0xa5409ec958c83c3f309868babaca7c86dcb077c1
  const rinkebyProxy = "0xf57b2c51ded3a29e6891aba85459d600256cf317" // <-
  const mainnetProxy = "0xa5409ec958c83c3f309868babaca7c86dcb077c1" // <-

  const proxyRegistyAddress = 
    network.name === "rinkeby"?
     rinkebyProxy :
     mainnetProxy;

  await NFTContract.setProxyRegistryAddress(
    proxyRegistyAddress
  );
  if (proxyRegistyAddress == rinkebyProxy)
    console.log("Proxy Registry Address set to: rinkeby", proxyRegistyAddress);
  if (proxyRegistyAddress == mainnetProxy)
    console.log("Proxy Registry Address set to: mainnet", proxyRegistyAddress);
  console.log("----------")

  // -> Set tokenURI base
  let uri = "ipfs://"+deployed.ipfsMetadata+"/";
  await NFTContract.setBaseURI(uri);
  console.log("Base URI set to:", uri);
  console.log("----------")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

