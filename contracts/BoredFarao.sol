// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "./access/Ownable.sol";
import "./PreSalesActivation.sol";
import "./PublicSalesActivation.sol";
import "./Whitelist.sol";
import "./ERC721Opensea.sol";
import "./Withdrawable.sol";

contract BoredFarao is
    Ownable,
    ERC721A,
    EIP712,
    PreSalesActivation,
    PublicSalesActivation,
    Whitelist,
    Withdrawable
{
    uint256 public constant TOTAL_MAX_QTY = 4888;
    uint256 public constant AIRDROP_MINT_MAX_QTY = 88;
    uint256 public constant PRESALES_MAX_QTY = 4888; //
    uint256 public constant SALES_MAX_QTY = TOTAL_MAX_QTY - AIRDROP_MINT_MAX_QTY; // 4800
    uint256 public constant MAX_QTY_PER_MINTER = 5;
    uint256 public constant PRE_SALES_PRICE = 0.0002 ether;
    uint256 public constant PUBLIC_SALES_START_PRICE = 0.0002 ether;

    mapping(address => uint256) public preSalesMinterToTokenQty;
    mapping(address => uint256) public publicSalesMinterToTokenQty;

    uint256 public preSalesMintedQty = 0;
    uint256 public publicSalesMintedQty = 0;
    uint256 public mintedForAirdropQty = 0;

    address proxyRegistryAddress;
    string private _tokenBaseURI;

    constructor() ERC721A("Bored Farao", "BOREDFARAO") Whitelist("BoredFarao", "1") {}

    function getPrice() public view returns (uint256) {
        // Public sales
        if (isPublicSalesActivated()) {
            return PUBLIC_SALES_START_PRICE;
        }
        return PRE_SALES_PRICE;
    }

    function preSalesMint(
        uint256 _mintQty,
        uint256 _signedQty,
        uint256 _nonce,
        bytes memory _signature
    )
        external
        payable
        isPreSalesActive
        isSenderWhitelisted(_signedQty, _nonce, _signature)
    {
        require(
            preSalesMintedQty + publicSalesMintedQty + _mintQty <=
                SALES_MAX_QTY,
            "Exceed sales max limit"
        );
        require(
            preSalesMintedQty + _mintQty <= PRESALES_MAX_QTY,
            "Exceed pre-sales max limit"
        );
        require(
            preSalesMinterToTokenQty[msg.sender] + _mintQty <= _signedQty,
            "Exceed signed quantity"
        );
        require(msg.value >= _mintQty * getPrice(), "Insufficient ETH");
        require(tx.origin == msg.sender, "Contracts not allowed");

        preSalesMinterToTokenQty[msg.sender] += _mintQty;
        preSalesMintedQty += _mintQty;

        // for (uint256 i = 0; i < _mintQty; i++) {
        //     _safeMint(msg.sender, totalSupply() + 1);
        // }
        _safeMint(msg.sender, _mintQty);
    }

    function publicSalesMint(uint256 _mintQty)
        external
        payable
        isPublicSalesActive
    {
        require(
            preSalesMintedQty + publicSalesMintedQty + _mintQty <=
                SALES_MAX_QTY,
            "Exceed sales max limit"
        );
        require(
            publicSalesMinterToTokenQty[msg.sender] + _mintQty <=
                MAX_QTY_PER_MINTER,
            "Exceed max mint per minter"
        );
        require(msg.value >= _mintQty * getPrice(), "Insufficient ETH");
        require(tx.origin == msg.sender, "Contracts not allowed");

        publicSalesMinterToTokenQty[msg.sender] += _mintQty;
        publicSalesMintedQty += _mintQty;

         _safeMint(msg.sender, _mintQty);

    }

    function mintAirdrop(uint256 amount) external onlyOwner {
        require(
            mintedForAirdropQty + amount <= AIRDROP_MINT_MAX_QTY,
            "Exceed gift max limit"
        );

        mintedForAirdropQty += amount;
        _safeMint(msg.sender, amount);
    }
    
    // https://github.com/ProjectOpenSea/opensea-creatures/blob/74e24b99471380d148057d5c93115dfaf9a1fa9e/migrations/2_deploy_contracts.js#L29
    // rinkeby: 0xf57b2c51ded3a29e6891aba85459d600256cf317
    // mainnet: 0xa5409ec958c83c3f309868babaca7c86dcb077c1
    function setProxyRegistryAddress(address proxyAddress) external onlyOwner {
        proxyRegistryAddress = proxyAddress;
    }

    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator)
        public
        view
        override
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }
    function setBaseURI(string calldata URI) external onlyOwner {
        _tokenBaseURI = URI;
    }

    // To support Opensea token metadata
    // https://docs.opensea.io/docs/metadata-standards
    function _baseURI()
        internal
        view
        override(ERC721A)
        returns (string memory)
    {
        return _tokenBaseURI;
    }
}