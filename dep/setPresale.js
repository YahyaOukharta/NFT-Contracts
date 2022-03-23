const { network } = require("hardhat");
const hre = require("hardhat");

const deployed = require("../deployed.json");

const dotenv = require("dotenv")
dotenv.config()

async function main() {
  await hre.run('compile');

  console.log("2 | Set Presale Time");
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

  // -> Get Contract:
  const NFTContractFactory = await hre.ethers.getContractFactory(process.env.COLLECTION_NAME, deployer); 
  let NFTContract = await NFTContractFactory.attach(deployed.address);
  console.log(process.env.COLLECTION_NAME, "contract deployed to:", NFTContract.address);
  console.log("----------")

  // -> Set Whitelist signer address:
  const whitelistSigner = process.env.WHITELIST_SIGNER;
  await NFTContract.setWhitelistSigner(
    whitelistSigner
  );
  console.log("Whitelist Signer set to:", whitelistSigner);
  console.log("----------")

  // -> Set Presale Start and End !!!!!! https://epochconverter.com
  // const start = 1648598400; // Thursday 30 March 2022 00:00:00
  // const end =   1648684800; // Thursday 31 March 2022 00:00:00
  const start = 1647990036
  const end = 1647995536
  await NFTContract.setPreSalesTime(start, end);
  console.log("PreSalesTime set to:", new Date(start*1000), new Date(end*1000));
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
