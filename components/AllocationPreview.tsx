import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AllocationStrategy, PoolType } from '../types';

interface AllocationPreviewProps {
  amount: number;
  strategy: AllocationStrategy;
}

const POOL_TYPE_LABELS: Record<PoolType, string> = {
  stablecoin: 'Stablecoin Pools',
  lending: 'Lending Pools',
  yield_aggregator: 'Yield Aggregators',
  dex: 'DEX Liquidity',
  staking: 'Staking Pools',
};

const POOL_TYPE_COLORS: Record<PoolType, string> = {
  stablecoin: '#10B981',
  lending: '#3B82F6',
  yield_aggregator: '#8B5CF6',
  dex: '#F59E0B',
  staking: '#EC4899',
};

const POOL_TYPE_ICONS: Record<PoolType, string> = {
  stablecoin: 'shield-check',
  lending: 'bank',
  yield_aggregator: 'chart-line',
  dex: 'swap-horizontal',
  staking: 'star-circle',
};

export default function AllocationPreview({ amount, strategy }: AllocationPreviewProps) {
  if (amount <= 0) {
    return null;
  }

  const allocations = strategy.allocations.map((alloc) => ({
    ...alloc,
    allocatedAmount: (amount * alloc.targetPercentage) / 100,
  }));

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons name="auto-fix" size={24} color="#8B5CF6" />
          <Text variant="titleMedium" style={styles.title}>
            Automatic Allocation Preview
          </Text>
        </View>

        <Text variant="bodySmall" style={styles.subtitle}>
          Your deposit will be automatically distributed across multiple pools for optimal returns:
        </Text>

        <View style={styles.allocations}>
          {allocations.map((alloc) => (
            <View key={alloc.poolType} style={styles.allocationItem}>
              <View style={styles.allocationLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${POOL_TYPE_COLORS[alloc.poolType]}20` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={POOL_TYPE_ICONS[alloc.poolType] as any}
                    size={20}
                    color={POOL_TYPE_COLORS[alloc.poolType]}
                  />
                </View>
                <View style={styles.allocationText}>
                  <Text variant="labelMedium" style={styles.poolLabel}>
                    {POOL_TYPE_LABELS[alloc.poolType]}
                  </Text>
                  <Text variant="bodySmall" style={styles.apyRange}>
                    {alloc.minAPY}% - {alloc.maxAPY}% APY
                  </Text>
                </View>
              </View>
              <View style={styles.allocationRight}>
                <Text variant="titleSmall" style={styles.percentage}>
                  {alloc.targetPercentage}%
                </Text>
                <Text variant="bodySmall" style={styles.amount}>
                  ${alloc.allocatedAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Expected Returns */}
        <View style={styles.expectedReturns}>
          <View style={styles.returnItem}>
            <Text variant="bodySmall" style={styles.returnLabel}>
              Expected Daily APY
            </Text>
            <Text variant="titleSmall" style={styles.returnValue}>
              {strategy.expectedDailyAPY.min.toFixed(3)}% - {strategy.expectedDailyAPY.max.toFixed(3)}%
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.returnItem}>
            <Text variant="bodySmall" style={styles.returnLabel}>
              Expected Yearly APY
            </Text>
            <Text variant="titleSmall" style={[styles.returnValue, { color: '#10B981' }]}>
              {strategy.expectedYearlyAPY.min}% - {strategy.expectedYearlyAPY.max}%
            </Text>
          </View>
        </View>

        {/* Risk Badge */}
        <View style={styles.riskContainer}>
          <MaterialCommunityIcons
            name={
              strategy.riskLevel === 'Low'
                ? 'shield-check'
                : strategy.riskLevel === 'Medium'
                ? 'alert-circle'
                : 'alert'
            }
            size={16}
            color={
              strategy.riskLevel === 'Low'
                ? '#10B981'
                : strategy.riskLevel === 'Medium'
                ? '#F59E0B'
                : '#EF4444'
            }
          />
          <Text variant="bodySmall" style={styles.riskText}>
            Risk Level: <Text style={styles.riskBold}>{strategy.riskLevel}</Text>
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  allocations: {
    gap: 12,
    marginBottom: 16,
  },
  allocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  allocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allocationText: {
    flex: 1,
  },
  poolLabel: {
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
  },
  apyRange: {
    color: '#6B7280',
  },
  allocationRight: {
    alignItems: 'flex-end',
  },
  percentage: {
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 2,
  },
  amount: {
    color: '#6B7280',
  },
  expectedReturns: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  returnItem: {
    flex: 1,
    alignItems: 'center',
  },
  returnLabel: {
    color: '#6B7280',
    marginBottom: 4,
  },
  returnValue: {
    fontWeight: 'bold',
    color: '#000000',
  },
  divider: {
    width: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 12,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  riskText: {
    color: '#6B7280',
  },
  riskBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
});
