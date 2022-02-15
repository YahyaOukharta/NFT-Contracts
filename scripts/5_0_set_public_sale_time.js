const { network } = require("hardhat");
const hre = require("hardhat");

const deployed = require("../deployed.json");

const dotenv = require("dotenv")
dotenv.config()

async function main() {

  await hre.run('compile');

  console.log("5_0 | Set Public sale Time");
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

  // -> Deploy Contract:
  const NFTContractFactory = await hre.ethers.getContractFactory(process.env.COLLECTION_NAME, deployer); 
  let NFTContract = await NFTContractFactory.attach(deployed.address);
  console.log(process.env.COLLECTION_NAME, "contract deployed to:", NFTContract.address);
  console.log("----------")

  // -> Set Public Sale Start !!!!!!
  const start = parseInt((new Date('2021.08.10').getTime() / 1000).toFixed(0))
  await NFTContract.setPublicSalesTime(start);
  console.log("publicSalesTime set to:", new Date(start*1000));
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

