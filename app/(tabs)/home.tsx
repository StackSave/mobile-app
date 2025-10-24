import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, Card, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSavings } from '../../contexts/SavingsContext';
import { useStreak } from '../../contexts/StreakContext';
import { useGoals } from '../../contexts/GoalsContext';
import { usePortfolio } from '../../contexts/PortfolioContext';
import StreakBadge from '../../components/StreakBadge';
import DailyProgressWidget from '../../components/DailyProgressWidget';
import SavingsGoalCard from '../../components/SavingsGoalCard';
import PoolCard from '../../components/PoolCard';
import HomeHeader from '../../components/HomeHeader';
import { router } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const { wallet, addToBalance } = useWallet();
  const { stats } = useSavings();
  const { streak } = useStreak();
  const { mainGoal, subGoals } = useGoals();
  const { poolAllocations, portfolioPerformance } = usePortfolio();
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  console.log('HomeScreen render:', {
    hasMainGoal: !!mainGoal,
    mainGoalTitle: mainGoal?.title,
    subGoalsCount: subGoals.length,
  });

  const { totalValue, totalEarnings, averageAPY } = portfolioPerformance;
  const topPools = poolAllocations.slice(0, 3); // Show top 3 pools only

  const handleFaucet = async () => {
    setFaucetLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Add 100 USDC and 1,000,000 IDRX (equivalent to ~63 USDC)
      addToBalance('usdc', 100);
      addToBalance('idrx', 1000000);
      setSnackbarMessage('Success! Added 100 USDC and 1,000,000 IDRX to your wallet');
      setSnackbarVisible(true);
      setFaucetLoading(false);
    }, 1500);
  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        {/* Weekly Progress Widget - Duolingo Style */}
        <DailyProgressWidget
          weeklyGrowthData={stats.weeklyGrowthData}
          weeklyTotalGrowth={stats.weeklyTotalGrowth}
          weeklyTotalEarnings={stats.weeklyTotalEarnings}
          streak={streak.currentStreak}
        />

        {/* Savings Goals Section */}
        <View style={styles.goalsSection}>
          <View style={styles.goalsSectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Savings Goals
            </Text>
            <Button
              mode="text"
              compact
              onPress={() => router.push('/add-goal')}
              style={styles.addGoalButton}
            >
              + Add Goal
            </Button>
          </View>

          {/* Main Goal */}
          {mainGoal && <SavingsGoalCard goal={mainGoal} isMainGoal />}

          {/* Sub Goals */}
          {subGoals.length > 0 && (
            <View style={styles.subGoalsContainer}>
              <Text variant="titleMedium" style={styles.subGoalsTitle}>
                Other Goals
              </Text>
              {subGoals.map((goal) => (
                <SavingsGoalCard key={goal.id} goal={goal} />
              ))}
            </View>
          )}
        </View>

        {/* Faucet Section */}
        <Card style={styles.faucetCard}>
          <Card.Content>
            <View style={styles.faucetHeader}>
              <MaterialCommunityIcons name="water-pump" size={32} color="#10B981" />
              <View style={styles.faucetHeaderText}>
                <Text variant="titleMedium" style={styles.faucetTitle}>
                  Test Faucet
                </Text>
                <Text variant="bodySmall" style={styles.faucetSubtitle}>
                  Get free test tokens to try the app
                </Text>
              </View>
            </View>

            <View style={styles.faucetAmounts}>
              <View style={styles.faucetAmountItem}>
                <MaterialCommunityIcons name="currency-usd" size={20} color="#10B981" />
                <Text variant="bodyMedium" style={styles.faucetAmountText}>
                  100 USDC
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.faucetPlus}>+</Text>
              <View style={styles.faucetAmountItem}>
                <MaterialCommunityIcons name="alpha-x-circle" size={20} color="#7C3AED" />
                <Text variant="bodyMedium" style={styles.faucetAmountText}>
                  1,000,000 IDRX
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleFaucet}
              loading={faucetLoading}
              disabled={faucetLoading}
              style={styles.faucetButton}
              icon="water"
            >
              {faucetLoading ? 'Claiming...' : 'Claim Test Tokens'}
            </Button>
          </Card.Content>
        </Card>

        {/* Streak Badge */}
        {streak.currentStreak > 0 && (
          <StreakBadge
            currentStreak={streak.currentStreak}
            nextMilestone={
              streak.milestones.find((m) => !m.achieved)?.days || 100
            }
          />
        )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  goalsSection: {
    marginBottom: 24,
  },
  goalsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  addGoalButton: {
    margin: 0,
  },
  subGoalsContainer: {
    marginTop: 16,
  },
  subGoalsTitle: {
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  portfolioSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    margin: 0,
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    color: '#9CA3AF',
    marginBottom: 8,
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  summaryMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricText: {
    flex: 1,
  },
  metricLabel: {
    color: '#9CA3AF',
    marginBottom: 2,
  },
  metricValue: {
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  poolsTitle: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  viewFullPortfolioButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  faucetCard: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  faucetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  faucetHeaderText: {
    flex: 1,
  },
  faucetTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  faucetSubtitle: {
    color: '#6B7280',
  },
  faucetAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  faucetAmountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  faucetAmountText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  faucetPlus: {
    color: '#6B7280',
    fontWeight: 'bold',
  },
  faucetButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
});
