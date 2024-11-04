'use client';

import { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { WalletProvider, useWallet, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

interface ExtendedWalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  balance: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const ExtendedWalletContext = createContext<ExtendedWalletContextType>({
  connected: false,
  connecting: false,
  publicKey: null,
  balance: null,
  connect: async () => {},
  disconnect: async () => {},
});

const network = clusterApiUrl('mainnet-beta');

const PhantomWalletProvider = ({ children }: { children: ReactNode }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const { publicKey, connected, connect, disconnect } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  const getBalance = async (pubKey: PublicKey) => {
    try {
      const connection = new Connection(network);
      const balance = await connection.getBalance(pubKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  };

  useEffect(() => {
    if (publicKey) {
      getBalance(publicKey).then(setBalance);
    }
  }, [publicKey]);

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ExtendedWalletContext.Provider
            value={{
              connected,
              connecting: false, // `connecting` can be controlled by wallet adapter states if needed
              publicKey: publicKey?.toString() || null,
              balance,
              connect,
              disconnect,
            }}
          >
            {children}
          </ExtendedWalletContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Alias `usePhantomWallet` to use the same context as `useExtendedWallet`
export const usePhantomWallet = () => useContext(ExtendedWalletContext);
export const useExtendedWallet = () => useContext(ExtendedWalletContext);

export { PhantomWalletProvider };
