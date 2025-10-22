import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Protocol, YieldAllocation, RebalanceHistory, PoolType } from '../types';

interface ProtocolContextType {
  protocols: Protocol[];
  userAllocations: YieldAllocation[];
  rebalanceHistory: RebalanceHistory[];
  bestProtocol: Protocol | null;
  totalAllocatedUSDC: number;
  averageAPY: number;
  getBestProtocolForAmount: (amount: number) => Protocol;
  getProtocolsByPoolType: (poolType: PoolType) => Protocol[];
  getProtocolById: (id: string) => Protocol | undefined;
  rebalanceToProtocol: (protocolId: string, amount: number) => void;
}

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

// Dummy protocols data (Base chain DeFi protocols)
const generateDummyProtocols = (): Protocol[] => {
  return [
    // Stablecoin Pools (Low Risk)
    {
      id: 'aave-v3-usdc',
      name: 'aave-v3-usdc',
      displayName: 'Aave V3 USDC',
      currentAPY: 8.5,
      tvl: 1250000000,
      riskLevel: 'Low',
      type: 'stablecoin',
      category: 'stablecoin',
      icon: 'shield-check',
      baseChainAddress: '0x...aave',
      volatility: 0.5,
    },
    {
      id: 'compound-v3-usdc',
      name: 'compound-v3-usdc',
      displayName: 'Compound V3 USDC',
      currentAPY: 7.2,
      tvl: 980000000,
      riskLevel: 'Low',
      type: 'stablecoin',
      category: 'stablecoin',
      icon: 'shield-check',
      baseChainAddress: '0x...compound',
      volatility: 0.5,
    },
    // Lending Pools
    {
      id: 'moonwell-usdc',
      name: 'moonwell-usdc',
      displayName: 'Moonwell USDC',
      currentAPY: 22.5,
      tvl: 450000000,
      riskLevel: 'Medium',
      type: 'lending',
      category: 'variable',
      icon: 'moon-waning-crescent',
      baseChainAddress: '0x...moonwell',
      volatility: 15,
    },
    {
      id: 'seamless-usdc',
      name: 'seamless-usdc',
      displayName: 'Seamless USDC',
      currentAPY: 18.9,
      tvl: 180000000,
      riskLevel: 'Medium',
      type: 'lending',
      category: 'variable',
      icon: 'chart-line',
      baseChainAddress: '0x...seamless',
      volatility: 12,
    },
    // Yield Aggregators
    {
      id: 'beefy-stable',
      name: 'beefy-stable',
      displayName: 'Beefy Stable Vault',
      currentAPY: 28.5,
      tvl: 320000000,
      riskLevel: 'Medium',
      type: 'yield_aggregator',
      category: 'variable',
      icon: 'cow',
      baseChainAddress: '0x...beefy',
      volatility: 18,
    },
    {
      id: 'beefy-volatile',
      name: 'beefy-volatile',
      displayName: 'Beefy Volatile Vault',
      currentAPY: 52.3,
      tvl: 150000000,
      riskLevel: 'High',
      type: 'yield_aggregator',
      category: 'variable',
      icon: 'cow',
      baseChainAddress: '0x...beefy-volatile',
      volatility: 35,
    },
    {
      id: 'yearn-usdc',
      name: 'yearn-usdc',
      displayName: 'Yearn USDC Vault',
      currentAPY: 25.8,
      tvl: 420000000,
      riskLevel: 'Medium',
      type: 'yield_aggregator',
      category: 'variable',
      icon: 'safe',
      baseChainAddress: '0x...yearn',
      volatility: 20,
    },
    // DEX Pools (Liquidity Provision)
    {
      id: 'aerodrome-usdc',
      name: 'aerodrome-usdc',
      displayName: 'Aerodrome USDC/ETH',
      currentAPY: 68.7,
      tvl: 280000000,
      riskLevel: 'High',
      type: 'dex',
      category: 'variable',
      icon: 'swap-horizontal',
      baseChainAddress: '0x...aerodrome',
      volatility: 45,
    },
    {
      id: 'uniswap-v3',
      name: 'uniswap-v3',
      displayName: 'Uniswap V3 USDC/ETH',
      currentAPY: 75.2,
      tvl: 650000000,
      riskLevel: 'High',
      type: 'dex',
      category: 'variable',
      icon: 'swap-vertical',
      baseChainAddress: '0x...uniswap',
      volatility: 50,
    },
    // Staking Pools
    {
      id: 'moonwell-multi',
      name: 'moonwell-multi',
      displayName: 'Moonwell Multi-Asset',
      currentAPY: 45.6,
      tvl: 200000000,
      riskLevel: 'High',
      type: 'staking',
      category: 'variable',
      icon: 'star-circle',
      baseChainAddress: '0x...moonwell-staking',
      volatility: 30,
    },
    {
      id: 'seamless-multi',
      name: 'seamless-multi',
      displayName: 'Seamless Multi-Strategy',
      currentAPY: 38.4,
      tvl: 120000000,
      riskLevel: 'Medium',
      type: 'staking',
      category: 'variable',
      icon: 'star-outline',
      baseChainAddress: '0x...seamless-staking',
      volatility: 25,
    },
  ];
};

export const ProtocolProvider = ({ children }: { children: ReactNode }) => {
  const [protocols] = useState<Protocol[]>(generateDummyProtocols());
  const [userAllocations, setUserAllocations] = useState<YieldAllocation[]>([]);
  const [rebalanceHistory, setRebalanceHistory] = useState<RebalanceHistory[]>([]);

  // Find protocol with best APY
  const bestProtocol = protocols.reduce((best, current) =>
    current.currentAPY > best.currentAPY ? current : best
  );

  // Calculate total allocated USDC
  const totalAllocatedUSDC = userAllocations.reduce(
    (sum, allocation) => sum + allocation.amountAllocated,
    0
  );

  // Calculate weighted average APY
  const averageAPY =
    totalAllocatedUSDC > 0
      ? userAllocations.reduce(
          (sum, allocation) =>
            sum + (allocation.amountAllocated / totalAllocatedUSDC) * allocation.protocol.currentAPY,
          0
        )
      : 0;

  // Get best protocol for a specific amount (could factor in TVL, risk, etc.)
  const getBestProtocolForAmount = (amount: number): Protocol => {
    // Simple logic: return highest APY with TVL > 10x the amount
    const suitable = protocols.filter((p) => p.tvl > amount * 10);
    return suitable.reduce((best, current) =>
      current.currentAPY > best.currentAPY ? current : best
    );
  };

  // Get protocols by pool type
  const getProtocolsByPoolType = (poolType: PoolType): Protocol[] => {
    return protocols.filter((p) => p.type === poolType);
  };

  // Get protocol by ID
  const getProtocolById = (id: string): Protocol | undefined => {
    return protocols.find((p) => p.id === id);
  };

  // Simulate rebalancing
  const rebalanceToProtocol = (protocolId: string, amount: number) => {
    const newProtocol = protocols.find((p) => p.id === protocolId);
    if (!newProtocol) return;

    // Create rebalance record
    const rebalance: RebalanceHistory = {
      id: Date.now().toString(),
      fromProtocol: userAllocations[0]?.protocol.displayName || 'None',
      toProtocol: newProtocol.displayName,
      amount,
      previousAPY: averageAPY,
      newAPY: newProtocol.currentAPY,
      timestamp: new Date(),
      reason: `Manual rebalance to higher APY (+${(newProtocol.currentAPY - averageAPY).toFixed(2)}%)`,
    };

    setRebalanceHistory((prev) => [rebalance, ...prev]);
  };

  return (
    <ProtocolContext.Provider
      value={{
        protocols,
        userAllocations,
        rebalanceHistory,
        bestProtocol,
        totalAllocatedUSDC,
        averageAPY,
        getBestProtocolForAmount,
        getProtocolsByPoolType,
        getProtocolById,
        rebalanceToProtocol,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error('useProtocol must be used within ProtocolProvider');
  }
  return context;
};
