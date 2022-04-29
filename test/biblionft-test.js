const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BiblioNFT", function () {
    this.timeout(50000); // line 5
  
    let BiblioNFT;
    let owner;
    let acc1;
    let acc2;
  
    this.beforeEach(async function() { // line 12
        const BiblioNFT = await ethers.getContractFactory("BiblioNFT");
        [owner, acc1, acc2] = await ethers.getSigners();
        biblioNFT = await BiblioNFT.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await biblioNFT.owner()).to.equal(owner.address);
      });

      it("Should mint one NFT", async function() {
        expect(await biblioNFT.balanceOf(acc1.address)).to.equal(0);
        
        const tokenURI = "https://example.com/1" // line 28
        const tx = await biblioNFT.connect(owner).safeMint(acc1.address, tokenURI);
        await tx.wait(); // line 30
    
        expect(await biblioNFT.balanceOf(acc1.address)).to.equal(1);
      })

      it("Should set the correct tokenURI", async function() {
        const tokenURI_1 = "https://example.com/1"
        const tokenURI_2 = "https://example.com/2"
    
        const tx1 = await biblioNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
        await tx1.wait();
        const tx2 = await biblioNFT.connect(owner).safeMint(acc2.address, tokenURI_2);
        await tx2.wait();
    
        expect(await biblioNFT.tokenURI(0)).to.equal(tokenURI_1);
        expect(await biblioNFT.tokenURI(1)).to.equal(tokenURI_2);
      })


});