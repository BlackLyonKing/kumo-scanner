export interface WalletInfo {
  name: string;
  icon: string;
  installed?: boolean;
  deepLink?: string;
  chain?: 'ethereum' | 'solana';
}

export interface ConnectedWallet {
  address: string;
  chainId: number | string;
  balance: string;
  walletName: string;
  chain: 'ethereum' | 'solana';
}

export interface WalletContextType {
  isConnected: boolean;
  wallet: ConnectedWallet | null;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

export enum SupportedChains {
  ETHEREUM = 1,
  POLYGON = 137,
  BSC = 56,
  ARBITRUM = 42161,
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    name: 'MetaMask',
    icon: '🦊',
    installed: typeof window !== 'undefined' && Boolean((window as any).ethereum?.isMetaMask),
    chain: 'ethereum',
  },
  {
    name: 'Phantom',
    icon: '👻',
    installed: typeof window !== 'undefined' && Boolean(window.phantom?.solana),
    chain: 'solana',
  },
  {
    name: 'Solflare',
    icon: '🌅',
    installed: typeof window !== 'undefined' && Boolean(window.solflare?.isSolflare),
    chain: 'solana',
  },
  {
    name: 'Coinbase',
    icon: '🟦',
    installed: typeof window !== 'undefined' && Boolean((window as any).ethereum?.isCoinbaseWallet),
    chain: 'ethereum',
  },
];

declare global {
  interface Window {
    ethereum?: any;
    phantom?: {
      ethereum?: any;
      solana?: any;
    };
    solana?: any;
    solflare?: any;
  }
}