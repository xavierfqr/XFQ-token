// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XFQToken is ERC20Burnable, Ownable {
    
    uint public tokenPrice;
    uint public maxSupply;

    constructor() ERC20("XFQToken", "XFQ") {
        tokenPrice = 2 * 10 ** 16 wei;
        maxSupply = 150 * 10 ** 18;
    }

    function mint(uint amount) public payable {
        require(totalSupply() + amount <= maxSupply, "Max supply reached");
        require(msg.value == amount / 10 ** 18 * tokenPrice, "Incorrect amount of ETH sent");

        _mint(msg.sender, amount);
    }

    function withdrawEther() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function returnState() public view returns(uint _myBalance, uint _maxSupply, uint _totalSupply, uint _tokenPrice){
        return (balanceOf(msg.sender), maxSupply, totalSupply(), tokenPrice);
    }
}