import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useMode } from '../../contexts/ModeContext';
import PortfolioAllocationChart from '../../components/PortfolioAllocationChart';
import PoolCard from '../../components/PoolCard';
import ModeComparisonCard from '../../components/ModeComparisonCard';
import { PoolType } from '../../types';

export default function PortfolioScreen() {
  const { poolAllocations, portfolioPerformance, refreshPerformance } = usePortfolio();
  const { mode, setMode, getModeLabel, getModeDescription } = useMode();
  const [showModeSelector, setShowModeSelector] = useState(false);

  const { totalValue, totalEarnings, averageAPY, dailyChange } = portfolioPerformance;

  const hasAllocations = poolAllocations.length > 0;

  // Group pools by type for organized display
  const poolTypes: PoolType[] = ['stablecoin', 'lending', 'yield_aggregator', 'dex', 'staking'];
  const poolsByType = poolTypes
    .map((type) => ({
      type,
      pools: poolAllocations.filter((p) => p.poolType === type),
    }))
    .filter((group) => group.pools.length > 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Your Portfolio
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track your diversified DeFi investments
        </Text>
      </View>

      {/* Current Mode Badge */}
      <TouchableOpacity
        style={styles.modeBadgeContainer}
        onPress={() => setShowModeSelector(!showModeSelector)}
        activeOpacity={0.7}
      >
        <View style={styles.modeBadge}>
          <MaterialCommunityIcons
            name={mode === 'lite' ? 'shield-check' : 'rocket-launch'}
            size={20}
            color={mode === 'lite' ? '#10B981' : '#8B5CF6'}
          />
          <View style={styles.modeText}>
            <Text variant="labelSmall" style={styles.modeLabel}>
              Current Mode
            </Text>
            <Text variant="titleSmall" style={styles.modeName}>
              {getModeLabel()}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
        </View>
        <Text variant="bodySmall" style={styles.modeDescription}>
          {getModeDescription()}
        </Text>
      </TouchableOpacity>

      {/* Mode Selector */}
      {showModeSelector && (
        <ModeComparisonCard
          currentMode={mode}
          onModeSelect={(newMode) => {
            setMode(newMode);
            setShowModeSelector(false);
          }}
        />
      )}

      {/* Customize Strategy Button (Pro Mode Only) */}
      {mode === 'pro' && (
        <Button
          mode="outlined"
          icon="tune"
          onPress={() => router.push('/pro-strategy-config')}
          style={styles.customizeButton}
          contentStyle={styles.customizeButtonContent}
        >
          Customize Strategy
        </Button>
      )}

      {!hasAllocations ? (
        /* Empty State */
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="chart-pie" size={64} color="#D1D5DB" />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Portfolio Yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Make your first deposit to start building your diversified crypto portfolio
          </Text>
          <Button mode="contained" style={styles.emptyButton} contentStyle={styles.buttonContent}>
            Start Saving
          </Button>
        </View>
      ) : (
        <>
          {/* Portfolio Summary */}
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="labelMedium" style={styles.summaryLabel}>
                Total Portfolio Value
              </Text>
              <Text variant="displaySmall" style={styles.totalValue}>
                ${totalValue.toFixed(2)}
              </Text>

              <View style={styles.summaryMetrics}>
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="chart-line" size={20} color="#10B981" />
                  <View>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Total Earnings
                    </Text>
                    <Text variant="titleMedium" style={[styles.metricValue, { color: '#10B981' }]}>
                      +${totalEarnings.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="percent" size={20} color="#3B82F6" />
                  <View>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Average APY
                    </Text>
                    <Text variant="titleMedium" style={[styles.metricValue, { color: '#3B82F6' }]}>
                      {averageAPY.toFixed(2)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#8B5CF6" />
                  <View>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Daily Earnings
                    </Text>
                    <Text variant="titleMedium" style={[styles.metricValue, { color: '#8B5CF6' }]}>
                      ${dailyChange.toFixed(4)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Allocation Chart */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Portfolio Allocation
            </Text>
            <PortfolioAllocationChart allocations={poolAllocations} totalValue={totalValue} />
          </View>

          {/* Pool Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Pools
              </Text>
              <Text variant="bodySmall" style={styles.poolCount}>
                {poolAllocations.length} active
              </Text>
            </View>

            {poolsByType.map((group) => (
              <View key={group.type}>
                {group.pools.map((allocation) => (
                  <PoolCard
                    key={allocation.id}
                    allocation={allocation}
                    totalPortfolioValue={totalValue}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Info Footer */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information-outline" size={20} color="#6B7280" />
            <Text variant="bodySmall" style={styles.infoText}>
              Your funds are automatically distributed across multiple DeFi protocols based on your selected mode. Switch modes to change allocation for new deposits.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  modeBadgeContainer: {
    marginBottom: 16,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    flex: 1,
  },
  modeLabel: {
    color: '#6B7280',
    marginBottom: 2,
  },
  modeName: {
    fontWeight: 'bold',
    color: '#000000',
  },
  modeDescription: {
    color: '#6B7280',
    marginTop: 6,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#000000',
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  summaryCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryLabel: {
    color: '#6B7280',
    marginBottom: 8,
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  summaryMetrics: {
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  metricLabel: {
    color: '#6B7280',
    marginBottom: 2,
  },
  metricValue: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  poolCount: {
    color: '#6B7280',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  infoText: {
    flex: 1,
    color: '#6B7280',
    lineHeight: 20,
  },
  customizeButton: {
    marginBottom: 16,
    borderColor: '#8B5CF6',
  },
  customizeButtonContent: {
    paddingVertical: 6,
  },
});
