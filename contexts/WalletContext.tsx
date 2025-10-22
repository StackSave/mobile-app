import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet } from '../types';

const STORAGE_KEY = '@stacksave_wallet_session';

interface WalletContextType {
  wallet: Wallet | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (address: string) => Promise<void>;
  disconnect: () => Promise<void>;
  fetchBalances: () => Promise<void>;
  updateBalance: (type: 'eth' | 'usdc', amount: number) => void;
  addToBalance: (type: 'eth' | 'usdc', amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Public client for reading blockchain data
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  // Initialize wallet session from storage
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          // Auto-connect with saved address
          await connect(sessionData.address);
        }
      } catch (error) {
        console.error('Error loading wallet session:', error);
      }
    };

    initializeSession();
  }, []);

  const saveSession = async (walletAddress: string) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          address: walletAddress,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error saving wallet session:', error);
    }
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing wallet session:', error);
    }
  };

  const fetchBalances = async () => {
    if (!wallet?.address) return;

    try {
      // Fetch ETH balance
      const ethBalance = await publicClient.getBalance({
        address: wallet.address as `0x${string}`,
      });

      // TODO: Fetch USDC balance from USDC contract on Base Sepolia
      // For now, initialize with 0 USDC
      const usdcBalance = 0;

      setWallet(prev => prev ? {
        ...prev,
        balance: {
          eth: parseFloat(formatEther(ethBalance)),
          usdc: usdcBalance,
        },
      } : null);
    } catch (error) {
      console.error('Error fetching balances:', error);
      // Keep existing wallet but with zero balances if fetch fails
      setWallet(prev => prev ? {
        ...prev,
        balance: { eth: 0, usdc: 0 },
      } : null);
    }
  };

  const connect = async (address: string) => {
    try {
      setIsConnecting(true);

      // Validate address format
      if (!address.startsWith('0x') || address.length !== 42) {
        throw new Error('Invalid Ethereum address format');
      }

      // Create wallet object
      const newWallet: Wallet = {
        address: address.toLowerCase(),
        balance: { eth: 0, usdc: 0 },
        network: 'Base Sepolia',
      };

      setWallet(newWallet);
      await saveSession(address.toLowerCase());

      // Fetch balances
      setTimeout(() => {
        fetchBalances();
      }, 100);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setWallet(null);
      await clearSession();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const updateBalance = (type: 'eth' | 'usdc', amount: number) => {
    if (!wallet) return;

    setWallet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        balance: {
          ...prev.balance,
          [type]: amount,
        },
      };
    });
  };

  const addToBalance = (type: 'eth' | 'usdc', amount: number) => {
    if (!wallet) return;

    setWallet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        balance: {
          ...prev.balance,
          [type]: prev.balance[type] + amount,
        },
      };
    });
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnected: !!wallet,
        isConnecting,
        connect,
        disconnect,
        fetchBalances,
        updateBalance,
        addToBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
