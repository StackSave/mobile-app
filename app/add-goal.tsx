import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text, TextInput, RadioButton, Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useGoals } from '../contexts/GoalsContext';

export default function AddGoalScreen() {
  const { addGoal, mainGoal } = useGoals();

  console.log('AddGoalScreen render, mainGoal exists:', !!mainGoal);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [timeFrameDays, setTimeFrameDays] = useState(90); // Default 90 days (3 months)
  const [timeFrameError, setTimeFrameError] = useState('');
  const [isMainGoal, setIsMainGoal] = useState(!mainGoal); // If no main goal exists, default to main goal

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

  const handleSave = () => {
    console.log('handleSave called');
    console.log('Form values:', { title, targetAmount, timeFrameDays, currency, isMainGoal });

    if (!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0 || timeFrameDays < 90) {
      console.log('Validation failed');
      Alert.alert('Incomplete Form', 'Please fill in all required fields. Minimum timeframe is 90 days.');
      return;
    }

    try {
      console.log('Adding goal...');
      // Add the goal
      addGoal({
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        currency: currency,
        frequency,
        startDate: new Date(),
        endDate: getEndDate(),
        isMainGoal: isMainGoal,
      });

      console.log('Goal added, navigating back...');
      // Navigate back immediately after adding
      router.back();
    } catch (error) {
      console.error('Error adding goal:', error);
      Alert.alert('Error', 'Failed to add goal. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Add New Goal" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.emoji}>
            🎯
          </Text>
          <Text variant="headlineMedium" style={styles.title}>
            Create a New Goal
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Set a new savings goal to achieve
          </Text>
        </View>

        {/* Goal Title */}
        <View style={styles.inputGroup}>
          <Text variant="labelLarge" style={styles.label}>
            Goal Name *
          </Text>
          <TextInput
            mode="outlined"
            placeholder="e.g., Vacation Fund, New Laptop"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>

        {/* Goal Type */}
        {mainGoal && (
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Goal Type *
            </Text>
            <RadioButton.Group onValueChange={(value) => setIsMainGoal(value === 'main')} value={isMainGoal ? 'main' : 'sub'}>
              <View style={styles.radioRow}>
                <View style={styles.radioOption}>
                  <RadioButton value="main" />
                  <View>
                    <Text variant="bodyMedium">Main Goal</Text>
                    <Text variant="bodySmall" style={styles.radioDescription}>
                      Replace current main goal
                    </Text>
                  </View>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="sub" />
                  <View>
                    <Text variant="bodyMedium">Sub Goal</Text>
                    <Text variant="bodySmall" style={styles.radioDescription}>
                      Add as additional goal
                    </Text>
                  </View>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        )}

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
            💡 Tip: Set realistic goals that motivate you to save consistently!
          </Text>
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
          disabled={!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0 || timeFrameDays < 90}
        >
          Add Goal
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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
  radioDescription: {
    color: '#9CA3AF',
    fontSize: 12,
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
  saveButton: {
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
