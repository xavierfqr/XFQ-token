import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { WalletContext } from '../context/context';
import { shortenAddress } from '../helpers/utils';
import { Eth } from '@web3uikit/icons';

function TokenCard({ balance }: { balance: number }) {
  const { currentAccount, totalSupply } = useContext(WalletContext);

  console.log('token card total supply', totalSupply);
  return (
    <Box id={String(totalSupply)} className="cardStyle w-64 h-36 md:w-96 md:h-52 rounded-2xl p-4">
      <Flex className="h-full justify-between">
        <Flex className="flex-col justify-between h-full">
          <h1 className="text-lg md:text-2xl font-semibold">Ethereum</h1>
          <Box className="flex-col">
            <div className="text-xl md:text-3xl font-semibold">{balance} XFQ</div>
            <div className="text-sm md:text-s text-gray-500">{shortenAddress(currentAccount)}</div>
          </Box>
        </Flex>
        <Box>
          <Eth className="text-7xl md:text-8xl" />
        </Box>
      </Flex>
    </Box>
  );
}

export default TokenCard;
