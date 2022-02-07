import { ethers } from 'ethers'

const pk = "0x13dd9ab804448858d5efcd3e1706b1aedbc3e08f908a7afa0cdc337654b41d39";

const signWhitelist = async (buyer, signedQty, nonce) => {
  const whitelistSigner = new ethers.Wallet("0x13dd9ab804448858d5efcd3e1706b1aedbc3e08f908a7afa0cdc337654b41d39");
  console.log("wallet : " + whitelistSigner.address)

  const signature = await whitelistSigner._signTypedData(
    {
      name: 'Karafuru',
      version: '1',
      chainId: 31337,
      verifyingContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
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
}

const main = async () => {
  const buyer = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const signedQty = 2;
  const nonce = 2;

  const sig = await signWhitelist(buyer, signedQty, nonce);
  console.log("   sig : " + sig)
}

main()
