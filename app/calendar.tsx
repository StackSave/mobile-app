import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSavings } from '../contexts/SavingsContext';
import { DailyGrowth } from '../types';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CalendarScreen() {
  const { stats } = useSavings();
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getGrowthDataForDate = (date: Date): DailyGrowth | null => {
    return (
      stats.allTimeGrowthData.find((data) => {
        const dataDate = new Date(data.date);
        return (
          dataDate.getDate() === date.getDate() &&
          dataDate.getMonth() === date.getMonth() &&
          dataDate.getFullYear() === date.getFullYear()
        );
      }) || null
    );
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <View style={styles.emptyDay} />
        </View>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const growthData = getGrowthDataForDate(date);
      const isToday =
        date.toDateString() === new Date().toDateString();

      days.push(
        <View key={day} style={styles.dayCell}>
          <View
            style={[
              styles.dayContent,
              isToday && styles.todayBorder,
              growthData?.hasDeposit && styles.activeDayContent,
            ]}
          >
            <Text variant="labelSmall" style={styles.dayNumber}>
              {day}
            </Text>
            {growthData?.hasDeposit && (
              <>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={14}
                  color={growthData.growthPercentage >= 0 ? '#10B981' : '#EF4444'}
                />
                <Text
                  variant="labelSmall"
                  style={[
                    styles.percentage,
                    {
                      color:
                        growthData.growthPercentage >= 0 ? '#10B981' : '#EF4444',
                    },
                  ]}
                >
                  {growthData.growthPercentage >= 0 ? '+' : ''}
                  {growthData.growthPercentage.toFixed(1)}%
                </Text>
              </>
            )}
          </View>
        </View>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          iconColor="#000000"
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Streak Calendar
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <IconButton
            icon="chevron-left"
            size={28}
            onPress={goToPreviousMonth}
            iconColor="#000000"
          />
          <Text variant="titleLarge" style={styles.monthText}>
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <IconButton
            icon="chevron-right"
            size={28}
            onPress={goToNextMonth}
            iconColor="#000000"
          />
        </View>

        {/* Days of Week Header */}
        <View style={styles.daysOfWeekContainer}>
          {DAYS_OF_WEEK.map((day) => (
            <View key={day} style={styles.dayOfWeekCell}>
              <Text variant="labelSmall" style={styles.dayOfWeekText}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>{renderCalendarDays()}</View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text variant="titleSmall" style={styles.legendTitle}>
            Legend
          </Text>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
            <Text variant="bodySmall" style={styles.legendText}>
              Day with positive growth
            </Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#EF4444" />
            <Text variant="bodySmall" style={styles.legendText}>
              Day with negative growth
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendCircle, { borderColor: '#0052FF' }]} />
            <Text variant="bodySmall" style={styles.legendText}>
              Today
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: '#000000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayOfWeekText: {
    fontWeight: 'bold',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 2,
  },
  emptyDay: {
    flex: 1,
  },
  dayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 4,
  },
  activeDayContent: {
    backgroundColor: '#F3F4F6',
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  dayNumber: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  percentage: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  legendText: {
    color: '#6B7280',
  },
  legendCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
  },
});
