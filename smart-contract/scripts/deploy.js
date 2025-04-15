const { ethers } = require("hardhat");
const { parseEther } = require("ethers");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const Token = await ethers.getContractFactory("MyToken");
  const initialSupply = parseEther("1000000");

  const token = await Token.deploy(initialSupply);
  await token.waitForDeployment(); // ✅ wait for it to be ready!

  console.log("✅ MyToken deployed to:", await token.getAddress()); // ✅ now it works!
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });