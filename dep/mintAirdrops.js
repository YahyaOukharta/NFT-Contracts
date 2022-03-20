const { network } = require("hardhat");
const hre = require("hardhat");

const deployed = require("../deployed.json");

const dotenv = require("dotenv")
dotenv.config()

async function main() {
  await hre.run('compile');

  console.log("3 | Set Public Time");
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

  // -> Mint for Airdrops !!!!!!
  const amount = await NFTContract.AIRDROP_MINT_MAX_QTY(); 
  console.log("AIRDROP_MINT_MAX_QTY = " + amount);
  await NFTContract.mintAirdrop(amount);
  console.log("Minted "+amount+" "+process.env.COLLECTION_NAME+"s to:", deployer.address);
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
