const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BiblioMarketPlace", function () {
  this.timeout(50000); // line 5

  let BiblioNFT;
  let BiblioMarketPlace;
  let owner;
  let acc1;
  let acc2;

  /**Test helpers start */

  const ERC20_DECIMALS = 18;

  // shift numbers to retain equivalent dollar value in CUSD tokens
  // e.g $100 == 100 ** 1e18 CUSD tokens
  const parse = (amount) =>
    ethers.utils.parseUnits(amount.toString(), ERC20_DECIMALS);

  const newToken = async (
    sender,
    receiver,
    tokenURI = "https://example.com/1"
  ) => {
    const tx = await biblioNFT.connect(sender).safeMint(receiver, tokenURI);
    return tx.wait();
  };

  const listToken = async (lister, tokenId, price) => {
    const tx2 = await biblioNFT
      .connect(lister)
      .approve(biblioMarketPlace.address, tokenId);
    await tx2.wait();

    const tx3 = await biblioMarketPlace.connect(acc1).list(tokenId, price, {
      value: parse(1),
    });

    return tx3.wait();
  };

  const buyToken = async (buyer, tokenId, price) => {
    const tx = await cUSD
      .connect(buyer)
      .approve(biblioMarketPlace.address, price);
    await tx.wait();

    return biblioMarketPlace.connect(buyer).buy(tokenId);
  };

  /**Test helpers end */

  this.beforeEach(async function () {
    [owner, acc1, acc2] = await ethers.getSigners();

    BiblioNFT = await ethers.getContractFactory("BiblioNFT");
    BiblioMarketPlace = await ethers.getContractFactory("BiblioMarketPlace");
    CUSD = await ethers.getContractFactory("CUSD");

    biblioNFT = await BiblioNFT.deploy();
    cUSD = await CUSD.deploy();
    biblioMarketPlace = await BiblioMarketPlace.deploy(
      biblioNFT.address,
      cUSD.address
    );

    const initialCUSDBalance = parse(1_000);
    // give signers test cUSD
    await Promise.all([
      cUSD.credit(owner.address, initialCUSDBalance),
      cUSD.credit(acc1.address, initialCUSDBalance),
      cUSD.credit(acc2.address, initialCUSDBalance),
    ]);
  });

  describe("list", () => {
    it("should transfer a listed token to the marketplace", async () => {
      const tokenURI = "https://example.com/1";
      const tokenId = 0;
      const listingPrice = parse(100);

      await newToken(owner, acc1.address, tokenURI);
      await listToken(acc1, tokenId, listingPrice);

      expect(await biblioNFT.balanceOf(acc1.address)).to.equal(0);
      expect(await biblioNFT.balanceOf(biblioMarketPlace.address)).to.equal(1);
    });

    it("should add a listed token to the marketplace", async () => {
      const tokenURI = "https://example.com/1";
      const tokenId = 0;
      const listingPrice = parse(100);

      await newToken(owner, acc1.address, tokenURI);
      await listToken(acc1, tokenId, listingPrice);

      const listing = await biblioMarketPlace.connect(acc1).listings(tokenId);
      expect(listing.price).to.eq(listingPrice);
    });
  });

  describe("buy", () => {
    it("should transfer token to buyer", async () => {
      const tokenURI = "https://example.com/1";
      const tokenId = 0;
      const listingPrice = parse(100);

      await newToken(owner, acc1.address, tokenURI);
      await listToken(acc1, tokenId, listingPrice);

      await buyToken(acc2, tokenId, listingPrice);

      expect(await biblioNFT.ownerOf(tokenId)).to.equal(acc2.address);
    });

    it("should transfer CUSD to former token owner", async () => {
      const tokenURI = "https://example.com/1";
      const tokenId = 0;
      const listingPrice = parse(100);
      const initialBalance = parse(1_000);

      await newToken(owner, acc1.address, tokenURI);
      await listToken(acc1, tokenId, listingPrice);

      await buyToken(acc2, tokenId, listingPrice);

      expect(await cUSD.balanceOf(acc1.address)).to.equal(
        initialBalance.add(listingPrice)
      );
    });
  });

  describe("deList", () => {
    it("should transfer token back to owner", async () => {
      const tokenURI = "https://example.com/1";
      const tokenId = 0;
      const listingPrice = parse(100);

      await newToken(owner, acc1.address, tokenURI);
      await listToken(acc1, tokenId, listingPrice);

      expect(await biblioNFT.ownerOf(tokenId)).to.not.equal(acc1.address);

      const tx = await biblioMarketPlace.connect(acc1).deList(tokenId);
      await tx.wait();

      expect(await biblioNFT.ownerOf(tokenId)).to.be.equal(acc1.address);
    });
  });
});
