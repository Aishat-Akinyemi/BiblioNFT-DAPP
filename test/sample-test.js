const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BiblioMarketPlace", function () {
    this.timeout(50000); // line 5
  
    let BiblioMarketPlace;
    let owner;
    let acc1;
    let acc2;
  
    this.beforeEach(async function() { // line 12
        const BiblioMarketPlace = await ethers.getContractFactory("BiblioMarketPlace");
        [owner, acc1, acc2] = await ethers.getSigners();
        biblioMarketPlace = await BiblioMarketPlace.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await biblioMarketPlace.owner()).to.equal(owner.address);
      });

      // it("Should mint one NFT and list it in the marketplace", async function() {
      //   expect(await biblioMarketPlace.balanceOf(acc1.address)).to.equal(0);
        
      //   const tokenURI = "https://example.com/1" // line 28
      //   const salesPrice = ethers.utils.parseUnits("1", "ether");
      //   const tx1 = await biblioMarketPlace.mintAndListBiblioToken(tokenURI, salesPrice);
      //   await tx1.wait();

      //   const myListedTokens = await biblioMarketPlace.fetchMarketItems();
      //   items = await Promise.all(items.map( async i => {
      //       console.log(i);
      //   }))
      // })

      // it("Should set the correct tokenURI", async function() {
      //   const tokenURI_1 = "https://example.com/1"
      //   const tokenURI_2 = "https://example.com/2"
    
      //   const tx1 = await biblioMarketPlace.connect(owner).mintAndListBiblioToken(tokenURI_1, 1);
      //   await tx1.wait();
      //   const tx2 = await biblioMarketPlace.connect(owner).mintAndListBiblioToken(tokenURI_2, 1);
      //   await tx2.wait();
    
      //   expect(await biblioMarketPlace.tokenURI(0)).to.equal(tokenURI_1);
      //   expect(await biblioMarketPlace.tokenURI(1)).to.equal(tokenURI_2);
      // })
      // it("Should sell NFT", async function() {
      //   const tokenURI_1 = "https://example.com/1";
      //   let listingPrice = await biblioMarketPlace.getListingFee();
      //   listingPrice = listingPrice.toString();
      //   const salesPrice = ethers.utils.parseUnits("1", "ether");
      //   const tx1 = await biblioMarketPlace.mintAndListBiblioToken(tokenURI_1, salesPrice);
      //   await tx1.wait();
      //   const tx2 = await biblioMarketPlace.mintAndListBiblioToken(tokenURI_2, salesPrice);
      //   await tx2.wait();



      //   const tx3 = await biblioMarketPlace.connect(acc1).buy(0, salesPrice);
      //   await tx1.wait();

      //   const tx4 = await biblioMarketPlace.connect(acc1).relist(0, salesPrice)
        
    
      //   expect(await biblioMarketPlace.connect(acc1).fetchMyNFTs().length).to.equal(1);

      //   items = await nftMarketplace.fetchMarketItems()
      //   items = await Promise.all(items.map(async i => {
      //     const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      //     let item = {
      //       price: i.price.toString(),
      //       tokenId: i.tokenId.toString(),
      //       seller: i.seller,
      //       owner: i.owner,
      //       tokenUri
      //     }
      //     return item
      //   }))
      //   console.log('items: ', items)
      // })
      


});