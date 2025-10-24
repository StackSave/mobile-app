import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMode } from '../contexts/ModeContext';
import { STRATEGY_TEMPLATES } from '../constants/strategyTemplates';
import StrategyTemplateCard from '../components/StrategyTemplateCard';
import AllocationSlider from '../components/AllocationSlider';
import { AllocationStrategy, PoolType } from '../types';

const POOL_CONFIG = {
  stablecoin: { label: 'Stablecoin', color: '#10B981', icon: 'shield-check' },
  yield_aggregator: { label: 'Yield Aggregator', color: '#F59E0B', icon: 'chart-line' },
  dex: { label: 'DEX Pools', color: '#3B82F6', icon: 'swap-horizontal' },
  staking: { label: 'Staking', color: '#8B5CF6', icon: 'lock' },
};

export default function ProStrategyConfigScreen() {
  const { setCustomProStrategy } = useMode();
  const [selectedTemplate, setSelectedTemplate] = useState<AllocationStrategy | null>(null);

  // Custom allocation percentages
  const [allocations, setAllocations] = useState({
    stablecoin: 30,
    yield_aggregator: 30,
    dex: 25,
    staking: 15,
  });

  const handleTemplateSelect = (template: AllocationStrategy) => {
    setSelectedTemplate(template);
    // Pre-fill sliders with template allocations
    const newAllocations: any = { stablecoin: 0, yield_aggregator: 0, dex: 0, staking: 0 };
    template.allocations.forEach((alloc) => {
      newAllocations[alloc.poolType] = alloc.targetPercentage;
    });
    setAllocations(newAllocations);
  };

  const handleAllocationChange = (poolType: PoolType, value: number) => {
    setAllocations((prev) => ({
      ...prev,
      [poolType]: Math.round(value),
    }));
  };

  const totalPercentage = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const isValid = totalPercentage === 100;

  const handleSave = () => {
    if (!isValid || !selectedTemplate) return;

    const customStrategy: AllocationStrategy = {
      mode: 'pro',
      templateName: selectedTemplate.templateName,
      allocations: Object.entries(allocations).map(([poolType, percentage]) => ({
        poolType: poolType as PoolType,
        targetPercentage: percentage,
        minAPY: selectedTemplate.allocations.find((a) => a.poolType === poolType)?.minAPY || 0,
        maxAPY: selectedTemplate.allocations.find((a) => a.poolType === poolType)?.maxAPY || 0,
        protocols: selectedTemplate.allocations.find((a) => a.poolType === poolType)?.protocols || [],
      })),
      expectedDailyAPY: selectedTemplate.expectedDailyAPY,
      expectedYearlyAPY: selectedTemplate.expectedYearlyAPY,
      riskLevel: 'High',
      description: `Custom ${selectedTemplate.templateName}: ${allocations.stablecoin}% Stable, ${allocations.yield_aggregator}% Yield, ${allocations.dex}% DEX, ${allocations.staking}% Staking`,
      isCustom: true,
    };

    setCustomProStrategy(customStrategy);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Customize Pro Strategy
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Choose a template, then fine-tune your allocation
        </Text>
      </View>

      {/* Step 1: Choose Template */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Step 1: Choose Your Base Template
        </Text>
        <View style={styles.templatesGrid}>
          {STRATEGY_TEMPLATES.map((template) => (
            <StrategyTemplateCard
              key={template.templateName}
              strategy={template}
              isSelected={selectedTemplate?.templateName === template.templateName}
              onSelect={() => handleTemplateSelect(template)}
            />
          ))}
        </View>
      </View>

      {/* Step 2: Customize Allocation */}
      {selectedTemplate && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Step 2: Fine-Tune Allocation
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Adjust the sliders to customize your strategy (must total 100%)
          </Text>

          <Card style={styles.slidersCard}>
            <Card.Content>
              {(Object.keys(POOL_CONFIG) as PoolType[]).map((poolType) => (
                <AllocationSlider
                  key={poolType}
                  poolType={poolType}
                  percentage={allocations[poolType]}
                  onValueChange={(value) => handleAllocationChange(poolType, value)}
                  color={POOL_CONFIG[poolType].color}
                  label={POOL_CONFIG[poolType].label}
                  icon={POOL_CONFIG[poolType].icon}
                />
              ))}
            </Card.Content>
          </Card>

          {/* Total Validation */}
          <Card style={[styles.totalCard, !isValid && styles.totalCardError]}>
            <Card.Content>
              <View style={styles.totalRow}>
                <View style={styles.totalLeft}>
                  <MaterialCommunityIcons
                    name={isValid ? 'check-circle' : 'alert-circle'}
                    size={24}
                    color={isValid ? '#10B981' : '#EF4444'}
                  />
                  <Text variant="titleMedium" style={styles.totalLabel}>
                    Total Allocation
                  </Text>
                </View>
                <Text
                  variant="headlineSmall"
                  style={[styles.totalValue, { color: isValid ? '#10B981' : '#EF4444' }]}
                >
                  {totalPercentage}%
                </Text>
              </View>
              {!isValid && (
                <Text variant="bodySmall" style={styles.errorText}>
                  Must equal 100%. Currently {totalPercentage > 100 ? 'over' : 'under'} by{' '}
                  {Math.abs(100 - totalPercentage)}%
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Preview */}
          <View style={styles.previewSection}>
            <Text variant="titleSmall" style={styles.previewTitle}>
              Strategy Preview
            </Text>
            <View style={styles.previewBars}>
              {(Object.entries(allocations) as [PoolType, number][])
                .filter(([_, percentage]) => percentage > 0)
                .map(([poolType, percentage]) => (
                  <View key={poolType} style={styles.previewBarRow}>
                    <View
                      style={[
                        styles.previewBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: POOL_CONFIG[poolType].color,
                        },
                      ]}
                    />
                    <Text variant="bodySmall" style={styles.previewBarLabel}>
                      {POOL_CONFIG[poolType].label} {percentage}%
                    </Text>
                  </View>
                ))}
            </View>
          </View>

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={!isValid}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
          >
            Save Custom Strategy
          </Button>
        </View>
      )}

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#6B7280" />
        <Text variant="bodySmall" style={styles.infoText}>
          Your custom strategy will only affect new deposits. Existing allocations remain unchanged.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#6B7280',
    marginBottom: 16,
  },
  templatesGrid: {
    gap: 12,
  },
  slidersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  totalCardError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#000000',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
  },
  previewSection: {
    marginBottom: 16,
  },
  previewTitle: {
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  previewBars: {
    gap: 8,
  },
  previewBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewBar: {
    height: 24,
    borderRadius: 4,
  },
  previewBarLabel: {
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 8,
  },
  saveButtonContent: {
    paddingVertical: 8,
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
    lineHeight: 20,
  },
});
