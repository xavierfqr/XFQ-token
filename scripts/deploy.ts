import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const XFQTokenFactory = await ethers.getContractFactory('XFQToken');
  const XFQToken = await XFQTokenFactory.deploy();
  await XFQToken.deployed();
  console.log('contract address:', XFQToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0xB2882a67239d60a51D9CcA01Eaaa51a468B970dD
