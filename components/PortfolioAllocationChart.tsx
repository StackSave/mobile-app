import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PoolAllocation, PoolType } from '../types';

interface PortfolioAllocationChartProps {
  allocations: PoolAllocation[];
  totalValue: number;
}

const POOL_TYPE_LABELS: Record<PoolType, string> = {
  stablecoin: 'Stablecoin',
  lending: 'Lending',
  yield_aggregator: 'Yield Aggregator',
  dex: 'DEX Liquidity',
  staking: 'Staking',
};

const POOL_TYPE_COLORS: Record<PoolType, string> = {
  stablecoin: '#10B981',
  lending: '#3B82F6',
  yield_aggregator: '#8B5CF6',
  dex: '#F59E0B',
  staking: '#EC4899',
};

export default function PortfolioAllocationChart({
  allocations,
  totalValue,
}: PortfolioAllocationChartProps) {
  // Group allocations by pool type
  const allocationsByType = allocations.reduce((acc, allocation) => {
    const existing = acc.find((item) => item.poolType === allocation.poolType);
    if (existing) {
      existing.amount += allocation.amountAllocated;
    } else {
      acc.push({
        poolType: allocation.poolType,
        amount: allocation.amountAllocated,
      });
    }
    return acc;
  }, [] as { poolType: PoolType; amount: number }[]);

  // Sort by amount (largest first)
  allocationsByType.sort((a, b) => b.amount - a.amount);

  // Calculate percentages
  const allocationsWithPercentage = allocationsByType.map((item) => ({
    ...item,
    percentage: totalValue > 0 ? (item.amount / totalValue) * 100 : 0,
  }));

  if (totalValue === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chart-pie" size={48} color="#D1D5DB" />
        <Text variant="bodyMedium" style={styles.emptyText}>
          No allocations yet. Make your first deposit to see your portfolio distribution.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Simple horizontal bar chart */}
      <View style={styles.barContainer}>
        {allocationsWithPercentage.map((item) => (
          <View
            key={item.poolType}
            style={[
              styles.barSegment,
              {
                flex: item.percentage,
                backgroundColor: POOL_TYPE_COLORS[item.poolType],
              },
            ]}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {allocationsWithPercentage.map((item) => (
          <View key={item.poolType} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: POOL_TYPE_COLORS[item.poolType] },
              ]}
            />
            <View style={styles.legendText}>
              <Text variant="bodySmall" style={styles.legendLabel}>
                {POOL_TYPE_LABELS[item.poolType]}
              </Text>
              <Text variant="titleSmall" style={styles.legendValue}>
                {item.percentage.toFixed(1)}% • ${item.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  barSegment: {
    height: '100%',
  },
  legend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    color: '#6B7280',
    marginBottom: 2,
  },
  legendValue: {
    fontWeight: '600',
    color: '#000000',
  },
});
