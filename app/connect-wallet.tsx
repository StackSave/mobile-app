import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, TextInput, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useWallet } from '../contexts/WalletContext';

export default function ConnectWalletScreen() {
  const router = useRouter();
  const { wallet, isConnected, isConnecting, connect } = useWallet();
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  // Redirect to setup-goals if already connected
  useEffect(() => {
    if (isConnected && wallet) {
      router.replace('/setup-goals');
    }
  }, [isConnected, wallet]);

  const handleConnect = async () => {
    try {
      setError('');

      if (!walletAddress.trim()) {
        setError('Please enter a wallet address');
        return;
      }

      await connect(walletAddress.trim());
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handlePasteAddress = () => {
    // For now, just fill with a demo address
    // In production, use Clipboard API: import * as Clipboard from 'expo-clipboard';
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text variant="headlineMedium" style={styles.title}>
          Connect Your Wallet
        </Text>

        {/* Description */}
        <Text variant="bodyLarge" style={styles.description}>
          Enter your Ethereum wallet address to start saving and earning with StackSave.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem
            icon="🔒"
            title="Secure & Private"
            description="Your wallet, your control. We never access your private keys."
          />
          <FeatureItem
            icon="🚀"
            title="Auto-Allocation"
            description="Deposits automatically distributed to best yields."
          />
          <FeatureItem
            icon="📊"
            title="Real-Time Tracking"
            description="Monitor your portfolio and earnings live."
          />
        </View>

        {/* Wallet Address Input */}
        <View style={styles.inputContainer}>
          <Text variant="labelLarge" style={styles.inputLabel}>
            Wallet Address (Base Sepolia)
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
            right={
              <TextInput.Icon
                icon="content-paste"
                onPress={handlePasteAddress}
              />
            }
          />
          <Text variant="bodySmall" style={styles.inputHint}>
            Enter your Base Sepolia wallet address
          </Text>
        </View>

        {/* Connect Button */}
        <Button
          mode="contained"
          onPress={handleConnect}
          disabled={isConnecting || !walletAddress.trim()}
          style={styles.connectButton}
          contentStyle={styles.connectButtonContent}
          labelStyle={styles.connectButtonLabel}
        >
          {isConnecting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Connect Wallet'
          )}
        </Button>

        {/* Network Info */}
        <View style={styles.networkBadge}>
          <Text variant="bodySmall" style={styles.networkText}>
            🟢 Base Sepolia Testnet
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text variant="bodySmall" style={styles.infoText}>
            💡 Tip: Make sure you're using a Base Sepolia testnet address. You can get testnet tokens from a faucet.
          </Text>
        </View>
      </View>

      {/* Error Snackbar */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setError(''),
        }}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text variant="titleSmall" style={styles.featureTitle}>
          {title}
        </Text>
        <Text variant="bodySmall" style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    color: '#666',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
  },
  inputHint: {
    marginTop: 4,
    color: '#999',
  },
  connectButton: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
  },
  connectButtonContent: {
    paddingVertical: 8,
  },
  connectButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  networkBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  networkText: {
    color: '#2E7D32',
    fontWeight: '500',
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
});
