import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PoolType } from '../types';

interface AllocationSliderProps {
  poolType: PoolType;
  percentage: number;
  onValueChange: (value: number) => void;
  color: string;
  label: string;
  icon: string;
}

export default function AllocationSlider({
  poolType,
  percentage,
  onValueChange,
  color,
  label,
  icon,
}: AllocationSliderProps) {
  const handleIncrement = (amount: number) => {
    const newValue = Math.min(100, Math.max(0, percentage + amount));
    onValueChange(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons name={icon as any} size={20} color={color} />
          <Text variant="titleSmall" style={styles.label}>
            {label}
          </Text>
        </View>
        <View style={[styles.percentageBadge, { backgroundColor: `${color}20` }]}>
          <Text variant="titleMedium" style={[styles.percentageText, { color }]}>
            {percentage}%
          </Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.decrementButton]}
          onPress={() => handleIncrement(-5)}
          disabled={percentage === 0}
        >
          <MaterialCommunityIcons
            name="minus"
            size={20}
            color={percentage === 0 ? '#D1D5DB' : color}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percentage}%`, backgroundColor: color },
              ]}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, styles.incrementButton]}
          onPress={() => handleIncrement(5)}
          disabled={percentage === 100}
        >
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={percentage === 100 ? '#D1D5DB' : color}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.quickButtons}>
        {[0, 25, 50, 75, 100].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.quickButton,
              percentage === value && { backgroundColor: `${color}20` },
            ]}
            onPress={() => onValueChange(value)}
          >
            <Text
              variant="bodySmall"
              style={[
                styles.quickButtonText,
                percentage === value && { color, fontWeight: 'bold' },
              ]}
            >
              {value}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
    color: '#000000',
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  percentageText: {
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {},
  incrementButton: {},
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#6B7280',
    fontSize: 11,
  },
});
