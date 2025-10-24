import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AllocationStrategy, PoolType } from '../types';

interface StrategyTemplateCardProps {
  strategy: AllocationStrategy;
  isSelected: boolean;
  onSelect: () => void;
}

const POOL_COLORS: Record<PoolType, string> = {
  stablecoin: '#10B981',
  yield_aggregator: '#F59E0B',
  dex: '#3B82F6',
  staking: '#8B5CF6',
  lending: '#EC4899',
};

const POOL_LABELS: Record<PoolType, string> = {
  stablecoin: 'Stable',
  yield_aggregator: 'Yield Agg',
  dex: 'DEX',
  staking: 'Staking',
  lending: 'Lending',
};

export default function StrategyTemplateCard({
  strategy,
  isSelected,
  onSelect,
}: StrategyTemplateCardProps) {
  const getTemplateIcon = (name: string) => {
    if (name.includes('Balanced')) return 'scale-balance';
    if (name.includes('Yield')) return 'chart-line';
    if (name.includes('DEX')) return 'swap-horizontal';
    if (name.includes('Staking')) return 'lock';
    return 'strategy';
  };

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <Card style={[styles.card, isSelected && styles.selectedCard]}>
        <Card.Content>
          {isSelected && (
            <View style={styles.selectedBadge}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#8B5CF6" />
            </View>
          )}

          <View style={[styles.iconContainer, { backgroundColor: '#8B5CF620' }]}>
            <MaterialCommunityIcons
              name={getTemplateIcon(strategy.templateName || '') as any}
              size={28}
              color="#8B5CF6"
            />
          </View>

          <Text variant="titleSmall" style={styles.templateName}>
            {strategy.templateName}
          </Text>

          <View style={styles.apySection}>
            <Text variant="bodySmall" style={styles.apyLabel}>
              Expected APY
            </Text>
            <Text variant="titleMedium" style={styles.apyValue}>
              {strategy.expectedYearlyAPY.min}-{strategy.expectedYearlyAPY.max}%
            </Text>
          </View>

          <View style={styles.allocationSection}>
            {strategy.allocations
              .filter((a) => a.targetPercentage > 0)
              .map((allocation) => (
                <View key={allocation.poolType} style={styles.allocationRow}>
                  <View
                    style={[
                      styles.allocationDot,
                      { backgroundColor: POOL_COLORS[allocation.poolType] },
                    ]}
                  />
                  <Text variant="bodySmall" style={styles.allocationText}>
                    {POOL_LABELS[allocation.poolType]}
                  </Text>
                  <Text variant="bodySmall" style={styles.allocationPercentage}>
                    {allocation.targetPercentage}%
                  </Text>
                </View>
              ))}
          </View>

          <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
            {strategy.description}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  templateName: {
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  apySection: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  apyLabel: {
    color: '#6B7280',
    marginBottom: 4,
  },
  apyValue: {
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  allocationSection: {
    marginBottom: 12,
  },
  allocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  allocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  allocationText: {
    flex: 1,
    color: '#374151',
  },
  allocationPercentage: {
    fontWeight: '600',
    color: '#000000',
  },
  description: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
  },
});
