import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StreakBadgeProps {
  currentStreak: number;
  nextMilestone?: number;
}

export default function StreakBadge({
  currentStreak,
  nextMilestone = 7,
}: StreakBadgeProps) {
  const progress = Math.min(currentStreak / nextMilestone, 1);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.container}>
          <MaterialCommunityIcons name="fire" size={40} color="#F59E0B" />
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="titleMedium" style={styles.title}>
                {currentStreak} Day Streak!
              </Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                Keep it going!
              </Text>
            </View>
            <ProgressBar
              progress={progress}
              color="#F59E0B"
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.milestoneText}>
              {currentStreak}/{nextMilestone} days to next milestone
            </Text>
          </View>
        </View>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  milestoneText: {
    color: '#9CA3AF',
    marginTop: 4,
  },
});
