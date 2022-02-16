// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { network } = require("hardhat");
const hre = require("hardhat");

const deployed = require("../deployed.json");

const dotenv = require("dotenv")
dotenv.config()

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  await hre.run('compile');

  console.log("3 | MetadataURI and Opensea | Network : ", network.name);
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

  console.log("----------")
  console.log("Network :", network.name);
  console.log("----------")

  // -> Deploy Contract:
  const NFTContractFactory = await hre.ethers.getContractFactory(process.env.COLLECTION_NAME, deployer); 
  const NFTContract = await NFTContractFactory.attach(deployed.address)
  console.log(process.env.COLLECTION_NAME, "contract deployed to:", NFTContract.address);
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

  // -> set contractURI
    // set manually on opensea
  //

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

