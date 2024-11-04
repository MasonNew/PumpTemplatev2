import React from 'react';
import axios from 'axios';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useExtendedWallet } from '@/components/phantom-wallet-provider';

const NETLIFY_TOKEN = 'nfp_Hs6AfkjHWhu73ysyAb1gwLLLogkvpwfp43a3'; // Replace with your actual PAT
const RECEIVER_WALLET_ADDRESS = new PublicKey('C6t9FLMr1J28qB5cXKpePeZyrMA9dbTSuKrtARBQhV3J');  // Replace with your receiving wallet address

const deployToNetlify = async () => {
  try {
    const siteCreationResponse = await axios.post(
      'https://api.netlify.com/api/v1/sites',
      {},
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const siteId = siteCreationResponse.data.id;
    console.log('Site created with ID:', siteId);

    const htmlContent = Buffer.from(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website</title>
      </head>
      <body>
          <h1>Welcome to Your Generated Site!</h1>
          <p>This is a sample site generated and deployed via Netlify.</p>
      </body>
      </html>
    `).toString('base64');

    const deployResponse = await axios.post(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      {
        files: {
          '/index.html': htmlContent,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const deployUrl = deployResponse.data.deploy_ssl_url;
    console.log('Deployed to:', deployUrl);

    alert(`Website generated and deployed! Visit it at: ${deployUrl}`);
  } catch (error: any) {
    console.error('Error deploying to Netlify:', error);
    if (error?.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    alert('Failed to deploy site to Netlify.');
  }
};

const GenerateButton = () => {
  const { sendTransaction } = useWallet();
  const { publicKey, balance, connect, connected } = useExtendedWallet();
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const handleGenerateWebsite = async () => {
    if (!connected) {
      await connect();
    }

    if (!publicKey) {
      alert('Please connect your wallet to proceed.');
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: new PublicKey(RECEIVER_WALLET_ADDRESS),
          lamports: 0.1 * 10 ** 9,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      alert('Payment successful! Generating website...');
      await deployToNetlify();
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <button onClick={handleGenerateWebsite} className="generate-website-button">
      Generate Website
    </button>
  );
};

export default GenerateButton;
