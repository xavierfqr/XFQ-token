import { createContext, useEffect, useState } from 'react';
import { useErrorNotification, useWarningNotification } from '../hooks/notifications';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../helpers/constant';

type WalletContext = {
  currentAccount: string;
  connectWallet: () => Promise<void>;
  getContract: () => Promise<ethers.Contract | undefined>;
};

const WalletContext = createContext<WalletContext>({
  currentAccount: '',
  connectWallet: async () => {},
  getContract: async () => {
    return undefined;
  },
});

export const WalletProvider = ({ children }: React.PropsWithChildren) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const warningNotification = useWarningNotification();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        warningNotification('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setCurrentAccount(account);
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

        await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${Number()}` }] });

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

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x05', // Goerli testnet
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
                chainId: '0x05',
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

  const getContract = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    const provider = new ethers.providers.Web3Provider(ethereum);
    return new ethers.Contract(contractAddress, contractABI, provider.getSigner());
  };

  useEffect(() => {
    if (!window.ethereum) return;
    checkIfWalletIsConnected();

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setCurrentAccount(accounts[0] ?? '');
    });
    window.ethereum.on('chainChanged', (chainId: string) => {
      if (chainId == '0x05') return;
      window.location.reload();
    });

    return () => {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    };
  }, []);

  return (
    <WalletContext.Provider value={{ currentAccount, connectWallet, getContract }}>{children}</WalletContext.Provider>
  );
};
