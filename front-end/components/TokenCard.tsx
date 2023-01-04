import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { WalletContext } from '../context/context';
import { shortenAddress } from '../helpers/utils';
import { Eth } from '@web3uikit/icons';

function TokenCard() {
  const { currentAccount, getContract } = useContext(WalletContext);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount) return;
      const contract = await getContract();
      const res = await contract?.balanceOf(currentAccount);
      setBalance(parseInt(res._hex) / 10 ** 18);
    }
    fetchBalance();
  }, [getContract, currentAccount]);

  console.log(balance);
  return (
    <Box className="cardStyle w-96 h-52 rounded-2xl p-4">
      <Flex className="h-full justify-between">
        <Flex className="flex-col justify-between h-full">
          <h1 className="text-2xl font-semibold">Ethereum</h1>
          <Box className="flex-col">
            <div className="text-3xl font-semibold">{balance} XFQ</div>
            <div className="text-s text-gray-500">{shortenAddress(currentAccount)}</div>
          </Box>
        </Flex>
        <Box>
          <Eth fontSize="100px" />
        </Box>
      </Flex>
    </Box>
  );
}

export default TokenCard;
