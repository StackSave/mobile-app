import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, TextInput, Button, Snackbar, Card, Switch, Chip, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSavings } from '../../contexts/SavingsContext';
import { useStreak } from '../../contexts/StreakContext';
import { usePaymentMethod } from '../../contexts/PaymentMethodContext';
import { useProtocol } from '../../contexts/ProtocolContext';
import { useMode } from '../../contexts/ModeContext';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useGoals } from '../../contexts/GoalsContext';
import BalanceCard from '../../components/BalanceCard';
import ConversionPreview from '../../components/ConversionPreview';
import PaymentMethodSelector from '../../components/PaymentMethodSelector';
import AllocationPreview from '../../components/AllocationPreview';
import TransactionHistoryList from '../../components/TransactionHistoryList';
import { Colors, Spacing, CardStyles, Shadows } from '../../constants/theme';
import { formatIDR, formatCompactIDR } from '../../utils/formatters';
import {
  requiresSignature,
  requestWalletSignature,
  getSignatureExplanation,
} from '../../utils/walletSignature';

type TabType = 'save' | 'withdraw' | 'history';

export default function SaveScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('save');
  const { wallet, updateBalance, addToBalance } = useWallet();
  const { addDeposit, stats, withdraw, transactions } = useSavings();
  const { updateStreak } = useStreak();
  const { paymentMethods, defaultPaymentMethod } = usePaymentMethod();
  const { protocols, bestProtocol } = useProtocol();
  const { mode, getAllocationStrategy, isProMode, isLiteMode, toggleMode } = useMode();
  const { allocateDeposit } = usePortfolio();
  const { mainGoal, updateGoalProgress } = useGoals();

  // Amount state
  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultPaymentMethod?.id || ''
  );
  const [selectedWithdrawCurrency, setSelectedWithdrawCurrency] = useState<'USDC' | 'USD' | 'IDR' | 'IDRX'>('USDC');
  const [selectedBankForWithdraw, setSelectedBankForWithdraw] = useState('');
  const [withdrawDestination, setWithdrawDestination] = useState<'wallet' | 'bank'>('wallet');
  const [walletAddress, setWalletAddress] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);

  // Conversion rate: 1 USDC ≈ 15,800 IDR (example rate)
  const IDR_TO_USDC_RATE = 15800;

  const totalStaked = stats.totalDeposited + stats.totalEarned;

  // Get selected payment method details
  const selectedPaymentMethodDetails = paymentMethods.find(
    (pm) => pm.id === selectedPaymentMethod
  );

  // Reset amount when payment method changes (currency changes)
  useEffect(() => {
    setAmount('');
  }, [selectedPaymentMethod]);

  // Determine payment method type
  const paymentType = selectedPaymentMethodDetails?.type;
  const isUSDC = paymentType === 'usdc';
  const isIDRX = paymentType === 'idrx';
  const isCryptoPayment = isUSDC || isIDRX;

  // Determine currency based on payment method
  const inputCurrency = isUSDC ? 'USDC' : isIDRX ? 'IDRX' : 'IDR';
  const currencyPrefix = isUSDC ? 'USDC' : isIDRX ? 'IDRX' : 'Rp';

  // Calculate conversion
  const inputAmount = parseFloat(amount) || 0;
  let idrAmount: number;
  let usdcAmount: number;
  let platformFee: number;
  let networkFee: number;
  let totalFees: number;
  let estimatedUSDC: number;

  if (isUSDC) {
    // Input is in USDC - no conversion needed
    usdcAmount = inputAmount;
    idrAmount = usdcAmount * IDR_TO_USDC_RATE;
    platformFee = usdcAmount * 0.005; // 0.5%
    networkFee = 0.3; // $0.3 network fee for USDC
    totalFees = platformFee + networkFee;
    estimatedUSDC = usdcAmount - totalFees;
  } else if (isIDRX) {
    // Input is in IDRX (pegged 1:1 to IDR), need to convert to USDC
    idrAmount = inputAmount; // IDRX amount = IDR value
    usdcAmount = idrAmount / IDR_TO_USDC_RATE;
    platformFee = idrAmount * 0.005; // 0.5%
    networkFee = 5000; // Rp 5,000 fixed network fee for IDRX
    totalFees = platformFee + networkFee;
    estimatedUSDC = (idrAmount - totalFees) / IDR_TO_USDC_RATE;
  } else {
    // Input is in IDR (e-wallet/bank), need to convert to USDC
    idrAmount = inputAmount;
    usdcAmount = idrAmount / IDR_TO_USDC_RATE;
    platformFee = idrAmount * 0.005; // 0.5%
    networkFee = 5000; // Rp 5,000 fixed network fee for IDR
    totalFees = platformFee + networkFee;
    estimatedUSDC = (idrAmount - totalFees) / IDR_TO_USDC_RATE;
  }

  // Save Tab Handlers
  const handleDeposit = async () => {
    if (isNaN(inputAmount) || inputAmount <= 0) {
      setSnackbarMessage('Please enter a valid amount');
      setSnackbarVisible(true);
      return;
    }
    if (!selectedPaymentMethod) {
      setSnackbarMessage('Please select a payment method');
      setSnackbarVisible(true);
      return;
    }

    const paymentMethod = paymentMethods.find((pm) => pm.id === selectedPaymentMethod);
    if (!paymentMethod) return;

    // Check if signature is required
    const needsSignature = requiresSignature(wallet, paymentMethod.id);

    if (needsSignature) {
      // Show signature explanation dialog
      setPendingTransaction({
        amount: estimatedUSDC,
        token: paymentMethod.id,
        type: 'save',
      });
      setSignatureDialogVisible(true);
    } else {
      // Process without signature (custodial or non-crypto)
      await processDeposit();
    }
  };

  const processDeposit = async (signature?: string) => {
    // Simulate the deposit flow
    setLoading(true);
    setTimeout(() => {
      // Allocate deposit across pools based on current mode
      const allocations = allocateDeposit(estimatedUSDC);

      // Add to savings stats (keep for backward compatibility)
      addDeposit(estimatedUSDC, 'portfolio', idrAmount);
      updateStreak();

      // Update main goal progress if exists
      if (mainGoal) {
        console.log('Updating goal progress:', {
          goalId: mainGoal.id,
          currentAmount: mainGoal.currentAmount,
          addingAmount: estimatedUSDC,
          targetAmount: mainGoal.targetAmount,
        });
        updateGoalProgress(mainGoal.id, estimatedUSDC);
      } else {
        console.log('No main goal found to update');
      }

      const poolCount = allocations.length;
      const signatureMsg = signature ? ' (Signed Transaction)' : '';
      const depositMsg = isUSDC
        ? `Successfully deposited ${inputAmount.toFixed(2)} USDC → ${estimatedUSDC.toFixed(2)} USDC across ${poolCount} pools!${signatureMsg}`
        : isIDRX
        ? `Successfully deposited ${formatCompactIDR(inputAmount)} IDRX → ${estimatedUSDC.toFixed(2)} USDC across ${poolCount} pools!${signatureMsg}`
        : `Successfully deposited Rp ${formatIDR(idrAmount)} → ${estimatedUSDC.toFixed(2)} USDC across ${poolCount} pools!${signatureMsg}`;
      setSnackbarMessage(depositMsg);
      setSnackbarVisible(true);
      setAmount('');
      setLoading(false);
    }, 2000);
  };

  const handleSignature = async () => {
    if (!wallet || !pendingTransaction) return;

    setSignatureDialogVisible(false);
    setLoading(true);

    try {
      const result = await requestWalletSignature({
        wallet,
        transaction: {
          ...pendingTransaction,
          timestamp: Date.now(),
        },
      });

      if (result.success) {
        await processDeposit(result.signature);
      } else {
        setSnackbarMessage(result.error || 'Signature request failed');
        setSnackbarVisible(true);
        setLoading(false);
      }
    } catch (error) {
      setSnackbarMessage('Failed to get signature');
      setSnackbarVisible(true);
      setLoading(false);
    }

    setPendingTransaction(null);
  };

  const handleCancelSignature = () => {
    setSignatureDialogVisible(false);
    setPendingTransaction(null);
  };

  // Withdraw Tab Handlers
  const handleWithdraw = () => {
    const withdrawAmt = parseFloat(withdrawAmount);
    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      setSnackbarMessage('Please enter a valid amount');
      setSnackbarVisible(true);
      return;
    }
    if (withdrawAmt > totalStaked) {
      setSnackbarMessage('Insufficient staked balance');
      setSnackbarVisible(true);
      return;
    }
    addToBalance('usdc', withdrawAmt);
    withdraw(withdrawAmt);
    setSnackbarMessage(`Successfully withdrew ${withdrawAmt.toFixed(2)} USDC!`);
    setSnackbarVisible(true);
    setWithdrawAmount('');
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'save', label: 'Save', icon: 'piggy-bank-outline' },
        { key: 'withdraw', label: 'Withdraw', icon: 'cash-minus' },
        { key: 'history', label: 'History', icon: 'history' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key as TabType)}
        >
          <MaterialCommunityIcons
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.key ? '#000000' : '#9CA3AF'}
          />
          <Text
            variant="labelSmall"
            style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSaveTab = () => {
    const allocationStrategy = getAllocationStrategy();

    return (
      <View style={styles.content}>
        {/* Mode Selector */}
        <Card style={styles.modeCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.modeCardTitle}>
              Select Saving Mode
            </Text>
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeOption,
                  isLiteMode && styles.modeOptionActive,
                ]}
                onPress={() => !isLiteMode && toggleMode()}
              >
                <MaterialCommunityIcons
                  name="shield-check"
                  size={24}
                  color={isLiteMode ? '#FFFFFF' : '#6B7280'}
                />
                <View style={styles.modeOptionText}>
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.modeOptionLabel,
                      isLiteMode && styles.modeOptionLabelActive,
                    ]}
                  >
                    Lite Mode
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.modeOptionDescription,
                      isLiteMode && styles.modeOptionDescriptionActive,
                    ]}
                  >
                    Safe & Steady
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeOption,
                  isProMode && styles.modeOptionActive,
                ]}
                onPress={() => !isProMode && toggleMode()}
              >
                <MaterialCommunityIcons
                  name="chart-line"
                  size={24}
                  color={isProMode ? '#FFFFFF' : '#6B7280'}
                />
                <View style={styles.modeOptionText}>
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.modeOptionLabel,
                      isProMode && styles.modeOptionLabelActive,
                    ]}
                  >
                    Pro Mode
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.modeOptionDescription,
                      isProMode && styles.modeOptionDescriptionActive,
                    ]}
                  >
                    High Yield
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Text variant="headlineSmall" style={styles.title}>
          {isLiteMode ? 'Start Saving' : isProMode ? 'Maximize Your Yield' : 'Balanced Growth'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isLiteMode
            ? 'Save securely with stablecoin pools and earn steady returns'
            : isProMode
            ? 'High-yield strategy across multiple DeFi protocols'
            : 'Balanced approach with diversified pool allocation'}
        </Text>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Enter Amount ({inputCurrency})
          </Text>
          <TextInput
            mode="outlined"
            label={`Amount in ${inputCurrency}`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder={isUSDC ? "10.00" : "50000"}
            left={<TextInput.Affix text={currencyPrefix} />}
            style={styles.input}
          />
          <View style={styles.quickAmounts}>
            {isUSDC
              ? [10, 25, 50, 100].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    mode="outlined"
                    compact
                    onPress={() => setAmount(quickAmount.toString())}
                    style={styles.quickButton}
                  >
                    {quickAmount} USDC
                  </Button>
                ))
              : isIDRX
              ? [50000, 100000, 250000, 500000].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    mode="outlined"
                    compact
                    onPress={() => setAmount(quickAmount.toString())}
                    style={styles.quickButton}
                  >
                    {formatCompactIDR(quickAmount)}
                  </Button>
                ))
              : [50000, 100000, 250000, 500000].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    mode="outlined"
                    compact
                    onPress={() => setAmount(quickAmount.toString())}
                    style={styles.quickButton}
                  >
                    {formatCompactIDR(quickAmount)}
                  </Button>
                ))}
          </View>
        </View>

        {/* Conversion Preview - Only for non-USDC payments */}
        {inputAmount > 0 && !isUSDC && (
          <ConversionPreview
            fromAmount={idrAmount}
            fromCurrency="IDR"
            toAmount={estimatedUSDC}
            toCurrency="USDC"
            rate={IDR_TO_USDC_RATE}
            fees={{
              platformFee,
              networkFee,
              total: totalFees,
            }}
          />
        )}

        {/* Allocation Preview */}
        {inputAmount > 0 && estimatedUSDC > 0 && (
          <AllocationPreview amount={estimatedUSDC} strategy={allocationStrategy} />
        )}

        {/* Payment Method Selection */}
        <PaymentMethodSelector
          paymentMethods={paymentMethods}
          selectedId={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
          wallet={wallet}
        />

        {/* Deposit Button */}
        <Button
          mode="contained"
          onPress={handleDeposit}
          disabled={!amount || inputAmount <= 0 || loading}
          loading={loading}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          {loading ? 'Processing...' : isProMode ? 'Deposit & Stake' : 'Save Now'}
        </Button>

        {/* Info Footer */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={20} color={Colors.textSecondary} />
          <Text variant="bodySmall" style={styles.infoText}>
            Your deposit will be automatically distributed across multiple pools based on your {mode} mode allocation strategy. View your portfolio to see detailed allocations.
          </Text>
        </View>
      </View>
    );
  };


  const renderWithdrawTab = () => {
    const bankMethodsForWithdraw = paymentMethods.filter(
      (pm) => pm.type === 'bank' || pm.type === 'ewallet'
    );

    const requiresBankSelection = selectedWithdrawCurrency === 'IDR' || selectedWithdrawCurrency === 'USD';

    const WITHDRAW_CONVERSION_RATES = {
      USDC: 1,
      USD: 1,
      IDR: 15800,
      IDRX: 15800,
    };

    const withdrawAmtNum = parseFloat(withdrawAmount) || 0;
    const convertedWithdrawAmount = withdrawAmtNum * WITHDRAW_CONVERSION_RATES[selectedWithdrawCurrency];

    return (
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

        <BalanceCard
          title="Available to Withdraw"
          amount={totalStaked}
          icon="piggy-bank-outline"
          subtitle={`Principal: $${stats.totalDeposited.toFixed(2)} + Earned: $${stats.totalEarned.toFixed(2)}`}
          color="#7C3AED"
        />

        {/* Currency Selection - Compact horizontal chips */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Select Currency
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScrollView}>
            <View style={styles.currencyChipsContainer}>
              {[
                { key: 'USDC', label: 'USDC', icon: 'currency-usd', color: '#10B981' },
                { key: 'USD', label: 'USD', icon: 'cash-multiple', color: '#3B82F6' },
                { key: 'IDR', label: 'IDR', icon: 'cash', color: '#EF4444' },
                { key: 'IDRX', label: 'IDRX', icon: 'alpha-x-circle', color: '#7C3AED' },
              ].map((currency) => (
                <TouchableOpacity
                  key={currency.key}
                  style={[
                    styles.currencyChip,
                    selectedWithdrawCurrency === currency.key && styles.currencyChipActive,
                  ]}
                  onPress={() => setSelectedWithdrawCurrency(currency.key as any)}
                >
                  <MaterialCommunityIcons
                    name={currency.icon as any}
                    size={20}
                    color={currency.color}
                  />
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.currencyChipLabel,
                      selectedWithdrawCurrency === currency.key && styles.currencyChipLabelActive,
                    ]}
                  >
                    {currency.label}
                  </Text>
                  {selectedWithdrawCurrency === currency.key && (
                    <MaterialCommunityIcons name="check-circle" size={18} color={currency.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Destination Selection */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Withdraw To
          </Text>
          <View style={styles.destinationContainer}>
            <TouchableOpacity
              style={[
                styles.destinationOption,
                withdrawDestination === 'wallet' && styles.destinationOptionActive,
              ]}
              onPress={() => setWithdrawDestination('wallet')}
            >
              <MaterialCommunityIcons
                name="wallet"
                size={24}
                color={withdrawDestination === 'wallet' ? '#FFFFFF' : '#000000'}
              />
              <Text
                variant="titleSmall"
                style={[
                  styles.destinationLabel,
                  withdrawDestination === 'wallet' && styles.destinationLabelActive,
                ]}
              >
                Crypto Wallet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationOption,
                withdrawDestination === 'bank' && styles.destinationOptionActive,
              ]}
              onPress={() => setWithdrawDestination('bank')}
            >
              <MaterialCommunityIcons
                name="bank"
                size={24}
                color={withdrawDestination === 'bank' ? '#FFFFFF' : '#000000'}
              />
              <Text
                variant="titleSmall"
                style={[
                  styles.destinationLabel,
                  withdrawDestination === 'bank' && styles.destinationLabelActive,
                ]}
              >
                Local Bank
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wallet Address Input */}
        {withdrawDestination === 'wallet' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Wallet Address
            </Text>
            <TextInput
              mode="outlined"
              label="Enter wallet address"
              value={walletAddress}
              onChangeText={setWalletAddress}
              placeholder="0x..."
              style={styles.input}
            />
          </View>
        )}

        {/* Bank Details Input */}
        {withdrawDestination === 'bank' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Bank Details
            </Text>
            <TextInput
              mode="outlined"
              label="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              placeholder="e.g., BCA, Mandiri, BNI"
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Account Number"
              value={bankAccountNumber}
              onChangeText={setBankAccountNumber}
              keyboardType="numeric"
              placeholder="Enter account number"
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Withdrawal Amount
          </Text>
          <TextInput
            mode="outlined"
            label={`Amount (${selectedWithdrawCurrency})`}
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            keyboardType="numeric"
            placeholder="0.00"
            right={<TextInput.Affix text={`Max: ${totalStaked.toFixed(2)}`} />}
            style={styles.input}
          />
          {selectedWithdrawCurrency !== 'USDC' && withdrawAmtNum > 0 && (
            <View style={styles.conversionInfo}>
              <MaterialCommunityIcons name="swap-horizontal" size={20} color="#6B7280" />
              <Text variant="bodyMedium" style={styles.conversionText}>
                {selectedWithdrawCurrency === 'USD' && `≈ $${convertedWithdrawAmount.toFixed(2)}`}
                {selectedWithdrawCurrency === 'IDR' && `≈ Rp ${convertedWithdrawAmount.toLocaleString('id-ID')}`}
                {selectedWithdrawCurrency === 'IDRX' && `≈ ${convertedWithdrawAmount.toFixed(2)} IDRX`}
              </Text>
            </View>
          )}
          <View style={styles.quickAmounts}>
            <Button
              mode="outlined"
              compact
              onPress={() => setWithdrawAmount((totalStaked * 0.25).toFixed(2))}
              disabled={totalStaked === 0}
              style={styles.quickButton}
            >
              25%
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setWithdrawAmount((totalStaked * 0.5).toFixed(2))}
              disabled={totalStaked === 0}
              style={styles.quickButton}
            >
              50%
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setWithdrawAmount((totalStaked * 0.75).toFixed(2))}
              disabled={totalStaked === 0}
              style={styles.quickButton}
            >
              75%
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setWithdrawAmount(totalStaked.toFixed(2))}
              disabled={totalStaked === 0}
              style={styles.quickButton}
            >
              Max
            </Button>
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="information-outline" size={24} color="#000000" />
              <Text variant="titleSmall" style={styles.infoTitle}>
                Withdrawal Info
              </Text>
            </View>
            {selectedWithdrawCurrency === 'USDC' ? (
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
            ) : selectedWithdrawCurrency === 'USD' ? (
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
              </>
            ) : selectedWithdrawCurrency === 'IDR' ? (
              <>
                <Text variant="bodySmall" style={styles.infoText}>
                  • Funds will arrive in 1-2 business days
                </Text>
                <Text variant="bodySmall" style={styles.infoText}>
                  • Automatically converted from USDC to IDR
                </Text>
                <Text variant="bodySmall" style={styles.infoText}>
                  • Rate: 1 USDC ≈ Rp {WITHDRAW_CONVERSION_RATES.IDR.toLocaleString('id-ID')}
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
                  • Rate: 1 USDC ≈ {WITHDRAW_CONVERSION_RATES.IDRX.toLocaleString('id-ID')} IDRX
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

        <Button
          mode="contained"
          onPress={handleWithdraw}
          disabled={
            !withdrawAmount ||
            parseFloat(withdrawAmount) <= 0 ||
            totalStaked === 0 ||
            (withdrawDestination === 'wallet' && !walletAddress) ||
            (withdrawDestination === 'bank' && (!bankAccountNumber || !bankName))
          }
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          Withdraw
        </Button>
      </View>
    );
  };

  const renderHistoryTab = () => (
    <View style={styles.content}>
      <TransactionHistoryList transactions={transactions} />
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {renderTabBar()}
        <ScrollView style={styles.scrollView}>
          {activeTab === 'save' && renderSaveTab()}
          {activeTab === 'withdraw' && renderWithdrawTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </ScrollView>
      </View>

      {/* Signature Request Dialog */}
      <Portal>
        <Dialog visible={signatureDialogVisible} onDismiss={handleCancelSignature}>
          <Dialog.Icon icon="shield-lock-outline" size={48} />
          <Dialog.Title style={styles.dialogTitle}>Signature Required</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              {pendingTransaction &&
                getSignatureExplanation(pendingTransaction.token.toUpperCase())}
            </Text>
            <View style={styles.transactionDetails}>
              <MaterialCommunityIcons name="information-outline" size={20} color="#6B7280" />
              <Text variant="bodySmall" style={styles.detailsText}>
                Amount: {pendingTransaction?.amount.toFixed(4)}{' '}
                {pendingTransaction?.token.toUpperCase()}
              </Text>
            </View>
            <View style={styles.securityNote}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" />
              <Text variant="bodySmall" style={styles.securityText}>
                Your private keys never leave your wallet
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelSignature}>Cancel</Button>
            <Button mode="contained" onPress={handleSignature}>
              Sign Transaction
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000000',
  },
  tabLabel: {
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 11,
  },
  activeTabLabel: {
    color: '#000000',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  modeCard: {
    marginBottom: 20,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  modeCardTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  modeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  modeOptionActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  modeOptionText: {
    flex: 1,
  },
  modeOptionLabel: {
    fontWeight: 'bold',
    color: '#000000',
  },
  modeOptionLabelActive: {
    color: '#FFFFFF',
  },
  modeOptionDescription: {
    color: '#6B7280',
    marginTop: 2,
  },
  modeOptionDescriptionActive: {
    color: '#D1D5DB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#000000',
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
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
  currencyScrollView: {
    marginHorizontal: -4,
    marginBottom: 4,
  },
  currencyChipsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  currencyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  currencyChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencyChipLabel: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: 15,
  },
  currencyChipLabelActive: {
    fontWeight: '700',
    color: '#000000',
  },
  destinationContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  destinationOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  destinationOptionActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  destinationLabel: {
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  destinationLabelActive: {
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  changeButton: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#000000',
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
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
  cardTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#6B7280',
    marginBottom: 16,
  },
  mintGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mintButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#000000',
  },
  mintButtonContent: {
    paddingVertical: 8,
  },
  ethButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: '#6B7280',
    lineHeight: 20,
  },
  autoStakeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  autoStakeInfo: {
    flex: 1,
    marginRight: 16,
  },
  autoStakeTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  autoStakeSubtitle: {
    color: '#6B7280',
  },
  infoSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
    marginHorizontal: 4,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  note: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  autoOptimizedCard: {
    marginVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    ...Shadows.card,
  },
  autoOptimizedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  autoOptimizedContent: {
    flex: 1,
  },
  autoOptimizedTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  autoOptimizedSubtitle: {
    color: '#6B7280',
  },
  selectedProtocolBadge: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  selectedProtocolText: {
    color: '#6B7280',
  },
  apyText: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogText: {
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailsText: {
    flex: 1,
    color: '#374151',
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
  },
  securityText: {
    flex: 1,
    color: '#059669',
  },
});
