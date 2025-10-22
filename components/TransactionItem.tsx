import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { formatIDRWithPrefix, formatUSDCWithPrefix, formatDateTime, shortenTxHash } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const getIconName = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'arrow-down-circle';
      case 'withdraw':
        return 'arrow-up-circle';
      case 'faucet':
        return 'gift';
      default:
        return 'swap-horizontal';
    }
  };

  const getIconColor = () => {
    switch (transaction.type) {
      case 'deposit':
        return '#10B981'; // Green
      case 'withdraw':
        return '#EF4444'; // Red
      case 'faucet':
        return '#8B5CF6'; // Purple
      default:
        return '#6B7280'; // Gray
    }
  };

  const getTypeLabel = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdraw';
      case 'faucet':
        return 'Faucet';
      default:
        return 'Transaction';
    }
  };

  const getStatusBadgeColor = () => {
    switch (transaction.status) {
      case 'confirmed':
        return '#D1FAE5'; // Light green
      case 'pending':
        return '#FEF3C7'; // Light yellow
      case 'failed':
        return '#FEE2E2'; // Light red
      default:
        return '#F3F4F6';
    }
  };

  const getStatusTextColor = () => {
    switch (transaction.status) {
      case 'confirmed':
        return '#065F46'; // Dark green
      case 'pending':
        return '#92400E'; // Dark yellow
      case 'failed':
        return '#991B1B'; // Dark red
      default:
        return '#374151';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.container}>
          {/* Left: Icon and Type */}
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
              <MaterialCommunityIcons
                name={getIconName() as any}
                size={24}
                color={getIconColor()}
              />
            </View>
            <View style={styles.typeInfo}>
              <Text variant="titleSmall" style={styles.typeLabel}>
                {getTypeLabel()}
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                {formatDateTime(transaction.timestamp)}
              </Text>
            </View>
          </View>

          {/* Right: Amounts */}
          <View style={styles.rightSection}>
            <Text variant="titleMedium" style={styles.usdcAmount}>
              {formatUSDCWithPrefix(transaction.amount)}
            </Text>
            {transaction.amountIDR && (
              <Text variant="bodySmall" style={styles.idrAmount}>
                {formatIDRWithPrefix(transaction.amountIDR)}
              </Text>
            )}
          </View>
        </View>

        {/* Bottom: Transaction Hash and Status */}
        <View style={styles.footer}>
          {transaction.txHash && (
            <View style={styles.txHashContainer}>
              <MaterialCommunityIcons name="link-variant" size={12} color="#9CA3AF" />
              <Text variant="bodySmall" style={styles.txHash}>
                {shortenTxHash(transaction.txHash)}
              </Text>
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor() }]}>
            <Text
              variant="labelSmall"
              style={[styles.statusText, { color: getStatusTextColor() }]}
            >
              {transaction.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  dateText: {
    color: '#6B7280',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  usdcAmount: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  idrAmount: {
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  txHashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  txHash: {
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
