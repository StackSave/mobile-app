import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ConversionPreviewProps {
  fromAmount: number;
  fromCurrency: 'IDR' | 'USDC';
  toAmount: number;
  toCurrency: 'IDR' | 'USDC';
  rate: number;
  fees: {
    platformFee: number;
    networkFee: number;
    total: number;
  };
}

export default function ConversionPreview({
  fromAmount,
  fromCurrency,
  toAmount,
  toCurrency,
  rate,
  fees,
}: ConversionPreviewProps) {
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'IDR') {
      return `Rp ${amount.toLocaleString('id-ID')}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="labelMedium" style={styles.title}>
          Conversion Preview
        </Text>

        <View style={styles.conversionRow}>
          <View style={styles.currencySection}>
            <Text variant="bodySmall" style={styles.currencyLabel}>
              You Pay
            </Text>
            <Text variant="titleLarge" style={styles.currencyAmount}>
              {formatCurrency(fromAmount, fromCurrency)}
            </Text>
            <Text variant="bodySmall" style={styles.currencyCode}>
              {fromCurrency}
            </Text>
          </View>

          <MaterialCommunityIcons name="arrow-right" size={24} color="#000000" />

          <View style={styles.currencySection}>
            <Text variant="bodySmall" style={styles.currencyLabel}>
              You Receive
            </Text>
            <Text variant="titleLarge" style={styles.currencyAmount}>
              {formatCurrency(toAmount, toCurrency)}
            </Text>
            <Text variant="bodySmall" style={styles.currencyCode}>
              {toCurrency}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Exchange Rate
            </Text>
            <Text variant="bodySmall" style={styles.detailValue}>
              1 {toCurrency} = {rate.toLocaleString('id-ID')} {fromCurrency}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Platform Fee (0.5%)
            </Text>
            <Text variant="bodySmall" style={styles.detailValue}>
              {formatCurrency(fees.platformFee, fromCurrency)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Network Fee
            </Text>
            <Text variant="bodySmall" style={styles.detailValue}>
              {formatCurrency(fees.networkFee, fromCurrency)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.totalLabel}>
              Total Fees
            </Text>
            <Text variant="bodyMedium" style={styles.totalValue}>
              {formatCurrency(fees.total, fromCurrency)}
            </Text>
          </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    color: '#6B7280',
    marginBottom: 16,
  },
  conversionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currencySection: {
    flex: 1,
    alignItems: 'center',
  },
  currencyLabel: {
    color: '#9CA3AF',
    marginBottom: 4,
  },
  currencyAmount: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  currencyCode: {
    color: '#6B7280',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  detailsSection: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#6B7280',
  },
  detailValue: {
    color: '#111827',
    fontWeight: '500',
  },
  totalLabel: {
    color: '#000000',
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#000000',
    fontWeight: 'bold',
  },
});
