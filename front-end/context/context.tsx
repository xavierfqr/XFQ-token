import { createContext, useCallback, useEffect, useState } from 'react';
import { useWarningNotification } from '../hooks/notifications';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../helpers/constant';

type WalletContext = {
  currentAccount: string;
  connectWallet: () => Promise<void>;
  getContract: () => Promise<ethers.Contract | undefined>;
  updateTotalSupply: () => Promise<void>;
  totalSupply: number;
};

export const WalletContext = createContext<WalletContext>({} as WalletContext);

export const WalletProvider = ({ children }: React.PropsWithChildren) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const warningNotification = useWarningNotification();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        warningNotification('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      warningNotification('You denied your wallet connection.');
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        warningNotification('Make sure you have metamask!');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        await checkIfNetworkIsGoerli();

        return;
      } else {
        warningNotification('Connect to MetaMask using the top right button.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfNetworkIsGoerli = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      warningNotification('Make sure you have metamask!');
      return;
    }

    const hex_chainId = ethers.utils.hexValue('0x05');
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: hex_chainId, // Goerli testnet
          },
        ],
      });
      return;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hex_chainId,
                chainName: 'Goerli Testnet',
                nativeCurrency: {
                  name: 'Goerli ETH',
                  symbol: 'goETH',
                  decimals: 18,
                },
                rpcUrls: ['https://eth-goerli.g.alchemy.com/v2/PXaWgVGVciOz5ampB-BAT6qb1YI6GK0G'],
                blockExplorerUrls: ['https://goerli.etherscan.io'],
              },
            ],
          });
        } catch (err) {
          warningNotification('You denied network connection.');
        }
      }
    }
  };

  const getContractWithSigner = useCallback(async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    const provider = new ethers.providers.Web3Provider(ethereum);
    return new ethers.Contract(contractAddress, contractABI, provider.getSigner());
  }, []);

  const updateTotalSupply = useCallback(async () => {
    const contract = await getContractWithSigner();
    setTotalSupply((await contract?.totalSupply()) / 10 ** 18);
  }, [getContractWithSigner, setTotalSupply]);

  useEffect(() => {
    updateTotalSupply();
  }, [updateTotalSupply]);

  useEffect(() => {
    if (!window.ethereum) return;
    checkIfWalletIsConnected();

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setCurrentAccount(accounts[0] ?? '');
    });
    window.ethereum.on('chainChanged', (chainId: string) => {
      const hex_chainId = ethers.utils.hexValue('0x05');
      if (chainId == hex_chainId) return;
      window.location.reload();
    });

    return () => {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{ currentAccount, connectWallet, getContract: getContractWithSigner, updateTotalSupply, totalSupply }}
    >
      {children}
    </WalletContext.Provider>
  );
};
