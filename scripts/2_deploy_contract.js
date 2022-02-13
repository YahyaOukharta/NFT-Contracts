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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

