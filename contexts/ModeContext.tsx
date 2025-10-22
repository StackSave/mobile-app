import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppMode, AllocationStrategy, PoolType } from '../types';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isLiteMode: boolean;
  isBalancedMode: boolean;
  isProMode: boolean;
  getAllocationStrategy: () => AllocationStrategy;
  getModeLabel: () => string;
  getModeDescription: () => string;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

// Define allocation strategies for each mode
const ALLOCATION_STRATEGIES: Record<AppMode, AllocationStrategy> = {
  lite: {
    mode: 'lite',
    allocations: [
      {
        poolType: 'stablecoin',
        targetPercentage: 100,
        minAPY: 7,
        maxAPY: 15,
        protocols: ['aave-v3-usdc', 'compound-v3-usdc'],
      },
    ],
    expectedDailyAPY: { min: 0.02, max: 0.05 },
    expectedYearlyAPY: { min: 7, max: 15 },
    riskLevel: 'Low',
    description: '100% in stable, low-risk lending pools for steady returns',
  },
  balanced: {
    mode: 'balanced',
    allocations: [
      {
        poolType: 'stablecoin',
        targetPercentage: 60,
        minAPY: 7,
        maxAPY: 15,
        protocols: ['aave-v3-usdc', 'compound-v3-usdc'],
      },
      {
        poolType: 'yield_aggregator',
        targetPercentage: 25,
        minAPY: 15,
        maxAPY: 35,
        protocols: ['beefy-stable', 'yearn-usdc'],
      },
      {
        poolType: 'staking',
        targetPercentage: 15,
        minAPY: 20,
        maxAPY: 50,
        protocols: ['moonwell-usdc', 'seamless-usdc'],
      },
    ],
    expectedDailyAPY: { min: 0.05, max: 0.15 },
    expectedYearlyAPY: { min: 15, max: 40 },
    riskLevel: 'Medium',
    description: 'Balanced mix of stable pools (60%), yield aggregators (25%), and staking (15%)',
  },
  pro: {
    mode: 'pro',
    allocations: [
      {
        poolType: 'stablecoin',
        targetPercentage: 30,
        minAPY: 7,
        maxAPY: 15,
        protocols: ['aave-v3-usdc', 'compound-v3-usdc'],
      },
      {
        poolType: 'yield_aggregator',
        targetPercentage: 30,
        minAPY: 20,
        maxAPY: 60,
        protocols: ['beefy-volatile', 'yearn-multi'],
      },
      {
        poolType: 'dex',
        targetPercentage: 25,
        minAPY: 30,
        maxAPY: 100,
        protocols: ['aerodrome-usdc', 'uniswap-v3'],
      },
      {
        poolType: 'staking',
        targetPercentage: 15,
        minAPY: 25,
        maxAPY: 80,
        protocols: ['moonwell-multi', 'seamless-multi'],
      },
    ],
    expectedDailyAPY: { min: 0.1, max: 0.3 },
    expectedYearlyAPY: { min: 30, max: 100 },
    riskLevel: 'High',
    description: 'High-risk portfolio with DEX pools (25%), yield aggregators (30%), staking (15%), and stable base (30%)',
  },
};

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('lite');

  const toggleMode = () => {
    setMode((prev) => {
      if (prev === 'lite') return 'balanced';
      if (prev === 'balanced') return 'pro';
      return 'lite';
    });
  };

  const getAllocationStrategy = (): AllocationStrategy => {
    return ALLOCATION_STRATEGIES[mode];
  };

  const getModeLabel = (): string => {
    switch (mode) {
      case 'lite':
        return 'Lite Mode';
      case 'balanced':
        return 'Balanced Mode';
      case 'pro':
        return 'Pro Mode';
    }
  };

  const getModeDescription = (): string => {
    return ALLOCATION_STRATEGIES[mode].description;
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isLiteMode: mode === 'lite',
        isBalancedMode: mode === 'balanced',
        isProMode: mode === 'pro',
        getAllocationStrategy,
        getModeLabel,
        getModeDescription,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
};
