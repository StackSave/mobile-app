import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, RadioButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaymentMethod, Wallet } from '../types';
import { requiresSignature } from '../utils/walletSignature';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew?: () => void;
  wallet?: Wallet | null;
}

export default function PaymentMethodSelector({
  paymentMethods,
  selectedId,
  onSelect,
  onAddNew,
  wallet,
}: PaymentMethodSelectorProps) {
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'usdc':
        return 'currency-usd-circle';
      case 'idrx':
        return 'cash';
      case 'gopay':
        return 'wallet';
      case 'dana':
        return 'credit-card';
      case 'ovo':
        return 'cash-multiple';
      case 'bank_transfer':
        return 'bank';
      case 'shopeepay':
        return 'shopping';
      default:
        return 'credit-card-outline';
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'usdc':
        return '#2775CA'; // USDC blue
      case 'idrx':
        return '#10B981'; // Green for stablecoin
      default:
        return '#000000';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            Payment Method
          </Text>
          {onAddNew && (
            <TouchableOpacity onPress={onAddNew}>
              <Text variant="bodyMedium" style={styles.addButton}>
                + Add New
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodItem,
              selectedId === method.id && styles.methodItemSelected,
            ]}
            onPress={() => onSelect(method.id)}
          >
            <View style={styles.methodContent}>
              <View style={[
                styles.iconContainer,
                (method.type === 'usdc' || method.type === 'idrx') && styles.cryptoIconContainer
              ]}>
                <MaterialCommunityIcons
                  name={getPaymentIcon(method.type) as any}
                  size={24}
                  color={getPaymentColor(method.type)}
                />
              </View>
              <View style={styles.methodInfo}>
                <View style={styles.nameRow}>
                  <Text variant="bodyMedium" style={styles.methodName}>
                    {method.displayName}
                  </Text>
                  {(method.type === 'usdc' || method.type === 'idrx') && (
                    <View style={styles.cryptoBadge}>
                      <Text variant="labelSmall" style={styles.cryptoBadgeText}>
                        CRYPTO
                      </Text>
                    </View>
                  )}
                </View>
                {method.accountNumber && (
                  <Text variant="bodySmall" style={styles.methodAccount}>
                    {method.accountNumber}
                  </Text>
                )}
                <View style={styles.badgesRow}>
                  {method.isDefault && (
                    <Text variant="labelSmall" style={styles.defaultBadge}>
                      DEFAULT
                    </Text>
                  )}
                  {requiresSignature(wallet, method.id) && (
                    <View style={styles.signatureBadge}>
                      <MaterialCommunityIcons name="shield-lock" size={10} color="#8B5CF6" />
                      <Text variant="labelSmall" style={styles.signatureBadgeText}>
                        Requires Signature
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <RadioButton
              value={method.id}
              status={selectedId === method.id ? 'checked' : 'unchecked'}
              onPress={() => onSelect(method.id)}
              color="#000000"
            />
          </TouchableOpacity>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  addButton: {
    color: '#000000',
    fontWeight: '600',
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  methodItemSelected: {
    backgroundColor: '#F3F4F6',
    borderColor: '#000000',
    borderWidth: 2,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cryptoIconContainer: {
    backgroundColor: '#F0F9FF',
  },
  methodInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  methodName: {
    fontWeight: '600',
    color: '#000000',
  },
  cryptoBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cryptoBadgeText: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 9,
  },
  methodAccount: {
    color: '#6B7280',
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  defaultBadge: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 10,
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  signatureBadgeText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    fontSize: 9,
  },
});
