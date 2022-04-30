// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BiblioNFT.sol";
interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}



contract BiblioMarketPlace {
    struct Biblio {
        uint price;
        bool isListed;
        address payable owner;
    }

    //mappings of tokenId to price;
    mapping (uint => Biblio) public listings;
    uint public listingFee= 1_000_000_000_000_000_000; //1000000000000000000
    uint public productCount;
    BiblioNFT biblioNFT;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    

    constructor(address _biblioNFTAddress){
        biblioNFT = BiblioNFT(_biblioNFTAddress);
    }

    function getListingFee() public view returns (uint lfee){
        return listingFee;
    }

    function list (uint _tokenId, uint _price) public payable {
        require(msg.value == listingFee, "Listing fee of exactly 1_000_000_000_000_000_000 is required");
        require(msg.sender == biblioNFT.ownerOf(_tokenId), "THIS NFT DOES NOT BELONG TO YOU");
        biblioNFT.transferFrom(msg.sender, address(this), _tokenId);
        listings[_tokenId] = Biblio(_price, true, payable(msg.sender));
        productCount++;       
    }
    
    function buy (uint _tokenId) public payable returns (bool){
        require(msg.sender != listings[_tokenId].owner, "THIS NFT BELONGs TO YOU");
        require(msg.value == listings[_tokenId].price ,"ATTACH EXACT PRICE" );
        require(listings[_tokenId].isListed ==true, "this Token is not listed for sale");
        biblioNFT.transferFrom(address(this), msg.sender, _tokenId);
        listings[_tokenId].owner = payable(msg.sender);
        listings[_tokenId].isListed = false;
        IERC20Token(cUsdTokenAddress).transferFrom(
			address(this),
			listings[_tokenId].owner,
			listings[_tokenId].price
		  );
          return true;
    }

      function deList (uint _tokenId) public {        
       require(msg.sender == listings[_tokenId].owner, "THIS NFT DOES NOT BELONG TO YOU");
        biblioNFT.transferFrom(address(this),  listings[_tokenId].owner, _tokenId); 
        listings[_tokenId].isListed = false;      
    }
}