/**
 * API Utility for StackSave Backend
 * Provides functions to interact with the Express.js backend
 */

// Get API URL from environment or use default
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || `${API_URL}/api`;

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================
// Health & Status
// ============================================

export interface HealthResponse {
  status: string;
  timestamp: string;
  message?: string;
  database?: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/health');
}

// ============================================
// Blockchain Endpoints
// ============================================

export interface ContractInfo {
  success: boolean;
  data: {
    stackSaveAddress: string;
    usdcAddress: string;
    network: string;
    chainId: string;
    rpcUrl: string;
    blockExplorer: string;
  };
}

export async function getContractInfo(): Promise<ContractInfo> {
  return apiFetch<ContractInfo>('/api/blockchain/contract-info');
}

export interface Goal {
  goalId: number;
  name: string;
  targetAmount: string;
  currentAmount: string;
  createdAt: number;
  completed: boolean;
}

export interface GoalsResponse {
  success: boolean;
  data: Goal[];
}

export async function getUserGoals(address: string): Promise<GoalsResponse> {
  return apiFetch<GoalsResponse>(`/api/blockchain/goals/${address}`);
}

export interface BalanceResponse {
  success: boolean;
  data: {
    balance: string;
    totalBalance: string;
    pendingInterest: string;
  };
}

export async function getUserBalance(address: string): Promise<BalanceResponse> {
  return apiFetch<BalanceResponse>(`/api/blockchain/balance/${address}`);
}

export interface UserStats {
  totalDeposited: string;
  totalEarned: string;
  streakDays: number;
  pendingRewards: string;
  usdcBalance: string;
}

export interface StatsResponse {
  success: boolean;
  data: UserStats;
}

export async function getUserStats(address: string): Promise<StatsResponse> {
  return apiFetch<StatsResponse>(`/api/blockchain/stats/${address}`);
}

export interface TotalDepositsResponse {
  success: boolean;
  data: {
    totalDeposits: string;
  };
}

export async function getTotalDeposits(): Promise<TotalDepositsResponse> {
  return apiFetch<TotalDepositsResponse>('/api/blockchain/total-deposits');
}

export interface TransactionReceipt {
  success: boolean;
  data: {
    transactionHash: string;
    blockNumber: number;
    status: string;
    gasUsed: string;
    from: string;
    to: string;
  };
}

export async function getTransaction(txHash: string): Promise<TransactionReceipt> {
  return apiFetch<TransactionReceipt>(`/api/blockchain/transaction/${txHash}`);
}

export interface SyncResponse {
  success: boolean;
  message: string;
  data: {
    goals: Goal[];
    stats: UserStats;
    balance: string;
  };
}

export async function syncUserData(userId: string, walletAddress: string): Promise<SyncResponse> {
  return apiFetch<SyncResponse>(`/api/blockchain/sync/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ walletAddress }),
  });
}

// ============================================
// User Management (Database)
// ============================================

export interface LoginResponse {
  success: boolean;
  userId: string;
  user: {
    id: string;
    wallet_address: string;
    created_at: string;
  };
}

export async function login(walletAddress: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ walletAddress }),
  });
}

// ============================================
// Portfolio
// ============================================

export interface PortfolioResponse {
  success: boolean;
  portfolio: {
    totalBalance: number;
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    totalEarnings: number;
    streakDays: number;
  };
}

export async function getPortfolio(userId: string): Promise<PortfolioResponse> {
  return apiFetch<PortfolioResponse>(`/api/portfolio/${userId}`);
}

// ============================================
// Export all functions
// ============================================

export default {
  checkHealth,
  getContractInfo,
  getUserGoals,
  getUserBalance,
  getUserStats,
  getTotalDeposits,
  getTransaction,
  syncUserData,
  login,
  getPortfolio,
};
