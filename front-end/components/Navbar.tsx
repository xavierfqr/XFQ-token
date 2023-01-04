import React, { useContext } from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import { WalletContext } from '../context/context';
import { Metamask } from '@web3uikit/icons';

function Navbar() {
  const { connectWallet } = useContext(WalletContext);

  return (
    <nav>
      <Flex className="justify-between py-4 px-8 text-xl items-center">
        <Text className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-700 font-bold text-3xl">
          ERC20-XFQToken
        </Text>
        <Button className="p-2 rounded text-white bg-blue-500" colorScheme="whiteAlpha" onClick={connectWallet}>
          <Metamask fontSize="30px" className="mr-2" />
          Connect Wallet
        </Button>
      </Flex>
    </nav>
  );
}

export default Navbar;
