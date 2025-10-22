import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  PoolAllocation,
  PortfolioPerformance,
  AllocationHistoryEntry,
  AppMode,
  Protocol,
  PoolType,
} from '../types';
import { useMode } from './ModeContext';
import { useProtocol } from './ProtocolContext';
import { useWallet } from './WalletContext';

interface PortfolioContextType {
  poolAllocations: PoolAllocation[];
  portfolioPerformance: PortfolioPerformance;
  allocationHistory: AllocationHistoryEntry[];
  allocateDeposit: (amount: number) => PoolAllocation[];
  getPoolsByType: (poolType: PoolType) => PoolAllocation[];
  getTotalByPoolType: (poolType: PoolType) => number;
  refreshPerformance: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { mode, getAllocationStrategy } = useMode();
  const { protocols, getProtocolsByPoolType } = useProtocol();
  const { wallet } = useWallet();

  const [poolAllocations, setPoolAllocations] = useState<PoolAllocation[]>([]);
  const [allocationHistory, setAllocationHistory] = useState<AllocationHistoryEntry[]>([]);

  // Calculate portfolio performance
  const calculatePerformance = (): PortfolioPerformance => {
    const totalValue = poolAllocations.reduce((sum, pool) => sum + pool.amountAllocated, 0);
    const totalDeposited = totalValue; // For now, assuming no earnings yet
    const totalEarnings = poolAllocations.reduce((sum, pool) => sum + pool.totalEarnings, 0);

    // Calculate weighted average APY
    const averageAPY =
      totalValue > 0
        ? poolAllocations.reduce(
            (sum, pool) => sum + (pool.amountAllocated / totalValue) * pool.currentAPY,
            0
          )
        : 0;

    // Daily change based on current APY
    const dailyChange = (totalValue * averageAPY) / 365 / 100;
    const dailyChangePercentage = totalValue > 0 ? (dailyChange / totalValue) * 100 : 0;

    return {
      totalValue,
      totalDeposited,
      totalEarnings,
      averageAPY,
      dailyChange,
      dailyChangePercentage,
      weeklyChange: dailyChange * 7,
      monthlyChange: dailyChange * 30,
      allocationBreakdown: poolAllocations,
    };
  };

  const [portfolioPerformance, setPortfolioPerformance] = useState<PortfolioPerformance>(
    calculatePerformance()
  );

  // Refresh performance when allocations change
  useEffect(() => {
    setPortfolioPerformance(calculatePerformance());
  }, [poolAllocations]);

  /**
   * Allocate a deposit across pools based on current mode strategy
   */
  const allocateDeposit = (amount: number): PoolAllocation[] => {
    const strategy = getAllocationStrategy();
    const newAllocations: PoolAllocation[] = [];
    const timestamp = new Date();

    strategy.allocations.forEach((strategyAlloc) => {
      const allocAmount = (amount * strategyAlloc.targetPercentage) / 100;

      // Find best protocol for this pool type
      const availableProtocols = getProtocolsByPoolType(strategyAlloc.poolType);
      const preferredProtocols = availableProtocols.filter((p) =>
        strategyAlloc.protocols.includes(p.id)
      );

      // Use highest APY protocol from preferred list, or fall back to any available
      const selectedProtocol =
        preferredProtocols.length > 0
          ? preferredProtocols.reduce((best, current) =>
              current.currentAPY > best.currentAPY ? current : best
            )
          : availableProtocols.length > 0
          ? availableProtocols[0]
          : null;

      if (selectedProtocol && allocAmount > 0) {
        const allocation: PoolAllocation = {
          id: `${timestamp.getTime()}-${strategyAlloc.poolType}`,
          poolType: strategyAlloc.poolType,
          protocol: selectedProtocol,
          amountAllocated: allocAmount,
          percentage: strategyAlloc.targetPercentage,
          currentAPY: selectedProtocol.currentAPY,
          dailyEarnings: (allocAmount * selectedProtocol.currentAPY) / 365 / 100,
          totalEarnings: 0,
          allocatedAt: timestamp,
          lastUpdated: timestamp,
        };

        newAllocations.push(allocation);
      }
    });

    // Update pool allocations (merge with existing)
    setPoolAllocations((prev) => {
      const updated = [...prev];

      newAllocations.forEach((newAlloc) => {
        // Find existing allocation for same protocol
        const existingIndex = updated.findIndex(
          (p) => p.protocol.id === newAlloc.protocol.id && p.poolType === newAlloc.poolType
        );

        if (existingIndex >= 0) {
          // Merge with existing
          updated[existingIndex] = {
            ...updated[existingIndex],
            amountAllocated: updated[existingIndex].amountAllocated + newAlloc.amountAllocated,
            lastUpdated: timestamp,
          };
        } else {
          // Add new allocation
          updated.push(newAlloc);
        }
      });

      return updated;
    });

    // Record allocation history
    const historyEntry: AllocationHistoryEntry = {
      id: timestamp.getTime().toString(),
      userId: wallet?.address || '',
      depositId: `deposit-${timestamp.getTime()}`,
      depositAmount: amount,
      allocations: newAllocations.map((alloc) => ({
        poolType: alloc.poolType,
        protocolId: alloc.protocol.id,
        protocolName: alloc.protocol.displayName,
        amount: alloc.amountAllocated,
        percentage: alloc.percentage,
        apy: alloc.currentAPY,
      })),
      userMode: mode,
      createdAt: timestamp,
    };

    setAllocationHistory((prev) => [historyEntry, ...prev]);

    return newAllocations;
  };

  /**
   * Get all pool allocations for a specific pool type
   */
  const getPoolsByType = (poolType: PoolType): PoolAllocation[] => {
    return poolAllocations.filter((pool) => pool.poolType === poolType);
  };

  /**
   * Get total allocated amount for a specific pool type
   */
  const getTotalByPoolType = (poolType: PoolType): number => {
    return poolAllocations
      .filter((pool) => pool.poolType === poolType)
      .reduce((sum, pool) => sum + pool.amountAllocated, 0);
  };

  /**
   * Refresh performance metrics (recalculate)
   */
  const refreshPerformance = () => {
    setPortfolioPerformance(calculatePerformance());
  };

  return (
    <PortfolioContext.Provider
      value={{
        poolAllocations,
        portfolioPerformance,
        allocationHistory,
        allocateDeposit,
        getPoolsByType,
        getTotalByPoolType,
        refreshPerformance,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};
