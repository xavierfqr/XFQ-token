import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();

  const XFQContractFactory = await ethers.getContractFactory('XFQToken');
  const XFQContract = await XFQContractFactory.deploy();

  await XFQContract.deployed();

  console.log('XFQContract deployed to:', XFQContract.address);
  console.log('Deployer address:', owner.address);
  console.log(await XFQContract.mint(5, { value: 10000000000000000 }));
  // console.log(await XFQContract.mint(150, { value: 150000000000000000000 }));

  console.log(await XFQContract.balanceOf(owner.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
