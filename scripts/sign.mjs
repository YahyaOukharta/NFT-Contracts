import { ethers } from 'ethers';
import dotenv from "dotenv";

dotenv.config();

if (!process.env.WHITELIST_SIGNER_PK) {
  console.log("Whitelist signer pk is required");
  process.exit(1);
}
const pk = process.env.WHITELIST_SIGNER_PK;

const signWhitelist = async (buyer, signedQty, nonce) => {
  const whitelistSigner =  new ethers.Wallet(pk);
  console.log("signer : " + whitelistSigner.address);
  console.log(" buyer : " + buyer);
  console.log("maxQty : " + signedQty);

  const signature = await whitelistSigner._signTypedData(
    {
      name: process.env.COLLECTION_NAME,
      version: '1',
      chainId: 31337,
      verifyingContract: process.env.CONTRACT_ADDRESS, //'0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    },
    {
      Whitelist: [
        { name: "buyer", type: "address" },
        { name: "signedQty", type: "uint256" },
        { name: "nonce", type: "uint256" },
      ],
    },
    {
      buyer,
      signedQty,
      nonce,
    }
  );
  return signature;
};

const main = async () => {
  
  const buyer = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const signedQty = 2;
  const nonce = 2;

  const sig = await signWhitelist(buyer, signedQty, nonce);
  console.log("   sig : " + sig);
};

main();
