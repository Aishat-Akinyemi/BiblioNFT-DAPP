const hre = require("hardhat");

async function main() {
  const BiblioMarketPlace = await hre.ethers.getContractFactory("BiblioMarketPlace");
  const biblioMarketPlace = await BiblioMarketPlace.deploy();

  await biblioMarketPlace.deployed();

  console.log("BiblioMarketPlace deployed to:", biblioMarketPlace.address);
  storeContractData(biblioMarketPlace);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/BiblioMarketPlace-address.json",
    JSON.stringify({ BiblioMarketPlace: contract.address }, undefined, 2)
  );

  const BiblioMarketPlaceArtifact = artifacts.readArtifactSync("BiblioMarketPlace");

  fs.writeFileSync(
    contractsDir + "/BiblioMarketPlace.json",
    JSON.stringify(BiblioMarketPlaceArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });