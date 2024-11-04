'use client';

import { Button } from '@/components/ui/button';
import { usePhantomWallet } from './phantom-wallet-provider';
import { Code } from 'lucide-react';


export function WalletButton() {
  const { connect, connecting, connected, disconnect, balance, publicKey } = usePhantomWallet();

  return (
    <div className="flex items-center gap-4">
      {connected && balance !== null && (
        <div className="text-xs text-emerald-400">
          {balance.toFixed(2)} SOL
        </div>
      )}
      <Button
        onClick={connected ? disconnect : connect}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-xs"
        disabled={connecting}
      >
        <Code className="mr-2 h-4 w-4" />
        {connecting
          ? 'Connecting...'
          : connected
          ? 'Disconnect'
          : 'Connect Wallet'}
      </Button>
    </div>
  );
}