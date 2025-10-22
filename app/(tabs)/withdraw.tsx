import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Snackbar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSavings } from '../../contexts/SavingsContext';
import BalanceCard from '../../components/BalanceCard';

export default function WithdrawScreen() {
  const { wallet, addToBalance } = useWallet();
  const { stats, withdraw } = useSavings();
  const [amount, setAmount] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const totalStaked = stats.totalDeposited + stats.totalEarned;

  const handleWithdraw = () => {
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

    // Add back to wallet balance
    addToBalance('usdc', withdrawAmount);

    // Record withdrawal
    withdraw(withdrawAmount);

    setSnackbarMessage(`Successfully withdrew ${withdrawAmount.toFixed(2)} USDC!`);
    setSnackbarVisible(true);
    setAmount('');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="cash-minus" size={48} color="#0052FF" />
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
                  name="information"
                  size={24}
                  color="#0052FF"
                />
                <Text variant="titleSmall" style={styles.infoTitle}>
                  Withdrawal Info
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.infoText}>
                • Instant withdrawal - funds returned immediately
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                • No withdrawal fees or penalties
              </Text>
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
            disabled={!amount || parseFloat(amount) <= 0 || totalStaked === 0}
            style={styles.withdrawButton}
            contentStyle={styles.withdrawButtonContent}
          >
            Withdraw
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
    color: '#111827',
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
    color: '#111827',
  },
  input: {
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
  },
  infoCard: {
    marginTop: 16,
    backgroundColor: '#EFF6FF',
    elevation: 0,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  infoText: {
    color: '#1E40AF',
    marginBottom: 6,
    lineHeight: 20,
  },
  withdrawButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  withdrawButtonContent: {
    paddingVertical: 8,
  },
});
