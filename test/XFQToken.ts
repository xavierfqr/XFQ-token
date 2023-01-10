import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('XFQToken', function () {
  async function deployLydiaFixture() {
    const [owner, account1] = await ethers.getSigners();

    const XFQTokenFactory = await ethers.getContractFactory('XFQToken');
    const XFQToken = await XFQTokenFactory.deploy();

    return { XFQToken, owner, account1 };
  }

  it('should mint one token', async function () {
    const { XFQToken, owner } = await loadFixture(deployLydiaFixture);

    await XFQToken.mint(ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('0.02') });

    expect(await XFQToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('1'));
  });

  it('should revert transaction when there are no more token', async function () {
    const { XFQToken } = await loadFixture(deployLydiaFixture);

    await XFQToken.mint(ethers.utils.parseEther('150'), { value: ethers.utils.parseEther('3') });

    await expect(
      await XFQToken.mint(ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('0.02') })
    ).to.be.revertedWith('Max supply reached');
  });

  it.only('should withdraw ether', async function () {
    const { XFQToken, owner, account1 } = await loadFixture(deployLydiaFixture);
    const balanceBefore = await owner.getBalance();

    await XFQToken.connect(account1).mint(ethers.utils.parseEther('10'), { value: ethers.utils.parseEther('0.2') });

    await XFQToken.withdrawEther();

    await expect(await owner.getBalance()).to.be.gt(balanceBefore);
  });
});
