import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

export default function EmailPhoneAuthScreen() {
  const { method } = useLocalSearchParams<{ method: 'email' | 'phone' }>();
  const { loginWithEmail, loginWithPhone } = useAuth();
  const { connect } = useWallet();

  const [credential, setCredential] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmail = method === 'email';

  const handleSendCode = () => {
    if (!credential.trim()) {
      setError(`Please enter your ${isEmail ? 'email' : 'phone number'}`);
      return;
    }

    // Basic validation
    if (isEmail && !credential.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate sending verification code
    setTimeout(() => {
      setCodeSent(true);
      setLoading(false);
      setError('');
    }, 1500);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    // Simulate verification
    setTimeout(async () => {
      try {
        // Login with the credential
        if (isEmail) {
          await loginWithEmail(credential);
        } else {
          await loginWithPhone(credential);
        }

        // Create a custodial wallet for the user
        // Generate a deterministic address based on credential (in production, use proper wallet generation)
        const custodialAddress = `0x${credential.toLowerCase().replace(/[^a-f0-9]/g, '').padEnd(40, '0')}`;
        await connect(custodialAddress, 'custodial');

        setLoading(false);
        // Navigate to setup goals
        router.replace('/setup-goals');
      } catch (err) {
        setError('Verification failed. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: isEmail ? '#FEF3C7' : '#DCFCE7' }]}>
          <MaterialCommunityIcons
            name={isEmail ? 'email' : 'phone'}
            size={48}
            color={isEmail ? '#D97706' : '#16A34A'}
          />
        </View>
        <Text variant="headlineMedium" style={styles.title}>
          {isEmail ? 'Sign in with Email' : 'Sign in with Phone'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {codeSent
            ? `We sent a code to ${credential}`
            : `Enter your ${isEmail ? 'email address' : 'phone number'}`}
        </Text>
      </View>

      {!codeSent ? (
        <View style={styles.formSection}>
          <TextInput
            mode="outlined"
            label={isEmail ? 'Email Address' : 'Phone Number'}
            value={credential}
            onChangeText={setCredential}
            keyboardType={isEmail ? 'email-address' : 'phone-pad'}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={isEmail ? 'you@example.com' : '+62 812 3456 7890'}
            style={styles.input}
            left={
              <TextInput.Icon
                icon={isEmail ? 'email-outline' : 'phone-outline'}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleSendCode}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Send Verification Code
          </Button>
        </View>
      ) : (
        <View style={styles.formSection}>
          <Text variant="bodyMedium" style={styles.codeInstructions}>
            Enter the 6-digit code we sent you
          </Text>

          <TextInput
            mode="outlined"
            label="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="123456"
            style={styles.input}
            left={<TextInput.Icon icon="shield-lock-outline" />}
          />

          <Button
            mode="contained"
            onPress={handleVerify}
            loading={loading}
            disabled={loading || verificationCode.length !== 6}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Verify & Continue
          </Button>

          <Button
            mode="text"
            onPress={() => setCodeSent(false)}
            disabled={loading}
            style={styles.resendButton}
          >
            Resend Code
          </Button>
        </View>
      )}

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#6B7280" />
        <Text variant="bodySmall" style={styles.infoText}>
          {isEmail
            ? 'A custodial wallet will be created for you automatically. You can connect your own wallet later.'
            : 'A custodial wallet will be created for you automatically. You can connect your own wallet later.'}
        </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000000',
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  codeInstructions: {
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendButton: {
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 'auto',
  },
  infoText: {
    flex: 1,
    color: '#6B7280',
    lineHeight: 20,
  },
});
