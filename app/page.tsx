'use client';

import { PhantomWalletProvider } from '@/components/phantom-wallet-provider';
import { WalletButton } from '@/components/wallet-button';
import GenerateButton from '@/components/generate-button';

export default function Home() {
  return (
    <PhantomWalletProvider>
      <div className="fixed top-0 right-0 p-4">
        <WalletButton />
      </div>
      <main className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl text-white">
            <span className="text-emerald-400">&lt;/&gt;</span> Web3 Generator
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Launch your next website in style
          </p>
        </div>
        
        <div className="w-full max-w-md bg-zinc-800/50 rounded-lg p-8 backdrop-blur-sm">
          <div className="flex justify-center">
            <GenerateButton />
          </div>
        </div>
      </main>
    </PhantomWalletProvider>
  );
}
