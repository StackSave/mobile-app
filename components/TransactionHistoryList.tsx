import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Transaction } from '../types';
import TransactionItem from './TransactionItem';

interface TransactionHistoryListProps {
  transactions: Transaction[];
}

export default function TransactionHistoryList({ transactions }: TransactionHistoryListProps) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="history" size={64} color="#D1D5DB" />
        <Text variant="titleMedium" style={styles.emptyTitle}>
          No Transactions Yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtitle}>
          Your transaction history will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        Transaction History
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
