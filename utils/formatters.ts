/**
 * Format numbers to Indonesian Rupiah with thousands separators
 * Examples: 100000 → "100,000", 1500000 → "1,500,000"
 */
export const formatIDR = (amount: number): string => {
  return amount.toLocaleString('id-ID');
};

/**
 * Format numbers to Indonesian Rupiah with "Rp" prefix
 * Examples: 100000 → "Rp 100,000", 1500000 → "Rp 1,500,000"
 */
export const formatIDRWithPrefix = (amount: number): string => {
  return `Rp ${formatIDR(amount)}`;
};

/**
 * Format USDC amounts with 2 decimal places
 * Examples: 10 → "10.00", 10.5 → "10.50", 10.123 → "10.12"
 */
export const formatUSDC = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Format USDC amounts with "$" prefix and 2 decimal places
 * Examples: 10 → "$10.00", 10.5 → "$10.50"
 */
export const formatUSDCWithPrefix = (amount: number): string => {
  return `$${formatUSDC(amount)}`;
};

/**
 * Format large numbers with K/M suffixes for compact display
 * Examples: 50000 → "50K", 1000000 → "1M", 1500000 → "1.5M"
 */
export const formatCompactIDR = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return formatIDR(amount);
};

/**
 * Format date to Indonesian format
 * Examples: "20 Jan 2025", "5 Feb 2025"
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format date and time to Indonesian format
 * Examples: "20 Jan 2025, 14:30", "5 Feb 2025, 09:15"
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Shorten transaction hash for display
 * Examples: "0x123456789abcdef" → "0x1234...cdef"
 */
export const shortenTxHash = (hash: string): string => {
  if (!hash || hash.length < 10) return hash;
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};
