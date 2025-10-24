import '../polyfills';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from '../contexts/AuthContext';
import { PaymentMethodProvider } from '../contexts/PaymentMethodContext';
import { ProtocolProvider } from '../contexts/ProtocolContext';
import { WalletProvider } from '../contexts/WalletContext';
import { SavingsProvider } from '../contexts/SavingsContext';
import { StreakProvider } from '../contexts/StreakContext';
import { ModeProvider } from '../contexts/ModeContext';
import { GoalsProvider } from '../contexts/GoalsContext';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { NotificationProvider } from '../contexts/NotificationContext';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#000000', // Black for primary actions
    secondary: '#6B7280', // Gray for secondary elements
    tertiary: '#10B981', // Keep green for success indicators
    background: '#FFFFFF', // White background
    surface: '#FFFFFF', // White surface
    surfaceVariant: '#F9FAFB', // Light gray variant
    outline: '#E5E7EB', // Light border
    onSurface: '#000000', // Black text on surfaces
    onBackground: '#000000', // Black text on background
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <PaymentMethodProvider>
          <ProtocolProvider>
            <ModeProvider>
              <WalletProvider>
                <NotificationProvider>
                  <SavingsProvider>
                    <GoalsProvider>
                      <PortfolioProvider>
                        <StreakProvider>
                          <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="onboarding" />
                            <Stack.Screen name="auth-choice" />
                            <Stack.Screen name="connect-wallet" />
                            <Stack.Screen name="email-phone-auth" />
                            <Stack.Screen name="setup-goals" />
                            <Stack.Screen name="link-payment" />
                            <Stack.Screen name="pro-strategy-config" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="calendar" />
                          </Stack>
                        </StreakProvider>
                      </PortfolioProvider>
                    </GoalsProvider>
                  </SavingsProvider>
                </NotificationProvider>
              </WalletProvider>
            </ModeProvider>
          </ProtocolProvider>
        </PaymentMethodProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
