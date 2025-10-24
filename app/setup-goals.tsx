import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text, TextInput, RadioButton } from 'react-native-paper';
import { router } from 'expo-router';
import { useGoals } from '../contexts/GoalsContext';
import { formatIDR } from '../utils/formatters';

export default function SetupGoalsScreen() {
  const { addGoal } = useGoals();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [timeFrameDays, setTimeFrameDays] = useState(90); // Default 90 days (3 months)
  const [timeFrameError, setTimeFrameError] = useState('');

  const getEndDate = () => {
    const now = new Date();
    return new Date(now.getTime() + timeFrameDays * 24 * 60 * 60 * 1000);
  };

  const handleTimeFrameChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setTimeFrameDays(numValue);
      if (numValue < 90) {
        setTimeFrameError('Minimum timeframe is 90 days');
      } else {
        setTimeFrameError('');
      }
    } else if (value === '') {
      setTimeFrameDays(0);
      setTimeFrameError('');
    }
  };

  const handleContinue = () => {
    if (!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0 || timeFrameDays < 90) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields. Minimum timeframe is 90 days.');
      return;
    }

    // Add the goal
    addGoal({
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      currency: currency,
      frequency,
      startDate: new Date(),
      endDate: getEndDate(),
      isMainGoal: true, // First goal is always main goal
    });

    // Navigate to login page to save progress
    router.push('/login');
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

      {/* Currency Selection */}
      <View style={styles.inputGroup}>
        <Text variant="labelLarge" style={styles.label}>
          Currency *
        </Text>
        <RadioButton.Group onValueChange={(value) => setCurrency(value as 'IDR' | 'USD')} value={currency}>
          <View style={styles.radioRow}>
            <View style={styles.radioOption}>
              <RadioButton value="IDR" />
              <Text variant="bodyMedium">IDR (Rp)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="USD" />
              <Text variant="bodyMedium">USD ($)</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      {/* Target Amount */}
      <View style={styles.inputGroup}>
        <Text variant="labelLarge" style={styles.label}>
          Target Amount *
        </Text>
        <TextInput
          mode="outlined"
          placeholder="0"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          left={<TextInput.Affix text={currency === 'IDR' ? 'Rp' : '$'} />}
          style={styles.input}
        />
      </View>



      {/* Time Frame */}
      <View style={styles.inputGroup}>
        <Text variant="labelLarge" style={styles.label}>
          Time Frame (Days) *
        </Text>
        <TextInput
          mode="outlined"
          placeholder="e.g., 90, 180, 365"
          value={timeFrameDays > 0 ? timeFrameDays.toString() : ''}
          onChangeText={handleTimeFrameChange}
          keyboardType="number-pad"
          style={styles.input}
          error={!!timeFrameError}
        />
        {timeFrameError ? (
          <Text variant="bodySmall" style={styles.errorText}>
            {timeFrameError}
          </Text>
        ) : (
          timeFrameDays > 0 && (
            <Text variant="bodySmall" style={styles.helperText}>
              {timeFrameDays} days ≈ {Math.floor(timeFrameDays / 30)} months {timeFrameDays % 30} days
            </Text>
          )
        )}
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
        disabled={!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0 || timeFrameDays < 90}
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
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  helperText: {
    color: '#6B7280',
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
  },
});
