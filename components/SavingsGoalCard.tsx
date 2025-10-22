import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SavingsGoal } from '../types';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  isMainGoal?: boolean;
}

export default function SavingsGoalCard({
  goal,
  isMainGoal = false,
}: SavingsGoalCardProps) {
  const progress = goal.currentAmount / goal.targetAmount;
  const percentageComplete = Math.round(progress * 100);

  console.log('SavingsGoalCard render:', {
    goalId: goal.id,
    title: goal.title,
    currentAmount: goal.currentAmount,
    targetAmount: goal.targetAmount,
    progress,
    percentageComplete,
  });

  // Calculate days remaining
  const now = new Date();
  const endDate = new Date(goal.endDate);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getTimeRemainingText = () => {
    if (daysRemaining < 0) return 'Overdue';
    if (daysRemaining === 0) return 'Due today';
    if (daysRemaining === 1) return '1 day left';
    if (daysRemaining < 7) return `${daysRemaining} days left`;
    if (daysRemaining < 30) {
      const weeks = Math.floor(daysRemaining / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} left`;
    }
    const months = Math.floor(daysRemaining / 30);
    return `${months} month${months > 1 ? 's' : ''} left`;
  };

  if (isMainGoal) {
    return (
      <Card style={styles.mainCard}>
        <Card.Content>
          <View style={styles.mainHeader}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons
                name="flag-checkered"
                size={28}
                color="#000000"
              />
              <View style={styles.titleContent}>
                <Text variant="titleLarge" style={styles.mainTitle}>
                  {goal.title}
                </Text>
                <Text variant="bodySmall" style={styles.frequency}>
                  {goal.frequency.charAt(0).toUpperCase() + goal.frequency.slice(1)} Goal
                </Text>
              </View>
            </View>
            <View style={styles.mainBadge}>
              <Text variant="labelSmall" style={styles.mainBadgeText}>
                MAIN
              </Text>
            </View>
          </View>

          <View style={styles.mainStats}>
            <View style={styles.mainStatItem}>
              <Text variant="displaySmall" style={styles.percentageText}>
                {percentageComplete}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Complete
              </Text>
            </View>
            <View style={styles.mainStatDivider} />
            <View style={styles.mainStatItem}>
              <Text variant="headlineSmall" style={styles.timeText}>
                {getTimeRemainingText()}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Remaining
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={progress}
            color="#000000"
            style={styles.mainProgressBar}
          />
        </Card.Content>
      </Card>
    );
  }

  // Sub-goal card (compact)
  return (
    <Card style={styles.subCard}>
      <Card.Content>
        <View style={styles.subHeader}>
          <View style={styles.subTitleRow}>
            <MaterialCommunityIcons
              name="target"
              size={20}
              color="#6B7280"
            />
            <Text variant="titleMedium" style={styles.subTitle}>
              {goal.title}
            </Text>
          </View>
          <Text variant="labelLarge" style={styles.subPercentage}>
            {percentageComplete}%
          </Text>
        </View>

        <ProgressBar
          progress={progress}
          color="#000000"
          style={styles.subProgressBar}
        />

        <View style={styles.subFooter}>
          <Text variant="bodySmall" style={styles.subTime}>
            {getTimeRemainingText()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Main Goal Card Styles
  mainCard: {
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
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleContent: {
    flex: 1,
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  frequency: {
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  mainBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mainBadgeText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 10,
  },
  mainStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mainStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  percentageText: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  timeText: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
  },
  mainProgressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontWeight: '600',
    color: '#000000',
  },
  remainingText: {
    color: '#6B7280',
  },

  // Sub-Goal Card Styles
  subCard: {
    marginVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  subTitle: {
    fontWeight: '600',
    color: '#000000',
  },
  subPercentage: {
    fontWeight: 'bold',
    color: '#000000',
  },
  subProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  subFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subAmount: {
    color: '#6B7280',
  },
  subTime: {
    color: '#9CA3AF',
  },
});
