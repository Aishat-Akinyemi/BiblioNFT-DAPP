// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BiblioNFT.sol";

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract BiblioMarketPlace {
    struct Biblio {
        uint256 price;
        bool isListed;
        address payable owner;
    }

    //mappings of tokenId to price;
    mapping(uint256 => Biblio) public listings;
    uint256 public listingFee = 1_000_000_000_000_000_000; // 1 CELO
    uint256 public productCount;

    BiblioNFT biblioNFT;

    address internal cUsdTokenAddress;

    constructor(address _biblioNFTAddress, address _cUsdTokenAddress) {
        biblioNFT = BiblioNFT(_biblioNFTAddress);
        cUsdTokenAddress = _cUsdTokenAddress;
    }

    function list(uint256 _tokenId, uint256 _price) public payable {
        require(
            msg.value == listingFee,
            "Listing fee of exactly 1_000_000_000_000_000_000 is required"
        );
        require(
            msg.sender == biblioNFT.ownerOf(_tokenId),
            "THIS NFT DOES NOT BELONG TO YOU"
        );
        biblioNFT.transferFrom(msg.sender, address(this), _tokenId);
        listings[_tokenId] = Biblio(_price, true, payable(msg.sender));
        productCount++;
    }

    function buy(uint256 _tokenId) public payable returns (bool) {
        require(
            msg.sender != listings[_tokenId].owner,
            "THIS NFT BELONGs TO YOU"
        );
        require(
            listings[_tokenId].isListed == true,
            "this Token is not listed for sale"
        );
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                listings[_tokenId].owner,
                listings[_tokenId].price
            ),
            "Payment failed"
        );

        biblioNFT.transferFrom(address(this), msg.sender, _tokenId);
        listings[_tokenId].owner = payable(msg.sender);
        listings[_tokenId].isListed = false;

        return true;
    }

    function deList(uint256 _tokenId) public {
        require(
            msg.sender == listings[_tokenId].owner,
            "THIS NFT DOES NOT BELONG TO YOU"
        );
        biblioNFT.transferFrom(
            address(this),
            listings[_tokenId].owner,
            _tokenId
        );
        listings[_tokenId].isListed = false;
    }
}
