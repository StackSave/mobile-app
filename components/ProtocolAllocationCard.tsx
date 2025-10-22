import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { YieldAllocation } from '../types';

interface ProtocolAllocationCardProps {
  allocations: YieldAllocation[];
  totalAmount: number;
  averageAPY: number;
}

export default function ProtocolAllocationCard({
  allocations,
  totalAmount,
  averageAPY,
}: ProtocolAllocationCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="chart-pie" size={24} color="#000000" />
            <Text variant="titleMedium" style={styles.title}>
              Your Allocations
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/protocols')}>
            <Text variant="bodyMedium" style={styles.viewAllButton}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text variant="bodySmall" style={styles.summaryLabel}>
              Total Allocated
            </Text>
            <Text variant="titleLarge" style={styles.summaryValue}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text variant="bodySmall" style={styles.summaryLabel}>
              Average APY
            </Text>
            <Text variant="titleLarge" style={[styles.summaryValue, styles.apyValue]}>
              {averageAPY.toFixed(2)}%
            </Text>
          </View>
        </View>

        {allocations.length > 0 ? (
          allocations.map((allocation) => (
            <View key={allocation.protocol.id} style={styles.allocationItem}>
              <View style={styles.allocationHeader}>
                <View style={styles.protocolInfo}>
                  <MaterialCommunityIcons
                    name={allocation.protocol.icon as any}
                    size={20}
                    color="#000000"
                  />
                  <Text variant="bodyMedium" style={styles.protocolName}>
                    {allocation.protocol.displayName}
                  </Text>
                </View>
                <View style={styles.allocationStats}>
                  <Text variant="bodyMedium" style={styles.allocationAmount}>
                    ${allocation.amountAllocated.toFixed(2)}
                  </Text>
                  <Text variant="bodySmall" style={styles.allocationPercentage}>
                    {allocation.percentage}%
                  </Text>
                </View>
              </View>
              <ProgressBar
                progress={allocation.percentage / 100}
                color="#000000"
                style={styles.progressBar}
              />
              <View style={styles.allocationFooter}>
                <Text variant="bodySmall" style={styles.apyText}>
                  {allocation.protocol.currentAPY.toFixed(2)}% APY
                </Text>
                <Text variant="bodySmall" style={styles.earningsText}>
                  +${allocation.currentYield.toFixed(2)} earned
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="database-outline" size={48} color="#9CA3AF" />
            <Text variant="bodyMedium" style={styles.emptyText}>
              No allocations yet
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Start saving to see your protocol allocations
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  viewAllButton: {
    color: '#000000',
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  summaryLabel: {
    color: '#9CA3AF',
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#000000',
  },
  apyValue: {
    color: '#10B981',
  },
  allocationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  protocolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  protocolName: {
    fontWeight: '600',
    color: '#000000',
  },
  allocationStats: {
    alignItems: 'flex-end',
  },
  allocationAmount: {
    fontWeight: 'bold',
    color: '#000000',
  },
  allocationPercentage: {
    color: '#6B7280',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  allocationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  apyText: {
    color: '#10B981',
    fontWeight: '600',
  },
  earningsText: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#9CA3AF',
    marginTop: 4,
  },
});
