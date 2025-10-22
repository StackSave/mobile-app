import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
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

export default function HomeScreen() {
  const { wallet } = useWallet();
  const { stats } = useSavings();
  const { streak } = useStreak();
  const { mainGoal, subGoals } = useGoals();
  const { poolAllocations, portfolioPerformance } = usePortfolio();

  const { totalValue, totalEarnings, averageAPY } = portfolioPerformance;
  const topPools = poolAllocations.slice(0, 3); // Show top 3 pools only

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        onSearchPress={() => {}}
        notificationCount={3}
      />

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
              onPress={() => {}}
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


        {/* Streak Badge */}
        {streak.currentStreak > 0 && (
          <StreakBadge
            currentStreak={streak.currentStreak}
            nextMilestone={
              streak.milestones.find((m) => !m.achieved)?.days || 100
            }
          />
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => router.push('/(tabs)/save')}
              style={styles.actionButton}
            >
              Save Now
            </Button>
            <Button
              mode="outlined"
              icon="cash-minus"
              onPress={() => router.push('/(tabs)/withdraw')}
              style={styles.actionButton}
            >
              Withdraw
            </Button>
          </View>
        </View>
        </View>
      </ScrollView>
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
  actionsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
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
});
