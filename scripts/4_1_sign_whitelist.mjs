import { ethers } from 'ethers';
import dotenv from "dotenv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const deployed = require("../deployed.json");

dotenv.config();
if (!process.env.WHITELIST_SIGNER_PK) {
  console.log("Whitelist signer pk is required");
  process.exit(1);
}
const pk = process.env.WHITELIST_SIGNER_PK;

const signWhitelist = async (buyer, signedQty, nonce) =>
{
  const whitelistSigner =  new ethers.Wallet(pk);
  console.log("signer : " + whitelistSigner.address);
  console.log(" buyer : " + buyer);
  console.log(" nonce : " + nonce);
  console.log("maxQty : " + signedQty);

  const signature = await whitelistSigner._signTypedData(
    {
      name: process.env.COLLECTION_NAME,
      version: '1',
      chainId: process.env.CHAIN_ID,
      verifyingContract: deployed.address,
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
  
  const buyer = "0x584d43E09681c19321Ea94a28Bd5Ded8822f76b3";
  const signedQty = 3500;
  const nonce = 1;

  const sig = await signWhitelist(buyer, signedQty, nonce);
  console.log("   sig : " + sig);
};

main();
