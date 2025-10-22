import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    // Navigate to onboarding for new users
    router.push('/onboarding');
  };

  return (
    <View style={styles.container}>
      <Text variant="displayMedium" style={styles.title}>
        StackSave
      </Text>
      <Text variant="titleMedium" style={styles.subtitle}>
        Start saving with crypto, simplified.
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        Earn yield on your stablecoins with automated DeFi strategies.
      </Text>
      <Button mode="contained" onPress={handleGetStarted} style={styles.button}>
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0052FF',
  },
  subtitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#6B7280',
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
});
