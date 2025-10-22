import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PoolAllocation, PoolType } from '../types';

interface PoolCardProps {
  allocation: PoolAllocation;
  totalPortfolioValue: number;
}

const POOL_TYPE_LABELS: Record<PoolType, string> = {
  stablecoin: 'Stablecoin Pool',
  lending: 'Lending Pool',
  yield_aggregator: 'Yield Aggregator',
  dex: 'DEX Liquidity',
  staking: 'Staking Pool',
};

const POOL_TYPE_COLORS: Record<PoolType, string> = {
  stablecoin: '#10B981',
  lending: '#3B82F6',
  yield_aggregator: '#8B5CF6',
  dex: '#F59E0B',
  staking: '#EC4899',
};

const RISK_COLORS = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#EF4444',
};

export default function PoolCard({ allocation, totalPortfolioValue }: PoolCardProps) {
  const poolColor = POOL_TYPE_COLORS[allocation.poolType];
  const riskColor = RISK_COLORS[allocation.protocol.riskLevel];

  const actualPercentage = totalPortfolioValue > 0
    ? (allocation.amountAllocated / totalPortfolioValue) * 100
    : 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${poolColor}20` }]}>
            <MaterialCommunityIcons
              name={allocation.protocol.icon as any}
              size={24}
              color={poolColor}
            />
          </View>
          <View style={styles.headerText}>
            <Text variant="labelSmall" style={styles.poolType}>
              {POOL_TYPE_LABELS[allocation.poolType]}
            </Text>
            <Text variant="titleMedium" style={styles.protocolName}>
              {allocation.protocol.displayName}
            </Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: `${riskColor}20` }]}>
            <Text style={[styles.riskText, { color: riskColor }]}>
              {allocation.protocol.riskLevel}
            </Text>
          </View>
        </View>

        {/* Amount and APY */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text variant="bodySmall" style={styles.metricLabel}>
              Allocated
            </Text>
            <Text variant="titleLarge" style={styles.metricValue}>
              ${allocation.amountAllocated.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text variant="bodySmall" style={styles.metricLabel}>
              APY
            </Text>
            <Text variant="titleLarge" style={[styles.metricValue, { color: poolColor }]}>
              {allocation.currentAPY.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.metric}>
            <Text variant="bodySmall" style={styles.metricLabel}>
              Daily Earnings
            </Text>
            <Text variant="titleMedium" style={styles.metricValue}>
              ${allocation.dailyEarnings.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text variant="bodySmall" style={styles.progressLabel}>
              Portfolio Allocation
            </Text>
            <Text variant="bodySmall" style={styles.progressPercentage}>
              {actualPercentage.toFixed(1)}%
            </Text>
          </View>
          <ProgressBar
            progress={actualPercentage / 100}
            color={poolColor}
            style={styles.progressBar}
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="cash" size={14} color="#6B7280" />
            <Text variant="bodySmall" style={styles.footerText}>
              TVL: ${(allocation.protocol.tvl / 1000000).toFixed(0)}M
            </Text>
          </View>
          {allocation.protocol.volatility !== undefined && (
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="chart-line-variant" size={14} color="#6B7280" />
              <Text variant="bodySmall" style={styles.footerText}>
                Volatility: {allocation.protocol.volatility.toFixed(1)}%
              </Text>
            </View>
          )}
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="chart-areaspline" size={14} color="#10B981" />
            <Text variant="bodySmall" style={[styles.footerText, { color: '#10B981' }]}>
              Earned: ${allocation.totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  poolType: {
    color: '#6B7280',
    marginBottom: 2,
  },
  protocolName: {
    fontWeight: 'bold',
    color: '#000000',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#000000',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#6B7280',
  },
  progressPercentage: {
    color: '#000000',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 11,
  },
});
