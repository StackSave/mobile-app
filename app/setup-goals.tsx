import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, RadioButton, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import { useGoals } from '../contexts/GoalsContext';
import { formatIDR } from '../utils/formatters';

export default function SetupGoalsScreen() {
  const { addGoal } = useGoals();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [timeFrame, setTimeFrame] = useState<'1_month' | '3_months' | '6_months' | '1_year'>('3_months');
  const [showTimeFrameMenu, setShowTimeFrameMenu] = useState(false);

  const getEndDate = () => {
    const now = new Date();
    switch (timeFrame) {
      case '1_month':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case '3_months':
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      case '6_months':
        return new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
      case '1_year':
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    }
  };

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case '1_month':
        return '1 Month';
      case '3_months':
        return '3 Months';
      case '6_months':
        return '6 Months';
      case '1_year':
        return '1 Year';
      default:
        return '3 Months';
    }
  };

  const handleContinue = () => {
    if (!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Add the goal
    addGoal({
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      frequency,
      startDate: new Date(),
      endDate: getEndDate(),
      isMainGoal: true, // First goal is always main goal
    });

    // Navigate to home (wallet already connected)
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.emoji}>
          💰
        </Text>
        <Text variant="headlineMedium" style={styles.title}>
          What are you saving for?
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Set your first savings goal to get started
        </Text>
      </View>

      {/* Goal Title */}
      <View style={styles.inputGroup}>
        <Text variant="labelLarge" style={styles.label}>
          Goal Name *
        </Text>
        <TextInput
          mode="outlined"
          placeholder="e.g., Emergency Fund, New Phone"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      {/* Target Amount */}
      <View style={styles.inputGroup}>
        <Text variant="labelLarge" style={styles.label}>
          Target Amount (IDR) *
        </Text>
        <TextInput
          mode="outlined"
          placeholder="0"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          left={<TextInput.Affix text="Rp" />}
          style={styles.input}
        />
      </View>



      {/* Time Frame */}
      <View style={styles.inputGroup}>
        <Text variant="labelLarge" style={styles.label}>
          Time Frame *
        </Text>
        <Menu
          visible={showTimeFrameMenu}
          onDismiss={() => setShowTimeFrameMenu(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setShowTimeFrameMenu(true)}
              style={styles.dateButton}
              contentStyle={styles.dateButtonContent}
            >
              {getTimeFrameLabel()}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setTimeFrame('1_month');
              setShowTimeFrameMenu(false);
            }}
            title="1 Month"
          />
          <Menu.Item
            onPress={() => {
              setTimeFrame('3_months');
              setShowTimeFrameMenu(false);
            }}
            title="3 Months"
          />
          <Menu.Item
            onPress={() => {
              setTimeFrame('6_months');
              setShowTimeFrameMenu(false);
            }}
            title="6 Months"
          />
          <Menu.Item
            onPress={() => {
              setTimeFrame('1_year');
              setShowTimeFrameMenu(false);
            }}
            title="1 Year"
          />
        </Menu>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text variant="bodySmall" style={styles.infoText}>
          💡 Tip: Start with a realistic goal. You can always add more goals later!
        </Text>
      </View>

      {/* Continue Button */}
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.continueButton}
        contentStyle={styles.buttonContent}
        disabled={!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0}
      >
        Continue
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dateButton: {
    borderColor: '#E5E7EB',
  },
  dateButtonContent: {
    paddingVertical: 8,
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    color: '#6B7280',
    lineHeight: 20,
  },
  continueButton: {
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
