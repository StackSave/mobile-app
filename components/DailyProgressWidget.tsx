import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DailyGrowth } from '../types';
import BlockchainCube from './BlockchainCube';

interface DailyProgressWidgetProps {
  weeklyGrowthData: DailyGrowth[];
  weeklyTotalGrowth: number;
  weeklyTotalEarnings: number;
  streak?: number;
}

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function DailyProgressWidget({
  weeklyGrowthData,
  weeklyTotalGrowth,
  weeklyTotalEarnings,
  streak = 0,
}: DailyProgressWidgetProps) {
  const today = new Date();
  const todayDay = today.getDay(); // 0 = Sunday, 6 = Saturday

  // Build 5-day progress starting from actual deposits
  const buildFiveDayProgress = () => {
    const depositDays = weeklyGrowthData.filter((d) => d.hasDeposit);
    const result = [...depositDays];

    // Fill remaining slots with empty days up to 5
    while (result.length < 5) {
      result.push({
        date: new Date(),
        growthPercentage: 0,
        earnings: 0,
        hasDeposit: false,
      });
    }

    return result.slice(0, 5); // Show only first 5
  };

  const fiveDayProgress = buildFiveDayProgress();

  const handlePress = () => {
    router.push('/calendar');
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.mainContainer}>
            {/* Left side - Day circles */}
            <View style={styles.leftSection}>
              {/* Streak text */}
              <View style={styles.streakContainer}>
                <MaterialCommunityIcons name="fire" size={20} color="#F59E0B" />
                <Text variant="titleMedium" style={styles.streakText}>
                  {streak} Day Streak
                </Text>
              </View>

              <View style={styles.daysContainer}>
                {fiveDayProgress.map((dayData, index) => {
                  const hasActivity = dayData.hasDeposit;
                  const dayNumber = index + 1;

                  // Duolingo-style coloring: green if completed, gray if not
                  const circleColor = hasActivity ? '#10B981' : '#E5E7EB';

                  return (
                    <View key={index} style={styles.dayContainer}>
                      <View
                        style={[
                          styles.circle,
                          { backgroundColor: circleColor },
                        ]}
                      >
                        {hasActivity && (
                          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                        )}
                      </View>
                      <Text variant="labelSmall" style={styles.dayLabel}>
                        {hasActivity ? `D${dayNumber}` : '-'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Right side - 3D Blockchain Cube */}
            <View style={styles.rightSection}>
              <BlockchainCube />
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  leftSection: {
    flex: 1,
    gap: 12,
  },
  rightSection: {
    marginLeft: 16,
    marginRight: 15,
    alignSelf: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 4,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  dayLabel: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  streakText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});
