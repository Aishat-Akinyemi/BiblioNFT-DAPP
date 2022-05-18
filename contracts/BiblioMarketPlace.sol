// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
}

contract BiblioMarketPlace is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    //struct of a BiblioNFT item for sale
    struct BiblioNFTItem {
        uint256 tokenId;
        uint256 price;
        bool isListed; //indicates if item has been sold
        address payable seller; 
        address payable owner;               
    }

    //mappings of tokenId to listed biblioNFT;
    mapping (uint256 => BiblioNFTItem) public listings;
    uint public listingFee= 5_000_000_000_000_000_00; // 0.5 Celo
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _itemsSoldCount;
 
    address internal _cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    constructor ()  ERC721("BiblioNFT", "BBNFT") {}

    function getListingFee() public view returns (uint lfee){
        return listingFee;
    }

    /* Mints a token then list it in the marketplace */
    function mintAndListBiblioToken(string memory uri, uint256 price) public payable returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        list(tokenId, price);
        return tokenId;
    }

    /* lists a token in the marketplace, */
    function list (uint tokenId, uint price) private {
        require(price > 0, "Price must be greater than 0");
        require(
          IERC20Token(_cUsdTokenAddress).transferFrom(
            msg.sender,
            address(this),
            listingFee
          ),
          "Listing Fee Transfer failed."
        );
        listings[tokenId] = BiblioNFTItem(
          tokenId,
           price, 
            true, 
            payable(msg.sender), 
            payable(address(this))            
            );
        _transfer(msg.sender, address(this), tokenId); 

    }

    /*
    @dev relist NFT after purchase
    */
    function reListNFT(uint256 tokenId, uint256 price) public payable{
      address msg_sender = msg.sender;    
        require(msg_sender == listings[tokenId].owner, "THIS NFT DOES NOT BELONG TO YOU");
        require(price > 0, "Price must be greater than 0");
        require(
          IERC20Token(_cUsdTokenAddress).transferFrom(
            msg.sender,
            address(this),
            listingFee
          ),
          "Listing Fee Transfer failed."
        );
        listings[tokenId].isListed = true;
        listings[tokenId].price = price;
        listings[tokenId].owner = payable(address(this));
        listings[tokenId].seller = payable(msg.sender);
        _itemsSoldCount.decrement();
        _transfer(msg.sender, address(this), tokenId);
    }
    
    /*
    @dev buyListedNFT
    */
    function buy (uint tokenId) public payable { 
        uint price = listings[tokenId].price;
        address seller = listings[tokenId].seller;    
        require(listings[tokenId].isListed == true, "this Token is not listed for sale");
         require(
          //transfer sales price to seller
          IERC20Token(_cUsdTokenAddress).transferFrom(
            msg.sender,
            seller,
            price
          ),
            "Transfer failed."
        );
        listings[tokenId].owner = payable(msg.sender); //update the owner to buyer in listing
        listings[tokenId].isListed = false;
        listings[tokenId].seller = payable(address(0)); //not listed for sale by anyone
        _itemsSoldCount.increment();
        //transfer token to buyer
        _transfer(address(this), msg.sender, tokenId);        
        //transfer listing fee to owner of the marketplace from the marketplace account
        require(
          //transfer listing fee to the marketplace contract owner
          IERC20Token(_cUsdTokenAddress).transfer(
            owner(),
            listingFee),
            "Marketplace error : Purchase failed."
        );
      }
      
    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (BiblioNFTItem[] memory) {
      uint itemCount = _tokenIdCounter.current();
      uint unsoldItemCount = _tokenIdCounter.current() - _itemsSoldCount.current();
      uint currentIndex = 0;

      BiblioNFTItem[] memory items = new BiblioNFTItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (listings[i+1].owner == address(this)) {
          uint currentId = i + 1;
          BiblioNFTItem storage currentItem = listings[currentId];
          items[currentIndex] = currentItem;
          currentIndex ++;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (BiblioNFTItem[] memory) {

      
      uint totalItemCount = _tokenIdCounter.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (listings[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      BiblioNFTItem[] memory myitems = new BiblioNFTItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (listings[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          BiblioNFTItem storage currentItem = listings[currentId];
          myitems[currentIndex] = currentItem;
          currentIndex ++;
        }
      }
      return myitems;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (BiblioNFTItem[] memory) {
      uint totalItemCount = _tokenIdCounter.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (listings[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      BiblioNFTItem[] memory items = new BiblioNFTItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (listings[i+1].seller == msg.sender) {
           uint currentId = i + 1;
          BiblioNFTItem storage currentItem = listings[currentId];
          items[currentId] = currentItem;
          currentIndex ++;
        }
      }
      return items;
    }

    /**
    @dev change listing fee
    **/
    function updateListingFee(uint256 newListingFee) public  onlyOwner{
        listingFee = newListingFee;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}