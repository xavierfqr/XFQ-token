import React, { useContext } from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import { WalletContext } from '../context/context';
import { Metamask } from '@web3uikit/icons';
import { shortenAddress } from '../helpers/utils';

function Navbar() {
  const { currentAccount, connectWallet } = useContext(WalletContext);

  return (
    <nav>
      <Flex className="justify-between py-2 px-4 md:py-4 md:px-8 text-xl items-center">
        <Text className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-700 font-bold text-lg md:text-3xl">
          ERC20-XFQToken
        </Text>
        {currentAccount ? (
          <Text className="text-white text-lg md:text-xl">👋&nbsp;{shortenAddress(currentAccount)}</Text>
        ) : (
          <Button className="p-2 rounded text-white bg-blue-500" colorScheme="whiteAlpha" onClick={connectWallet}>
            <Metamask fontSize="30px" className="mr-2" />
            Connect Wallet
          </Button>
        )}
      </Flex>
    </nav>
  );
}

export default Navbar;
