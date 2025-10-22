import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, IconButton, Card, Chip, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProtocol } from '../contexts/ProtocolContext';
import { useMode } from '../contexts/ModeContext';
import { Protocol } from '../types';
import { Colors } from '../constants/theme';

export default function ProtocolsScreen() {
  const { protocols, userAllocations, bestProtocol, averageAPY } = useProtocol();
  const { mode, toggleMode } = useMode();
  const isLiteMode = mode === 'lite';

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return '#10B981';
      case 'Medium':
        return '#F59E0B';
      case 'High':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatTVL = (tvl: number) => {
    if (tvl >= 1_000_000_000) {
      return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
    } else if (tvl >= 1_000_000) {
      return `$${(tvl / 1_000_000).toFixed(0)}M`;
    } else {
      return `$${tvl.toLocaleString()}`;
    }
  };

  const isAllocated = (protocolId: string) => {
    return userAllocations.some((a) => a.protocol.id === protocolId);
  };

  const renderProtocolCard = (protocol: Protocol) => {
    const allocated = isAllocated(protocol.id);
    const isBest = bestProtocol?.id === protocol.id;

    return (
      <Card key={protocol.id} style={styles.protocolCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons
                name={protocol.icon as any}
                size={28}
                color="#000000"
              />
              <View style={styles.titleContent}>
                <Text variant="titleMedium" style={styles.protocolName}>
                  {protocol.displayName}
                </Text>
                <Text variant="bodySmall" style={styles.protocolType}>
                  {protocol.type === 'lending' ? 'Lending Protocol' : 'Yield Aggregator'}
                </Text>
              </View>
            </View>
            {isBest && (
              <Chip
                mode="flat"
                textStyle={styles.bestChipText}
                style={styles.bestChip}
              >
                Best APY
              </Chip>
            )}
            {allocated && (
              <Chip
                mode="flat"
                textStyle={styles.allocatedChipText}
                style={styles.allocatedChip}
                icon="check-circle"
              >
                Active
              </Chip>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.apyValue}>
                {protocol.currentAPY.toFixed(2)}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Current APY
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.tvlValue}>
                {formatTVL(protocol.tvl)}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Value Locked
              </Text>
            </View>
          </View>

          <View style={styles.riskRow}>
            <Text variant="bodyMedium" style={styles.riskLabel}>
              Risk Level:
            </Text>
            <Chip
              mode="flat"
              textStyle={{ color: getRiskColor(protocol.riskLevel), fontWeight: 'bold' }}
              style={[styles.riskChip, { borderColor: getRiskColor(protocol.riskLevel) }]}
            >
              {protocol.riskLevel}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Lite mode - show upgrade message
  if (isLiteMode) {
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
            Yield Protocols
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.upgradeSplash}>
          <MaterialCommunityIcons name="lock-outline" size={64} color={Colors.textSecondary} />
          <Text variant="headlineMedium" style={styles.upgradeTitle}>
            Pro Mode Feature
          </Text>
          <Text variant="bodyLarge" style={styles.upgradeMessage}>
            Protocol comparison and manual selection is available in Pro Mode
          </Text>
          <Text variant="bodyMedium" style={styles.upgradeSubtext}>
            In Lite Mode, we automatically choose the best protocol for you to maximize your earnings
          </Text>
          <Button
            mode="contained"
            icon="crown"
            onPress={toggleMode}
            style={styles.upgradeButton}
            contentStyle={styles.upgradeButtonContent}
          >
            Switch to Pro Mode
          </Button>
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  // Pro mode - show full protocol list
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
          Yield Protocols
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Your Average APY
            </Text>
            <Text variant="displaySmall" style={styles.averageAPY}>
              {averageAPY.toFixed(2)}%
            </Text>
            <Text variant="bodySmall" style={styles.summarySubtitle}>
              Across {userAllocations.length} protocol{userAllocations.length !== 1 ? 's' : ''}
            </Text>
          </Card.Content>
        </Card>

        {/* Best Protocol Highlight */}
        {bestProtocol && (
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information" size={20} color="#000000" />
            <Text variant="bodyMedium" style={styles.infoText}>
              <Text style={styles.infoTextBold}>{bestProtocol.displayName}</Text> currently offers
              the highest APY at {bestProtocol.currentAPY.toFixed(2)}%
            </Text>
          </View>
        )}

        {/* Protocol List */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Available Protocols
        </Text>

        {protocols
          .sort((a, b) => b.currentAPY - a.currentAPY)
          .map((protocol) => renderProtocolCard(protocol))}

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            APY rates are updated in real-time. StackSave automatically allocates your funds to
            maximize yields while maintaining your preferred risk level.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  summaryCard: {
    marginBottom: 16,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    color: '#6B7280',
    marginBottom: 8,
  },
  averageAPY: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  summarySubtitle: {
    color: '#9CA3AF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  infoText: {
    flex: 1,
    color: '#374151',
  },
  infoTextBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  protocolCard: {
    marginBottom: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
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
  protocolName: {
    fontWeight: 'bold',
    color: '#000000',
  },
  protocolType: {
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  bestChip: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#000000',
  },
  bestChipText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  allocatedChip: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  allocatedChipText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  apyValue: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  tvlValue: {
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskLabel: {
    color: '#6B7280',
  },
  riskChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  footer: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  footerText: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  upgradeSplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  upgradeTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  upgradeMessage: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradeSubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#000000',
    marginBottom: 12,
    minWidth: 200,
  },
  upgradeButtonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
});
