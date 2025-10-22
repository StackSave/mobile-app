// StackSave Theme Constants
// Centralized styling system for consistent UI

export const Colors = {
  // Primary Colors
  black: '#000000',
  white: '#FFFFFF',

  // Background Colors
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',

  // Text Colors
  textPrimary: '#000000',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#D1D5DB',

  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',

  // Risk Level Colors
  riskLow: '#10B981',
  riskMedium: '#F59E0B',
  riskHigh: '#EF4444',
} as const;

export const Spacing = {
  // Base spacing unit: 4px
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Specific use cases
  cardPadding: 16,
  sectionGap: 16,
  contentPadding: 16,
  itemGap: 8,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
} as const;

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Shadows = {
  // iOS-style subtle shadows for floating cards
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Lighter shadow for nested elements
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

export const CardStyles = {
  // Standard floating card
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    marginVertical: 10,
    marginHorizontal: 4,
    ...Shadows.card,
  },

  // Compact card (less padding)
  compact: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: 6,
    marginHorizontal: 4,
    ...Shadows.light,
  },

  // Flat card (no shadow)
  flat: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    marginVertical: 10,
    marginHorizontal: 4,
    ...Shadows.none,
  },
} as const;

export const TypographyStyles = {
  // Headings
  h1: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },

  // Body text
  body: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.normal,
    color: Colors.textPrimary,
  },
  bodySecondary: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.normal,
    color: Colors.textSecondary,
  },

  // Labels
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  labelBold: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Caption
  caption: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
    color: Colors.textTertiary,
  },
} as const;

export const LayoutStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: Spacing.contentPadding,
  },

  section: {
    marginTop: Spacing.sectionGap,
  },

  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
} as const;

// Mode-specific terminology
export const Terminology = {
  lite: {
    totalStaked: 'Money Saved',
    totalEarned: 'Money Earned',
    apy: 'Growth Rate',
    protocol: 'Smart Savings',
    stake: 'Save',
    unstake: 'Withdraw',
    yield: 'Earnings',
    allocation: 'Your Savings',
  },
  pro: {
    totalStaked: 'Total Staked',
    totalEarned: 'Total Earned',
    apy: 'APY',
    protocol: 'Protocol',
    stake: 'Stake',
    unstake: 'Unstake',
    yield: 'Yield',
    allocation: 'Allocations',
  },
} as const;
