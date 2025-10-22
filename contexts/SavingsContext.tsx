import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Deposit, SavingsStats, Transaction, DailyGrowth } from '../types';

// Default APY for earnings calculations (will be replaced by protocol APY in production)
const DEFAULT_APY = 5.5;

interface SavingsContextType {
  deposits: Deposit[];
  transactions: Transaction[];
  stats: SavingsStats;
  addDeposit: (amount: number, protocolId: string, amountIDR?: number) => void;
  withdraw: (amount: number, amountIDR?: number) => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider = ({ children }: { children: ReactNode }) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [previousDayBalance, setPreviousDayBalance] = useState<number>(0);
  const [allTimeGrowthData, setAllTimeGrowthData] = useState<DailyGrowth[]>([]);

  const calculateStats = (): SavingsStats => {
    const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0);
    const currentApy = DEFAULT_APY;
    const totalEarned = totalDeposited * (currentApy / 100) * 0.01; // Simulated earnings
    const dailyEarnings = totalDeposited * (currentApy / 100 / 365);

    // Calculate current total balance
    const currentBalance = totalDeposited + totalEarned;

    // Calculate daily growth percentage
    const dailyGrowthPercentage = previousDayBalance > 0
      ? ((currentBalance - previousDayBalance) / previousDayBalance) * 100
      : 0;

    // Get last 7 days of growth data
    const weeklyGrowthData = allTimeGrowthData.slice(-7);

    // Calculate weekly totals
    const weeklyTotalGrowth = weeklyGrowthData.reduce(
      (sum, day) => sum + day.growthPercentage,
      0
    );
    const weeklyTotalEarnings = weeklyGrowthData.reduce(
      (sum, day) => sum + day.earnings,
      0
    );

    // Get unique protocol IDs from deposits
    const activeProtocols = [...new Set(deposits.map(d => d.strategyId))];

    return {
      totalDeposited,
      totalEarned,
      currentApy,
      dailyEarnings,
      activeStrategies: activeProtocols,
      dailyGrowthPercentage,
      previousDayBalance,
      weeklyGrowthData,
      weeklyTotalGrowth: Number(weeklyTotalGrowth.toFixed(2)),
      weeklyTotalEarnings: Number(weeklyTotalEarnings.toFixed(2)),
      allTimeGrowthData,
    };
  };

  const addDeposit = (amount: number, protocolId: string, amountIDR?: number) => {
    // Update previous day balance to simulate daily growth tracking
    const currentTotal = deposits.reduce((sum, d) => sum + d.amount, 0);
    const currentApy = DEFAULT_APY;
    const currentEarned = currentTotal * (currentApy / 100) * 0.01;
    setPreviousDayBalance(currentTotal + currentEarned);

    const newDeposit: Deposit = {
      id: Date.now().toString(),
      amount,
      strategyId: protocolId, // Store protocol ID in strategyId field for backward compatibility
      timestamp: new Date(),
      status: 'active',
    };
    setDeposits((prev) => [...prev, newDeposit]);

    // Add today's growth data
    const todayGrowth: DailyGrowth = {
      date: new Date(),
      growthPercentage: 0, // Will calculate real growth as it accrues
      earnings: 0,
      hasDeposit: true,
    };
    setAllTimeGrowthData((prev) => [...prev, todayGrowth]);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      amountIDR,
      timestamp: new Date(),
      status: 'confirmed',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const withdraw = (amount: number, amountIDR?: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdraw',
      amount,
      amountIDR,
      timestamp: new Date(),
      status: 'confirmed',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  return (
    <SavingsContext.Provider
      value={{
        deposits,
        transactions,
        stats: calculateStats(),
        addDeposit,
        withdraw,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within SavingsProvider');
  }
  return context;
};
