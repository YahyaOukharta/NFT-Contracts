const { network } = require("hardhat");
const hre = require("hardhat");
const fetch = require("node-fetch")
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
  const signers = await ethers.getSigners(50);
    for (let i in signers){
        console.log("Account "+(signers[i].address)+" Balance:", (await signers[i].getBalance()).toString());
        console.log("----------")
    }
  if (!process.env.GO)
  {
    console.log("Add GO=1 before the command to continue the execution");
    process.exit()
  }
  for (let i in signers){
    // -> Get Contract:
    const NFTContractFactory = await hre.ethers.getContractFactory(process.env.COLLECTION_NAME, signers[i]); 
    let NFTContract = await NFTContractFactory.attach(deployed.address);
    console.log(process.env.COLLECTION_NAME, "contract deployed to:", NFTContract.address);
    console.log("----------")

    // -> Presale Mint
    const price = await NFTContract.PRE_SALES_PRICE(); 
    console.log("Presale Price = " + price / 1e18);

    let whitelistRequest = await fetch("http://localhost:3000/sig/"+signers[i].address);
    whitelistRequest = await whitelistRequest.json()
    if (!whitelistRequest.signedQty) continue;
    console.log(whitelistRequest)
    const mintQty = 1;
    const signedQty = whitelistRequest.signedQty
    const nonce = whitelistRequest.nonce
    const signature = whitelistRequest.signature
    await NFTContract.preSalesMint(mintQty, signedQty, nonce, signature,{value:price*mintQty});
    console.log("Minted "+mintQty+" "+process.env.COLLECTION_NAME+"s to:", signers[i].address);
    console.log("----------")
  }
}
// function preSalesMint(
//   uint256 _mintQty,
//   uint256 _signedQty,
//   uint256 _nonce,
//   bytes memory _signature
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
