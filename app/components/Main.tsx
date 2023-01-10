import React, { useContext, useEffect } from 'react';
import { Flex, Text, Box, useNumberInput, HStack, Button, Input, FormControl } from '@chakra-ui/react';
import { TabList, Tab, CopyButton } from '@web3uikit/core';
import { WalletContext } from '../context/context';
import { shortenAddress } from '../helpers/utils';
import { useErrorNotification, useSuccessNotification } from '../hooks/notifications';
import { ethers } from 'ethers';
import TokenCard from './TokenCard';
import Meter from './Meter';
import TokenHolders from './TokenHolders';

function Main() {
  const [isMinting, setIsMinting] = React.useState(false);
  const [isTransfering, setIsTransfering] = React.useState(false);
  const [accountBalance, setAccountBalance] = React.useState(0);
  const successNotification = useSuccessNotification();
  const errorNotification = useErrorNotification();
  const { currentAccount, getContract, updateTotalSupply, totalSupply, chainId } = useContext(WalletContext);

  useEffect(() => {}, [chainId]);

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value: mintAmount,
  } = useNumberInput({
    step: 1,
    defaultValue: 0,
    min: 0,
    max: 10,
    precision: 0,
  });

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount || chainId !== '0x5') return;

      const contract = await getContract();
      const res = await contract?.balanceOf(currentAccount);

      setAccountBalance(parseInt(res._hex) / 10 ** 18);
    }
    fetchBalance();
  }, [getContract, currentAccount, totalSupply, chainId]);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const to = e.target.to.value;
    const tokensCount = e.target.tokensCount.value;
    try {
      const contract = await getContract();
      const txn = await contract?.transfer(to, ethers.utils.parseEther(tokensCount));
      setIsTransfering(true);
      txn.wait();
      setIsTransfering(false);
      updateTotalSupply();
    } catch (e) {
      errorNotification('Transfer Failed :(');
    }
  };

  const handleMint = async () => {
    const contract = await getContract();

    const tokenPrice = await contract?.tokenPrice();
    const options = {
      value: (Number(mintAmount) * tokenPrice._hex).toString(),
    };

    try {
      const txn = await contract?.mint(ethers.utils.parseEther(mintAmount), options);
      setIsMinting(true);
      await txn.wait();
      setIsMinting(false);
      updateTotalSupply();
      successNotification('Mint Successful!');
    } catch (e) {
      errorNotification('Mint Failed :(');
    }
  };

  return (
    <Flex className="flex-col items-center overflow-auto">
      <Flex className="flex-col mb-16 mx-16">
        <Text as="div" className="text-gray-200 text-4xl md:text-6xl m-auto text-center">
          <div>Ethereum Request for</div>
          <span>
            Comments{' '}
            <Text as="span" className="text-transparent bg-clip-text bg-gradient-to-r from-[#c21500] to-[#ffc500]">
              XFQ Token
            </Text>
          </span>
        </Text>
      </Flex>
      <Flex className="items-center gap-10 flex-col md:flex-row">
        <Box className="rounded-xl bg-slate-900 p-4 w-64 md:w-96">
          <TabList defaultActiveKey={0} tabStyle="bar">
            <Tab key={0} tabKey={0} tabName="Mint">
              <Box>1 XFQ Token = 0.02 Goerli Ether + gas fee</Box>
              <HStack maxW="320px" className="mt-2">
                <Button {...getDecrementButtonProps()} colorScheme="whiteAlpha">
                  {' '}
                  -{' '}
                </Button>
                +<Input {...getInputProps()}></Input>
                <Button {...getIncrementButtonProps()} colorScheme="whiteAlpha">
                  +
                </Button>
              </HStack>
              <Box className="mt-2">{Number(mintAmount) * 0.02} Goerli Ether</Box>
              <Button
                colorScheme="blue"
                className="mt-4 w-full"
                onClick={handleMint}
                isLoading={isMinting}
                disabled={Number(mintAmount) == 0 || isMinting || !currentAccount}
              >
                Mint XFQ
              </Button>
            </Tab>
            <Tab key={1} tabKey={1} tabName="Transfer">
              <Box>
                From {shortenAddress(currentAccount)}
                <CopyButton
                  text={currentAccount}
                  revertIn={6500}
                  onCopy={() => successNotification('Copied to clipboard')}
                />
              </Box>
              <form className="mt-4" onSubmit={handleFormSubmit}>
                <FormControl>
                  <Input name="to" placeholder="To" className="mb-2" />
                  <Input name="tokensCount" placeholder="Number of tokens"></Input>
                  <Button colorScheme="blue" className="mt-4 w-full" type="submit" isLoading={isTransfering}>
                    Transfer XFQ
                  </Button>
                </FormControl>
              </form>
            </Tab>
          </TabList>
        </Box>
        <TokenCard balance={accountBalance}></TokenCard>
      </Flex>
      <Box className="mb-14">
        <Meter totalSupply={totalSupply}></Meter>
      </Box>
      <TokenHolders></TokenHolders>
    </Flex>
  );
}

export default Main;
