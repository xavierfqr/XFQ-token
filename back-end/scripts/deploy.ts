import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY as string;
  const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_NODE_URL);

  const wallet = new ethers.Wallet(privateKey, provider);

  const XFQTokenFactory = await ethers.getContractFactory('XFQToken', wallet);
  const XFQToken = await XFQTokenFactory.deploy();
  console.log('contract address:', XFQToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0xdfeB24fBA4382DaEb83E34937cAa0E95b9fBD106
