import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppMode } from '../types';

interface ModeComparisonCardProps {
  currentMode: AppMode;
  onModeSelect: (mode: AppMode) => void;
}

const MODE_INFO = {
  lite: {
    title: 'Lite Mode',
    icon: 'shield-check',
    color: '#10B981',
    dailyAPY: '0.02-0.05%',
    yearlyAPY: '7-15%',
    risk: 'Low',
    description: '100% stablecoin pools - safest option',
    allocation: 'Stablecoin only',
  },
  pro: {
    title: 'Pro Mode',
    icon: 'rocket-launch',
    color: '#8B5CF6',
    dailyAPY: '0.1-0.3%+',
    yearlyAPY: '30-100%+',
    risk: 'High',
    description: 'Maximum yield with customizable strategy',
    allocation: '30% Stable, 70% Aggressive',
  },
};

export default function ModeComparisonCard({ currentMode, onModeSelect }: ModeComparisonCardProps) {
  const modes: AppMode[] = ['lite', 'pro'];

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Choose Your Investment Mode
        </Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          Select a mode that matches your risk tolerance and return expectations
        </Text>

        <View style={styles.modesContainer}>
          {modes.map((mode) => {
            const info = MODE_INFO[mode];
            const isSelected = mode === currentMode;

            return (
              <TouchableOpacity
                key={mode}
                onPress={() => onModeSelect(mode)}
                style={[
                  styles.modeCard,
                  isSelected && { borderColor: info.color, borderWidth: 2 },
                ]}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: info.color }]}>
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  </View>
                )}

                <View style={[styles.iconContainer, { backgroundColor: `${info.color}20` }]}>
                  <MaterialCommunityIcons name={info.icon as any} size={32} color={info.color} />
                </View>

                <Text variant="titleSmall" style={styles.modeTitle}>
                  {info.title}
                </Text>

                <View style={[styles.riskBadge, { backgroundColor: `${info.color}15` }]}>
                  <Text style={[styles.riskText, { color: info.color }]}>{info.risk} Risk</Text>
                </View>

                <View style={styles.apySection}>
                  <Text variant="bodySmall" style={styles.apyLabel}>
                    Expected APY
                  </Text>
                  <Text variant="titleMedium" style={[styles.apyValue, { color: info.color }]}>
                    {info.yearlyAPY}
                  </Text>
                  <Text variant="bodySmall" style={styles.dailyAPY}>
                    ({info.dailyAPY} daily)
                  </Text>
                </View>

                <View style={styles.allocationSection}>
                  <Text variant="bodySmall" style={styles.allocationLabel}>
                    Allocation Strategy
                  </Text>
                  <Text variant="bodySmall" style={styles.allocationValue}>
                    {info.allocation}
                  </Text>
                </View>

                <Text variant="bodySmall" style={styles.description}>
                  {info.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={20} color="#6B7280" />
          <Text variant="bodySmall" style={styles.infoText}>
            Switching modes only affects new deposits. Your existing allocations will remain unchanged.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6B7280',
    marginBottom: 16,
  },
  modesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modeTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    textAlign: 'center',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '600',
  },
  apySection: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  apyLabel: {
    color: '#6B7280',
    marginBottom: 4,
  },
  apyValue: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dailyAPY: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  allocationSection: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  allocationLabel: {
    color: '#6B7280',
    marginBottom: 2,
    fontSize: 10,
  },
  allocationValue: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'center',
  },
  description: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 11,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: '#6B7280',
    lineHeight: 18,
  },
});
