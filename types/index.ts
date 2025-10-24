export interface Wallet {
  address: string;
  balance: {
    eth: number;
    usdc: number;
  };
  network: 'Base Sepolia';
  authType: AuthType;
}

export interface Deposit {
  id: string;
  amount: number;
  strategyId: string;
  timestamp: Date;
  status: 'pending' | 'active' | 'withdrawn';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'faucet';
  amount: number; // USDC amount
  amountIDR?: number; // IDR amount (optional for backward compatibility)
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastDepositDate: Date | null;
  milestones: Milestone[];
}

export interface Milestone {
  days: number;
  title: string;
  achieved: boolean;
  icon: string;
}

export interface DailyGrowth {
  date: Date;
  growthPercentage: number;
  earnings: number;
  hasDeposit: boolean;
}

export interface SavingsStats {
  totalDeposited: number;
  totalEarned: number;
  currentApy: number;
  dailyEarnings: number;
  activeStrategies: string[];
  dailyGrowthPercentage: number;
  previousDayBalance: number;
  weeklyGrowthData: DailyGrowth[];
  weeklyTotalGrowth: number;
  weeklyTotalEarnings: number;
  allTimeGrowthData: DailyGrowth[];
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  frequency: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  isMainGoal: boolean;
}

// User Types
export interface User {
  walletAddress: string;
  createdAt: Date;
}

export interface SavingPreferences {
  amount: number; // in IDR
  currency: 'IDR';
  goal: string;
  frequency: 'daily' | 'weekly' | 'auto';
  autoSaveEnabled: boolean;
}

// Payment Method Types
export type PaymentMethodType = 'gopay' | 'dana' | 'ovo' | 'bank_transfer' | 'shopeepay' | 'usdc' | 'idrx';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  displayName: string;
  accountNumber?: string;
  isDefault: boolean;
  icon: string;
}

// Pool and Protocol Types
export type PoolType = 'stablecoin' | 'lending' | 'dex' | 'staking' | 'yield_aggregator';
export type AppMode = 'lite' | 'pro';
export type AuthType = 'wallet' | 'custodial';

// DeFi Protocol Types
export interface Protocol {
  id: string;
  name: string;
  displayName: string;
  currentAPY: number;
  tvl: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  type: PoolType;
  category: 'stablecoin' | 'variable'; // stablecoin pools vs variable yield pools
  icon: string;
  baseChainAddress: string;
  volatility?: number; // For pro mode - show volatility percentage
}

// Conversion & Transaction Types
export interface ConversionRate {
  fromCurrency: 'IDR' | 'USDC';
  toCurrency: 'IDR' | 'USDC';
  rate: number;
  fees: {
    platformFee: number;
    networkFee: number;
    total: number;
  };
  estimatedReceive: number;
  timestamp: Date;
}

export interface DepositTransaction {
  id: string;
  userId: string;
  amountIDR: number;
  amountUSDC: number;
  conversionRate: number;
  paymentMethod: PaymentMethodType;
  status: 'pending' | 'converting' | 'staking' | 'completed' | 'failed';
  targetProtocol: string;
  txHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface WithdrawalTransaction {
  id: string;
  userId: string;
  amountUSDC: number;
  amountIDR: number;
  conversionRate: number;
  destinationMethod: PaymentMethodType;
  status: 'pending' | 'unstaking' | 'converting' | 'transferring' | 'completed' | 'failed';
  fromProtocol: string;
  txHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Yield Allocation Types
export interface YieldAllocation {
  protocol: Protocol;
  amountAllocated: number; // in USDC
  percentage: number;
  currentYield: number;
  allocatedAt: Date;
}

export interface RebalanceHistory {
  id: string;
  fromProtocol: string;
  toProtocol: string;
  amount: number;
  previousAPY: number;
  newAPY: number;
  timestamp: Date;
  reason: string;
}

// Portfolio Allocation Types
export interface PoolAllocation {
  id: string;
  poolType: PoolType;
  protocol: Protocol;
  amountAllocated: number; // in USDC
  percentage: number;
  currentAPY: number;
  dailyEarnings: number;
  totalEarnings: number;
  allocatedAt: Date;
  lastUpdated: Date;
}

export interface AllocationStrategy {
  mode: AppMode;
  allocations: {
    poolType: PoolType;
    targetPercentage: number;
    minAPY: number;
    maxAPY: number;
    protocols: string[]; // preferred protocol IDs
  }[];
  expectedDailyAPY: { min: number; max: number };
  expectedYearlyAPY: { min: number; max: number };
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  isCustom?: boolean; // For custom Pro strategies
  templateName?: string; // Name of the template if using preset
}

export interface PortfolioPerformance {
  totalValue: number;
  totalDeposited: number;
  totalEarnings: number;
  averageAPY: number;
  dailyChange: number;
  dailyChangePercentage: number;
  weeklyChange: number;
  monthlyChange: number;
  allocationBreakdown: PoolAllocation[];
}

export interface AllocationHistoryEntry {
  id: string;
  userId: string;
  depositId: string;
  depositAmount: number;
  allocations: {
    poolType: PoolType;
    protocolId: string;
    protocolName: string;
    amount: number;
    percentage: number;
    apy: number;
  }[];
  userMode: AppMode;
  createdAt: Date;
}
