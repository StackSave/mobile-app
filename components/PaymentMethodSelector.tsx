import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaymentMethod } from '../types';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew?: () => void;
}

export default function PaymentMethodSelector({
  paymentMethods,
  selectedId,
  onSelect,
  onAddNew,
}: PaymentMethodSelectorProps) {
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'gopay':
        return 'wallet';
      case 'dana':
        return 'credit-card';
      case 'ovo':
        return 'cash';
      case 'bank_transfer':
        return 'bank';
      case 'shopeepay':
        return 'shopping';
      default:
        return 'credit-card-outline';
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
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={getPaymentIcon(method.type) as any}
                  size={24}
                  color="#000000"
                />
              </View>
              <View style={styles.methodInfo}>
                <Text variant="bodyMedium" style={styles.methodName}>
                  {method.displayName}
                </Text>
                {method.accountNumber && (
                  <Text variant="bodySmall" style={styles.methodAccount}>
                    {method.accountNumber}
                  </Text>
                )}
                {method.isDefault && (
                  <Text variant="labelSmall" style={styles.defaultBadge}>
                    DEFAULT
                  </Text>
                )}
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
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  methodAccount: {
    color: '#6B7280',
    marginBottom: 4,
  },
  defaultBadge: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
