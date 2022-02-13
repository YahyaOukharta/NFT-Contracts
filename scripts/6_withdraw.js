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

  console.log("6 | Withdraw all");
  console.log("----------")
  console.log("Network :", network.name);
  console.log("----------")

  // -> Get Signer
  const [deployer] = await ethers.getSigners();
  console.log("Account "+(deployer.address)+" Balance:", (await deployer.getBalance()).toString());
  console.log("----------")

  if (!process.env.GO)
  {
    console.log("Add GO=1 before the command to continue the execution");
    process.exit()
  }

  // -> Contract:
  const NFTContractFactory = await hre.ethers.getContractFactory(process.env.COLLECTION_NAME, deployer); 
  let NFTContract = await NFTContractFactory.attach(deployed.address);
  console.log(process.env.COLLECTION_NAME, "contract deployed to:", NFTContract.address);
  console.log("----------")

  // -> withdraw:
  await NFTContract.withdrawAll();
  console.log("Whitedrew contract balance to : owner");
  console.log("----------")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

