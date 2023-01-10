import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NotificationProvider } from '@web3uikit/core';
import { WalletProvider } from '../context/context';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Input: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
          borderColor: 'red',
        },
        _focusVisible: {
          boxShadow: 'none',
          borderColor: 'red',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <ChakraProvider theme={theme}>
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </ChakraProvider>
    </NotificationProvider>
  );
}
