import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Snackbar, Card, RadioButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSavings } from '../../contexts/SavingsContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { usePaymentMethod } from '../../contexts/PaymentMethodContext';
import BalanceCard from '../../components/BalanceCard';

type WithdrawCurrency = 'USDC' | 'USD' | 'IDR' | 'IDRX';

export default function WithdrawScreen() {
  const { wallet, addToBalance } = useWallet();
  const { stats, withdraw } = useSavings();
  const { addNotification } = useNotifications();
  const { paymentMethods } = usePaymentMethod();
  const [amount, setAmount] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<WithdrawCurrency>('USDC');
  const [selectedBankMethod, setSelectedBankMethod] = useState('');

  const totalStaked = stats.totalDeposited + stats.totalEarned;

  // Conversion rates from USDC
  const CONVERSION_RATES = {
    USDC: 1,
    USD: 1, // 1 USDC ≈ 1 USD
    IDR: 15800, // 1 USDC ≈ 15,800 IDR
    IDRX: 15800, // 1 USDC ≈ 15,800 IDRX (assuming same as IDR)
  };

  // Get bank/ewallet payment methods only
  const bankMethods = paymentMethods.filter(
    (pm) => pm.type === 'bank' || pm.type === 'ewallet'
  );

  // Set default bank method if not selected and currency requires bank
  useEffect(() => {
    const requiresBank = selectedCurrency === 'IDR' || selectedCurrency === 'USD';
    if (requiresBank && !selectedBankMethod && bankMethods.length > 0) {
      setSelectedBankMethod(bankMethods[0].id);
    }
  }, [selectedCurrency, selectedBankMethod, bankMethods]);

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setSnackbarMessage('Please enter a valid amount');
      setSnackbarVisible(true);
      return;
    }

    if (withdrawAmount > totalStaked) {
      setSnackbarMessage('Insufficient staked balance');
      setSnackbarVisible(true);
      return;
    }

    const requiresBank = selectedCurrency === 'IDR' || selectedCurrency === 'USD';
    if (requiresBank && !selectedBankMethod) {
      setSnackbarMessage('Please select a bank/e-wallet method');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    // Simulate withdrawal processing
    setTimeout(() => {
      const convertedAmount = withdrawAmount * CONVERSION_RATES[selectedCurrency];
      const selectedMethod = paymentMethods.find((pm) => pm.id === selectedBankMethod);

      // For USDC and IDRX, add to wallet balance
      if (selectedCurrency === 'USDC') {
        addToBalance('usdc', withdrawAmount);
      }

      withdraw(withdrawAmount, convertedAmount);

      // Create notification based on currency type
      let notificationTitle = '';
      let notificationMessage = '';
      let snackbarMsg = '';

      switch (selectedCurrency) {
        case 'USDC':
          notificationTitle = 'USDC Withdrawal Successful! 💰';
          notificationMessage = `You've successfully withdrawn ${withdrawAmount.toFixed(2)} USDC to your wallet. Funds are now available for use.`;
          snackbarMsg = `Successfully withdrew ${withdrawAmount.toFixed(2)} USDC!`;
          break;
        case 'USD':
          notificationTitle = 'USD Withdrawal Successful! 💰';
          notificationMessage = `You've successfully withdrawn $${convertedAmount.toFixed(2)} USD to ${selectedMethod?.name}. Funds will arrive in 1-2 business days.`;
          snackbarMsg = `Successfully withdrew $${convertedAmount.toFixed(2)} USD!`;
          break;
        case 'IDR':
          notificationTitle = 'IDR Withdrawal Successful! 💰';
          notificationMessage = `You've successfully withdrawn Rp ${convertedAmount.toLocaleString('id-ID')} to ${selectedMethod?.name}. Funds will arrive in 1-2 business days.`;
          snackbarMsg = `Successfully withdrew Rp ${convertedAmount.toLocaleString('id-ID')}!`;
          break;
        case 'IDRX':
          notificationTitle = 'IDRX Withdrawal Successful! 💰';
          notificationMessage = `You've successfully withdrawn ${convertedAmount.toFixed(2)} IDRX to your wallet. Funds are now available for use.`;
          snackbarMsg = `Successfully withdrew ${convertedAmount.toFixed(2)} IDRX!`;
          break;
      }

      addNotification(
        'transaction',
        notificationTitle,
        notificationMessage,
        'high',
        {
          transactionId: Date.now().toString(),
          amount: withdrawAmount,
          convertedAmount: convertedAmount,
          currency: selectedCurrency,
          type: 'withdraw',
          destination: requiresBank ? 'bank' : 'wallet',
          bankMethod: selectedMethod?.name,
        },
        '/(tabs)/portfolio'
      );

      setSnackbarMessage(snackbarMsg);
      setSnackbarVisible(true);
      setAmount('');
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="cash-minus" size={48} color="#000000" />
            <Text variant="headlineSmall" style={styles.title}>
              Withdraw Funds
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Unstake and withdraw your funds anytime
            </Text>
          </View>

          {/* Available to Withdraw */}
          <BalanceCard
            title="Available to Withdraw"
            amount={totalStaked}
            icon="piggy-bank"
            subtitle={`Principal: $${stats.totalDeposited.toFixed(2)} + Earned: $${stats.totalEarned.toFixed(2)}`}
            color="#7C3AED"
          />

          {/* Wallet Balance (where funds will go) */}
          <BalanceCard
            title="Wallet Balance"
            amount={wallet.balance.usdc}
            icon="wallet"
            subtitle="Available for immediate use"
            color="#10B981"
          />

          {/* Select Currency */}
          <View style={styles.inputSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Currency
            </Text>
            <View style={styles.currencyGrid}>
              <TouchableOpacity
                style={[
                  styles.currencyOption,
                  selectedCurrency === 'USDC' && styles.currencyOptionActive,
                ]}
                onPress={() => setSelectedCurrency('USDC')}
              >
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={28}
                  color={selectedCurrency === 'USDC' ? '#FFFFFF' : '#10B981'}
                />
                <Text
                  variant="titleMedium"
                  style={[
                    styles.currencyLabel,
                    selectedCurrency === 'USDC' && styles.currencyLabelActive,
                  ]}
                >
                  USDC
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.currencySubtitle,
                    selectedCurrency === 'USDC' && styles.currencySubtitleActive,
                  ]}
                >
                  Stablecoin
                </Text>
                {selectedCurrency === 'USDC' && (
                  <View style={styles.currencyCheck}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.currencyOption,
                  selectedCurrency === 'USD' && styles.currencyOptionActive,
                ]}
                onPress={() => setSelectedCurrency('USD')}
              >
                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={28}
                  color={selectedCurrency === 'USD' ? '#FFFFFF' : '#3B82F6'}
                />
                <Text
                  variant="titleMedium"
                  style={[
                    styles.currencyLabel,
                    selectedCurrency === 'USD' && styles.currencyLabelActive,
                  ]}
                >
                  USD
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.currencySubtitle,
                    selectedCurrency === 'USD' && styles.currencySubtitleActive,
                  ]}
                >
                  US Dollar
                </Text>
                {selectedCurrency === 'USD' && (
                  <View style={styles.currencyCheck}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#3B82F6" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.currencyOption,
                  selectedCurrency === 'IDR' && styles.currencyOptionActive,
                ]}
                onPress={() => setSelectedCurrency('IDR')}
              >
                <MaterialCommunityIcons
                  name="cash"
                  size={28}
                  color={selectedCurrency === 'IDR' ? '#FFFFFF' : '#EF4444'}
                />
                <Text
                  variant="titleMedium"
                  style={[
                    styles.currencyLabel,
                    selectedCurrency === 'IDR' && styles.currencyLabelActive,
                  ]}
                >
                  IDR
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.currencySubtitle,
                    selectedCurrency === 'IDR' && styles.currencySubtitleActive,
                  ]}
                >
                  Rupiah
                </Text>
                {selectedCurrency === 'IDR' && (
                  <View style={styles.currencyCheck}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#EF4444" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.currencyOption,
                  selectedCurrency === 'IDRX' && styles.currencyOptionActive,
                ]}
                onPress={() => setSelectedCurrency('IDRX')}
              >
                <MaterialCommunityIcons
                  name="alpha-x-circle"
                  size={28}
                  color={selectedCurrency === 'IDRX' ? '#FFFFFF' : '#7C3AED'}
                />
                <Text
                  variant="titleMedium"
                  style={[
                    styles.currencyLabel,
                    selectedCurrency === 'IDRX' && styles.currencyLabelActive,
                  ]}
                >
                  IDRX
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.currencySubtitle,
                    selectedCurrency === 'IDRX' && styles.currencySubtitleActive,
                  ]}
                >
                  IDR Stable
                </Text>
                {selectedCurrency === 'IDRX' && (
                  <View style={styles.currencyCheck}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#7C3AED" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Bank Method Selection - Only show for IDR and USD */}
          {(selectedCurrency === 'IDR' || selectedCurrency === 'USD') && bankMethods.length > 0 && (
            <View style={styles.inputSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Select Bank/E-Wallet
              </Text>
              <View style={styles.bankMethodOptions}>
                {bankMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.bankMethodOption,
                      selectedBankMethod === method.id && styles.bankMethodOptionActive,
                    ]}
                    onPress={() => setSelectedBankMethod(method.id)}
                  >
                    <View style={styles.bankMethodContent}>
                      <MaterialCommunityIcons
                        name={method.type === 'bank' ? 'bank' : 'wallet'}
                        size={24}
                        color={selectedBankMethod === method.id ? '#FFFFFF' : '#000000'}
                      />
                      <View style={styles.bankMethodText}>
                        <Text
                          variant="titleSmall"
                          style={[
                            styles.bankMethodName,
                            selectedBankMethod === method.id && styles.bankMethodNameActive,
                          ]}
                        >
                          {method.name}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.bankMethodType,
                            selectedBankMethod === method.id && styles.bankMethodTypeActive,
                          ]}
                        >
                          {method.type === 'bank' ? 'Bank Transfer' : 'E-Wallet'}
                          {method.accountNumber && ` • •••• ${method.accountNumber.slice(-4)}`}
                        </Text>
                      </View>
                    </View>
                    {selectedBankMethod === method.id && (
                      <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Withdrawal Amount
            </Text>
            <TextInput
              mode="outlined"
              label="Amount (USDC)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              right={
                <TextInput.Affix text={`Max: ${totalStaked.toFixed(2)}`} />
              }
              style={styles.input}
            />
            {selectedCurrency !== 'USDC' && amount && parseFloat(amount) > 0 && (
              <View style={styles.conversionInfo}>
                <MaterialCommunityIcons name="swap-horizontal" size={20} color="#6B7280" />
                <Text variant="bodyMedium" style={styles.conversionText}>
                  {selectedCurrency === 'USD' && `≈ $${(parseFloat(amount) * CONVERSION_RATES.USD).toFixed(2)}`}
                  {selectedCurrency === 'IDR' && `≈ Rp ${(parseFloat(amount) * CONVERSION_RATES.IDR).toLocaleString('id-ID')}`}
                  {selectedCurrency === 'IDRX' && `≈ ${(parseFloat(amount) * CONVERSION_RATES.IDRX).toFixed(2)} IDRX`}
                </Text>
              </View>
            )}
            <View style={styles.quickAmounts}>
              <Button
                mode="outlined"
                compact
                onPress={() => setAmount((totalStaked * 0.25).toFixed(2))}
                disabled={totalStaked === 0}
                style={styles.quickButton}
              >
                25%
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => setAmount((totalStaked * 0.5).toFixed(2))}
                disabled={totalStaked === 0}
                style={styles.quickButton}
              >
                50%
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => setAmount((totalStaked * 0.75).toFixed(2))}
                disabled={totalStaked === 0}
                style={styles.quickButton}
              >
                75%
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => setAmount(totalStaked.toFixed(2))}
                disabled={totalStaked === 0}
                style={styles.quickButton}
              >
                Max
              </Button>
            </View>
          </View>

          {/* Info Card */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color="#000000"
                />
                <Text variant="titleSmall" style={styles.infoTitle}>
                  Withdrawal Info
                </Text>
              </View>
              {selectedCurrency === 'USDC' ? (
                <>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Instant withdrawal to your wallet
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • No withdrawal fees or penalties
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Funds available immediately in USDC
                  </Text>
                </>
              ) : selectedCurrency === 'USD' ? (
                <>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Funds will arrive in 1-2 business days
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Converted from USDC to USD (1:1 rate)
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Sent directly to your selected bank/e-wallet
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Small processing fee may apply
                  </Text>
                </>
              ) : selectedCurrency === 'IDR' ? (
                <>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Funds will arrive in 1-2 business days
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Automatically converted from USDC to IDR
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Current rate: 1 USDC ≈ Rp {CONVERSION_RATES.IDR.toLocaleString('id-ID')}
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Sent directly to your selected bank/e-wallet
                  </Text>
                </>
              ) : (
                <>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Instant withdrawal to your wallet
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Converted to IDRX stablecoin
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Rate: 1 USDC ≈ {CONVERSION_RATES.IDRX.toLocaleString('id-ID')} IDRX
                  </Text>
                  <Text variant="bodySmall" style={styles.infoText}>
                    • Available immediately for use
                  </Text>
                </>
              )}
              <Text variant="bodySmall" style={styles.infoText}>
                • Withdrawing stops earning yield on withdrawn amount
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                • You can re-deposit anytime to continue earning
              </Text>
            </Card.Content>
          </Card>

          {/* Withdraw Button */}
          <Button
            mode="contained"
            onPress={handleWithdraw}
            disabled={!amount || parseFloat(amount) <= 0 || totalStaked === 0 || loading}
            loading={loading}
            style={styles.withdrawButton}
            contentStyle={styles.withdrawButtonContent}
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 12,
    color: '#000000',
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  inputSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  currencyOption: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  currencyOptionActive: {
    backgroundColor: '#F9FAFB',
    borderColor: '#000000',
  },
  currencyLabel: {
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  currencyLabelActive: {
    color: '#000000',
  },
  currencySubtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  currencySubtitleActive: {
    color: '#6B7280',
  },
  currencyCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  destinationOptions: {
    gap: 12,
  },
  destinationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationOptionActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  destinationOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  destinationText: {
    flex: 1,
  },
  destinationLabel: {
    fontWeight: '600',
    color: '#000000',
  },
  destinationLabelActive: {
    color: '#FFFFFF',
  },
  destinationSubtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  destinationSubtitleActive: {
    color: '#D1D5DB',
  },
  bankMethodOptions: {
    gap: 12,
  },
  bankMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bankMethodOptionActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  bankMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bankMethodText: {
    flex: 1,
  },
  bankMethodName: {
    fontWeight: '600',
    color: '#000000',
  },
  bankMethodNameActive: {
    color: '#FFFFFF',
  },
  bankMethodType: {
    color: '#6B7280',
    marginTop: 2,
  },
  bankMethodTypeActive: {
    color: '#D1D5DB',
  },
  conversionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 12,
  },
  conversionText: {
    color: '#374151',
    fontWeight: '600',
  },
  infoCard: {
    marginTop: 16,
    backgroundColor: '#F3F4F6',
    elevation: 2,
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  infoText: {
    color: '#374151',
    marginBottom: 6,
    lineHeight: 20,
  },
  withdrawButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#000000',
  },
  withdrawButtonContent: {
    paddingVertical: 8,
  },
});
