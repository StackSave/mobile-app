import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AuthChoiceScreen() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text variant="headlineMedium" style={styles.title}>
        How would you like to continue?
      </Text>

      <Text variant="bodyLarge" style={styles.subtitle}>
        Choose your preferred sign-in method
      </Text>

      {/* Auth Options */}
      <View style={styles.optionsContainer}>
        {/* Wallet Option */}
        <Card style={styles.optionCard} onPress={() => router.push('/connect-wallet')}>
          <Card.Content>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <MaterialCommunityIcons name="wallet" size={32} color="#2563EB" />
              </View>
              <View style={styles.optionText}>
                <Text variant="titleMedium" style={styles.optionTitle}>
                  Connect Wallet
                </Text>
                <Text variant="bodySmall" style={styles.optionDescription}>
                  Use your own crypto wallet for full control
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                <Text variant="bodySmall" style={styles.featureText}>
                  Full custody of your funds
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                <Text variant="bodySmall" style={styles.featureText}>
                  Sign transactions with your wallet
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Email Option */}
        <Card
          style={styles.optionCard}
          onPress={() => router.push('/email-phone-auth?method=email')}
        >
          <Card.Content>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="email" size={32} color="#D97706" />
              </View>
              <View style={styles.optionText}>
                <Text variant="titleMedium" style={styles.optionTitle}>
                  Continue with Email
                </Text>
                <Text variant="bodySmall" style={styles.optionDescription}>
                  Quick sign-up with email verification
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                <Text variant="bodySmall" style={styles.featureText}>
                  Easiest way to get started
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                <Text variant="bodySmall" style={styles.featureText}>
                  Wallet created automatically
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Skip Button */}
      <Button
        mode="text"
        onPress={() => router.push('/setup-goals')}
        style={styles.skipButton}
      >
        Skip for now (Demo Mode)
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  optionDescription: {
    color: '#6B7280',
  },
  featuresList: {
    gap: 6,
    paddingLeft: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: '#374151',
    flex: 1,
  },
  skipButton: {
    marginTop: 24,
  },
});
