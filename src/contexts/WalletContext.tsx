import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletContextType, ConnectedWallet, SupportedChains } from '@/types/wallet';
import { toast } from '@/hooks/use-toast';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// WalletConnect project ID - get from https://cloud.walletconnect.com
const WC_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    // Check for existing connection on load
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet);
      reconnectWallet(walletData.walletName);
    }
  }, []);

  const reconnectWallet = async (walletName: string) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.error('Failed to reconnect wallet:', error);
      localStorage.removeItem('connectedWallet');
    }
  };

  const connect = async (walletName: string) => {
    try {
      let walletProvider;
      let signer;

      switch (walletName) {
        case 'MetaMask':
          if (!window.ethereum || !window.ethereum.isMetaMask) {
            window.open('https://metamask.io/download/', '_blank');
            toast({
              title: "MetaMask not found",
              description: "Please install MetaMask browser extension",
              variant: "destructive",
            });
            return;
          }
          
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
          }
          walletProvider = new ethers.BrowserProvider(window.ethereum);
          signer = await walletProvider.getSigner();
          break;

        case 'WalletConnect':
          if (!WC_PROJECT_ID) {
            toast({
              title: "WalletConnect not configured",
              description: "Please configure WalletConnect project ID",
              variant: "destructive",
            });
            return;
          }
          
          const wcProvider = await EthereumProvider.init({
            projectId: WC_PROJECT_ID,
            chains: [SupportedChains.ETHEREUM],
            showQrModal: true,
          });
          
          await wcProvider.enable();
          walletProvider = new ethers.BrowserProvider(wcProvider);
          signer = await walletProvider.getSigner();
          setProvider(wcProvider);
          break;

        case 'Phantom':
          if (!window.phantom?.solana) {
            window.open('https://phantom.app/download', '_blank');
            toast({
              title: "Phantom Wallet not found",
              description: "Please install Phantom Wallet browser extension",
              variant: "destructive",
            });
            return;
          }
          
          const phantomProvider = window.phantom.solana;
          
          // Only connect if not already connected
          if (!phantomProvider.isConnected) {
            try {
              const resp = await phantomProvider.connect({ onlyIfTrusted: false });
              
              // Get Solana balance using a public RPC endpoint that allows browser requests
              const connection = new Connection('https://solana-rpc.publicnode.com');
              const publicKey = new PublicKey(resp.publicKey.toString());
              const solBalance = await connection.getBalance(publicKey);
              
              const walletData: ConnectedWallet = {
                address: resp.publicKey.toString(),
                chainId: 'solana-mainnet',
                balance: (solBalance / LAMPORTS_PER_SOL).toString(),
                walletName,
                chain: 'solana',
              };

              setWallet(walletData);
              setIsConnected(true);
              setProvider(phantomProvider);
              localStorage.setItem('connectedWallet', JSON.stringify(walletData));

              toast({
                title: "Wallet Connected",
                description: `Connected to ${walletName}`,
              });
            } catch (err: any) {
              // User rejected the connection
              if (err.code === 4001) {
                toast({
                  title: "Connection Rejected",
                  description: "You rejected the connection request",
                  variant: "destructive",
                });
              } else {
                throw err;
              }
            }
          } else {
            // Already connected, get existing connection
            const publicKey = phantomProvider.publicKey;
            const connection = new Connection('https://solana-rpc.publicnode.com');
            const solBalance = await connection.getBalance(publicKey);
            
            const walletData: ConnectedWallet = {
              address: publicKey.toString(),
              chainId: 'solana-mainnet',
              balance: (solBalance / LAMPORTS_PER_SOL).toString(),
              walletName,
              chain: 'solana',
            };

            setWallet(walletData);
            setIsConnected(true);
            setProvider(phantomProvider);
            localStorage.setItem('connectedWallet', JSON.stringify(walletData));

            toast({
              title: "Wallet Connected",
              description: `Connected to ${walletName}`,
            });
          }
          return;

        case 'Coinbase':
          if (!window.ethereum?.isCoinbaseWallet) {
            window.open('https://www.coinbase.com/wallet/downloads', '_blank');
            toast({
              title: "Coinbase Wallet not found",
              description: "Please install Coinbase Wallet browser extension",
              variant: "destructive",
            });
            return;
          }
          
          const cbAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (!cbAccounts || cbAccounts.length === 0) {
            throw new Error('No accounts found');
          }
          walletProvider = new ethers.BrowserProvider(window.ethereum);
          signer = await walletProvider.getSigner();
          break;

        default:
          throw new Error('Unsupported wallet');
      }

      const address = await signer.getAddress();
      const network = await walletProvider.getNetwork();
      const balance = await walletProvider.getBalance(address);

      const walletData: ConnectedWallet = {
        address,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        walletName,
        chain: 'ethereum',
      };

      setWallet(walletData);
      setIsConnected(true);
      localStorage.setItem('connectedWallet', JSON.stringify(walletData));

      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletName}`,
      });

    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnect = async () => {
    // Disconnect Phantom Solana if connected
    if (wallet?.chain === 'solana' && (window as any).phantom?.solana) {
      try {
        await (window as any).phantom.solana.disconnect();
      } catch (error) {
        console.error('Error disconnecting Phantom:', error);
      }
    }
    
    setWallet(null);
    setIsConnected(false);
    setProvider(null);
    localStorage.removeItem('connectedWallet');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const switchNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) return;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      // Update wallet info after network switch
      if (wallet) {
        const updatedWallet = { ...wallet, chainId };
        setWallet(updatedWallet);
        localStorage.setItem('connectedWallet', JSON.stringify(updatedWallet));
      }
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch network",
        variant: "destructive",
      });
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!provider && !window.ethereum) {
      throw new Error('No wallet connected');
    }

    try {
      // Handle Solana wallet signing
      if (wallet?.chain === 'solana' && (window as any).phantom?.solana) {
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await (window as any).phantom.solana.signMessage(encodedMessage, 'utf8');
        return Buffer.from(signedMessage.signature).toString('hex');
      }
      
      // Handle Ethereum wallet signing
      const walletProvider = provider || new ethers.BrowserProvider(window.ethereum);
      const signer = await walletProvider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  };

  const value: WalletContextType = {
    isConnected,
    wallet,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};