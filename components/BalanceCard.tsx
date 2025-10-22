import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BalanceCardProps {
  title: string;
  amount: number;
  currency?: string;
  icon?: string;
  subtitle?: string;
  color?: string;
}

export default function BalanceCard({
  title,
  amount,
  currency = 'USDC',
  icon,
  subtitle,
  color = '#0052FF',
}: BalanceCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            {title}
          </Text>
          {icon && (
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={color}
            />
          )}
        </View>
        <Text variant="headlineMedium" style={[styles.amount, { color }]}>
          {amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          {currency}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </Text>
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
    marginBottom: 8,
  },
  title: {
    color: '#6B7280',
    fontWeight: '600',
  },
  amount: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9CA3AF',
    marginTop: 4,
  },
});
