import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const PAYMENT_METHODS = [
  { id: 'usdc', name: 'USDC', icon: 'currency-usd-circle' },
  { id: 'idrx', name: 'IDRX', icon: 'cash' },
  { id: 'gopay', name: 'GoPay', icon: 'wallet' },
  { id: 'dana', name: 'DANA', icon: 'wallet-outline' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'bank' },
];

export default function LinkPaymentScreen() {
  const [linkedMethods, setLinkedMethods] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectPayment = (methodId: string) => {
    // Placeholder - in production, this would open the actual payment linking flow
    if (linkedMethods.includes(methodId)) {
      setLinkedMethods(linkedMethods.filter((id) => id !== methodId));
    } else {
      setLinkedMethods([...linkedMethods, methodId]);
    }
  };

  const handleConnectWallet = () => {
    // Placeholder - in production, this would open wallet connection modal
    setWalletConnected(!walletConnected);
  };

  const handleContinue = () => {
    // Navigate to home - onboarding complete!
    router.replace('/(tabs)/home');
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  const hasLinkedPayment = linkedMethods.length > 0 || walletConnected;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.emoji}>
          🔗
        </Text>
        <Text variant="headlineMedium" style={styles.title}>
          Link Your Accounts
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Connect your payment methods to start saving
        </Text>
      </View>

      {/* Indonesian Payment Methods */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Indonesian Payment Methods
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Choose how you want to add funds
        </Text>

        {PAYMENT_METHODS.map((method) => {
          const isLinked = linkedMethods.includes(method.id);
          return (
            <Card key={method.id} style={styles.card}>
              <TouchableOpacity
                onPress={() => handleConnectPayment(method.id)}
                style={styles.cardTouchable}
              >
                <View style={styles.cardContent}>
                  <View style={styles.methodInfo}>
                    <MaterialCommunityIcons
                      name={method.icon as any}
                      size={32}
                      color={isLinked ? '#10B981' : '#6B7280'}
                    />
                    <Text variant="titleMedium" style={styles.methodName}>
                      {method.name}
                    </Text>
                  </View>
                  <View style={styles.methodAction}>
                    {isLinked ? (
                      <View style={styles.linkedBadge}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                        <Text style={styles.linkedText}>Linked</Text>
                      </View>
                    ) : (
                      <Button mode="outlined" compact onPress={() => handleConnectPayment(method.id)}>
                        Connect
                      </Button>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          );
        })}
      </View>

      {/* Crypto Wallet */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Crypto Wallet (Optional)
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Link external wallet for advanced DeFi features
        </Text>

        <Card style={styles.card}>
          <TouchableOpacity onPress={handleConnectWallet} style={styles.cardTouchable}>
            <View style={styles.cardContent}>
              <View style={styles.methodInfo}>
                <MaterialCommunityIcons
                  name="wallet-bifold"
                  size={32}
                  color={walletConnected ? '#10B981' : '#6B7280'}
                />
                <View>
                  <Text variant="titleMedium" style={styles.methodName}>
                    Connect Wallet
                  </Text>
                  <Text variant="bodySmall" style={styles.walletSubtext}>
                    MetaMask, WalletConnect, etc.
                  </Text>
                </View>
              </View>
              <View style={styles.methodAction}>
                {walletConnected ? (
                  <View style={styles.linkedBadge}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                    <Text style={styles.linkedText}>Connected</Text>
                  </View>
                ) : (
                  <Button mode="outlined" compact onPress={handleConnectWallet}>
                    Connect
                  </Button>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#6B7280" />
        <Text variant="bodySmall" style={styles.infoText}>
          You can link more payment methods later from your profile settings
        </Text>
      </View>

      {/* Continue Button */}
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.continueButton}
        contentStyle={styles.buttonContent}
        disabled={!hasLinkedPayment}
      >
        Continue
      </Button>

      {/* Skip Link */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip for Now</Text>
      </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#6B7280',
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTouchable: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  methodName: {
    fontWeight: '600',
    color: '#000000',
  },
  walletSubtext: {
    color: '#9CA3AF',
    marginTop: 2,
  },
  methodAction: {
    marginLeft: 12,
  },
  linkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  linkedText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  continueButton: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  skipContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
