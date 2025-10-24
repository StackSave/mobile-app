import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, Button, TextInput, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { connect, isConnecting } = useWallet();
  const { loginWithWallet } = useAuth();
  const [walletAddress, setWalletAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleWalletConnect = async (walletName: string) => {
    setShowInstructions(true);
    setShowManualInput(true);
  };

  const handleManualConnect = async () => {
    try {
      if (!walletAddress.trim()) {
        Alert.alert('Error', 'Please enter a valid wallet address');
        return;
      }

      // Validate address format
      if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
        Alert.alert('Error', 'Invalid Ethereum address format');
        return;
      }

      // Connect wallet
      await connect(walletAddress.trim(), 'wallet');

      // Update auth context
      await loginWithWallet(walletAddress.trim());

      // Navigate to home
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const handleSkip = () => {
    // Skip to demo mode
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.title}>
          Save Your Progress
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Connect your wallet to start earning and track your goals
        </Text>
      </View>

      {/* Wallet Options */}
      <View style={styles.walletsContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Connect with Wallet
        </Text>

        {/* MetaMask */}
        <WalletButton
          icon="ethereum"
          name="MetaMask"
          description="Most popular Ethereum wallet"
          onPress={() => handleWalletConnect('MetaMask')}
          disabled={isConnecting}
        />

        {/* Phantom */}
        <WalletButton
          icon="ghost"
          name="Phantom"
          description="Multi-chain wallet with EVM support"
          onPress={() => handleWalletConnect('Phantom')}
          disabled={isConnecting}
        />

        {/* OKX Wallet */}
        <WalletButton
          icon="wallet"
          name="OKX Wallet"
          description="Secure and versatile crypto wallet"
          onPress={() => handleWalletConnect('OKX')}
          disabled={isConnecting}
        />

        {/* Trust Wallet */}
        <WalletButton
          icon="shield-check"
          name="Trust Wallet"
          description="Popular mobile wallet"
          onPress={() => handleWalletConnect('Trust Wallet')}
          disabled={isConnecting}
        />
      </View>

      {/* Manual Input Section */}
      {showManualInput && (
        <View style={styles.manualInputContainer}>
          <Divider style={styles.divider} />

          {/* Instructions Panel */}
          {showInstructions && (
            <View style={styles.instructionsPanel}>
              <Text variant="titleSmall" style={styles.instructionsTitle}>
                How to connect your MetaMask wallet:
              </Text>
              <View style={styles.instructionSteps}>
                <Text variant="bodySmall" style={styles.instructionStep}>
                  1. Open MetaMask app on your phone
                </Text>
                <Text variant="bodySmall" style={styles.instructionStep}>
                  2. Make sure you're on Base Sepolia testnet
                </Text>
                <Text variant="bodySmall" style={styles.instructionStep}>
                  3. Tap your wallet address to copy it
                </Text>
                <Text variant="bodySmall" style={styles.instructionStep}>
                  4. Paste it below
                </Text>
              </View>
            </View>
          )}

          <Text variant="titleSmall" style={styles.manualInputLabel}>
            Paste your wallet address
          </Text>
          <TextInput
            mode="outlined"
            placeholder="0x..."
            value={walletAddress}
            onChangeText={setWalletAddress}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            disabled={isConnecting}
          />

          {/* Quick Demo Address Button */}
          <Button
            mode="text"
            onPress={() => setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')}
            style={styles.demoButton}
            disabled={isConnecting}
          >
            Use Demo Address
          </Button>

          <Button
            mode="contained"
            onPress={handleManualConnect}
            disabled={isConnecting || !walletAddress.trim()}
            style={styles.connectButton}
            loading={isConnecting}
          >
            Connect Wallet
          </Button>
        </View>
      )}

      {/* Email Option (Coming Soon) */}
      <View style={styles.emailContainer}>
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Other Options
        </Text>

        <Surface style={[styles.walletCard, styles.disabledCard]}>
          <View style={styles.walletContent}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="email" size={28} color="#D97706" />
            </View>
            <View style={styles.walletInfo}>
              <View style={styles.walletNameRow}>
                <Text variant="titleMedium" style={styles.walletName}>
                  Continue with Email
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text variant="labelSmall" style={styles.comingSoonText}>
                    Coming Soon
                  </Text>
                </View>
              </View>
              <Text variant="bodySmall" style={styles.walletDescription}>
                Sign up with email - wallet created for you
              </Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Network Info */}
      <View style={styles.networkInfo}>
        <MaterialCommunityIcons name="information" size={20} color="#6B7280" />
        <Text variant="bodySmall" style={styles.networkText}>
          Make sure you're using a Base Sepolia testnet address
        </Text>
      </View>

      {/* Skip Button */}
      <Button
        mode="text"
        onPress={handleSkip}
        style={styles.skipButton}
      >
        Skip for now (Demo Mode)
      </Button>
    </ScrollView>
  );
}

interface WalletButtonProps {
  icon: string;
  name: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
}

function WalletButton({ icon, name, description, onPress, disabled }: WalletButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Surface style={styles.walletCard}>
        <View style={styles.walletContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon as any} size={28} color="#0052FF" />
          </View>
          <View style={styles.walletInfo}>
            <Text variant="titleMedium" style={styles.walletName}>
              {name}
            </Text>
            <Text variant="bodySmall" style={styles.walletDescription}>
              {description}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  walletsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  walletCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletName: {
    fontWeight: '600',
    color: '#000000',
  },
  walletDescription: {
    color: '#6B7280',
    marginTop: 2,
  },
  manualInputContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  instructionsPanel: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  instructionSteps: {
    gap: 8,
  },
  instructionStep: {
    color: '#1E40AF',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 24,
  },
  manualInputLabel: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  demoButton: {
    marginBottom: 8,
  },
  connectButton: {
    borderRadius: 8,
  },
  emailContainer: {
    marginBottom: 24,
  },
  disabledCard: {
    opacity: 0.6,
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  comingSoonText: {
    color: '#D97706',
    fontWeight: '600',
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  networkText: {
    flex: 1,
    color: '#6B7280',
  },
  skipButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});
