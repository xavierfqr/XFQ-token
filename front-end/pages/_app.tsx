import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NotificationProvider } from '@web3uikit/core';
import { WalletProvider } from '../components/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </NotificationProvider>
  );
}
