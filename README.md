# NFT-Contracts

## 1 - Set .env

- `CHAIN_ID`: 4 for rinkeby, 1 for mainnet, 11337 for hardhat
- `COLLECTION_NAME`: Same as contract name
- `WHITELIST_SIGNER` keys (required for whitelist)

## 2 - Run scripts in order

```
    npx hardhat run --network scripts/1_upload_metadata.js

    npx hardhat run --network rinkeby scripts/2_deploy_contract.js

    npx hardhat run --network rinkeby scripts/3_metadata_opensea.js

    npx hardhat run --network rinkeby scripts/4_0_set_presale_time.js
    npx hardhat run --network rinkeby scripts/4_1_sign_whitelist.js

    npx hardhat run --network rinkeby scripts/5_0_set_public_sale_time.js
    npx hardhat run --network rinkeby scripts/5_1_reveal.js

    npx hardhat run --network rinkeby scripts/6_withdraw.js
```

## 3 - Todo 

- Reveal 
- Public Sale
- Fix timestamp
- Withdraw to shareholders

