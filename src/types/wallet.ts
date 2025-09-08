export interface WalletInfo {
  name: string;
  icon: string;
  installed?: boolean;
  deepLink?: string;
}

export interface ConnectedWallet {
  address: string;
  chainId: number;
  balance: string;
  walletName: string;
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
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask),
  },
  {
    name: 'WalletConnect',
    icon: '🔗',
    installed: true,
  },
  {
    name: 'Coinbase',
    icon: '🟦',
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isCoinbaseWallet),
  },
];

declare global {
  interface Window {
    ethereum?: any;
  }
}