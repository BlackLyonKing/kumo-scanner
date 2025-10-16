/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum?: any;
    phantom?: {
      ethereum?: any;
      solana?: any;
    };
    solana?: any;
  }
}

export {};
