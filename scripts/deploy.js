const hre = require("hardhat");

async function main() {
  const BiblioNFT = await hre.ethers.getContractFactory("BiblioNFT");
  const biblioNFT = await BiblioNFT.deploy();

  await biblioNFT.deployed();

  console.log("BiblioNFT deployed to:", biblioNFT.address);
  storeContractData(biblioNFT);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/BiblioNFT-address.json",
    JSON.stringify({ BiblioNFT: contract.address }, undefined, 2)
  );

  const BiblioNFTArtifact = artifacts.readArtifactSync("BiblioNFT");

  fs.writeFileSync(
    contractsDir + "/BiblioNFT.json",
    JSON.stringify(BiblioNFTArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });