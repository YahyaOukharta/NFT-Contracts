// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { network } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  await hre.run('compile');

  // We get the contract to deploy

  // -> Deploy Contract:
  const NFTContractFactory = await hre.ethers.getContractFactory("Karafuru");
  const Karafuru = await NFTContractFactory.deploy();
  await Karafuru.deployed();
  console.log("Contract deployed to:", Karafuru.address);

  // -> Set Whitelist signer address:
  const whitelistSigner = "0x3188E8d7962f1aC9000fC236974Ff9832BE8fF06";
  await Karafuru.setWhitelistSigner(
    whitelistSigner
  );
  console.log("Whitelist Signer set to:", whitelistSigner);

  // -> Set Proxy Registry Address for OpenSea:
  // rinkeby: 0xf57b2c51ded3a29e6891aba85459d600256cf317
  // mainnet: 0xa5409ec958c83c3f309868babaca7c86dcb077c1
  const rinkebyProxy = "0xf57b2c51ded3a29e6891aba85459d600256cf317" // <-
  const mainnetProxy = "0xa5409ec958c83c3f309868babaca7c86dcb077c1" // <-
  const proxyRegistyAddress = mainnetProxy; // <- Edit Here
  await Karafuru.setWhitelistSigner(
    proxyRegistyAddress
  );
  if (proxyRegistyAddress == rinkebyProxy)
    console.log("Proxy Registry Address set to: rinkeby", proxyRegistyAddress);
  if (proxyRegistyAddress == mainnetProxy)
    console.log("Proxy Registry Address set to: mainnet", proxyRegistyAddress);

  // -> Set Presale Start and End
  const start = parseInt((new Date().getTime() / 1000).toFixed(0));
  const end = start + 5000000000000;
  await Karafuru.setPreSalesTime(start, end);
  console.log("PreSalesTime set to:", new Date(start), new Date(end));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
