import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppMode, AllocationStrategy, PoolType } from '../types';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isLiteMode: boolean;
  isProMode: boolean;
  customProStrategy: AllocationStrategy | null;
  setCustomProStrategy: (strategy: AllocationStrategy) => void;
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
    description: 'Balanced Aggressive: 30% Stable, 30% Yield Aggregators, 25% DEX, 15% Staking',
    templateName: 'Balanced Aggressive',
  },
};

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('lite');
  const [customProStrategy, setCustomProStrategy] = useState<AllocationStrategy | null>(null);

  const toggleMode = () => {
    setMode((prev) => (prev === 'lite' ? 'pro' : 'lite'));
  };

  const getAllocationStrategy = (): AllocationStrategy => {
    // If in Pro mode and custom strategy exists, use it
    if (mode === 'pro' && customProStrategy) {
      return customProStrategy;
    }
    return ALLOCATION_STRATEGIES[mode];
  };

  const getModeLabel = (): string => {
    if (mode === 'pro' && customProStrategy?.isCustom) {
      return `Pro Mode (${customProStrategy.templateName || 'Custom'})`;
    }
    return mode === 'lite' ? 'Lite Mode' : 'Pro Mode';
  };

  const getModeDescription = (): string => {
    if (mode === 'pro' && customProStrategy) {
      return customProStrategy.description;
    }
    return ALLOCATION_STRATEGIES[mode].description;
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isLiteMode: mode === 'lite',
        isProMode: mode === 'pro',
        customProStrategy,
        setCustomProStrategy,
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
