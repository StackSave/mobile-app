import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Avatar, List, Switch, Button, Divider, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useWallet } from '../../contexts/WalletContext';
import { useSavings } from '../../contexts/SavingsContext';
import { useStreak } from '../../contexts/StreakContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useState } from 'react';

export default function ProfileScreen() {
  const { wallet, disconnect } = useWallet();
  const { stats } = useSavings();
  const { streak } = useStreak();
  const { unreadCount } = useNotifications();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* User Info Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Icon size={80} icon="wallet" style={styles.avatar} />
            <Text variant="headlineSmall" style={styles.userName}>
              StackSave User
            </Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {wallet ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'No wallet connected'}
            </Text>
          </Card.Content>
        </Card>

        {/* Stats Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Your Stats
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={28} color="#F59E0B" />
                <Text variant="titleLarge" style={styles.statValue}>
                  {streak.currentStreak}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Day Streak
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="piggy-bank"
                  size={28}
                  color="#7C3AED"
                />
                <Text variant="titleLarge" style={styles.statValue}>
                  ${stats.totalDeposited.toFixed(0)}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Saved
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={28}
                  color="#10B981"
                />
                <Text variant="titleLarge" style={styles.statValue}>
                  ${stats.totalEarned.toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Earned
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Wallet Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Wallet Information
            </Text>
            <List.Item
              title="Wallet Address"
              description={wallet ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}` : 'Not connected'}
              left={(props) => (
                <List.Icon {...props} icon="wallet" color="#000000" />
              )}
              right={(props) => (
                <List.Icon {...props} icon="content-copy" color="#9CA3AF" />
              )}
            />
            <Divider />
            <List.Item
              title="Network"
              description={wallet?.network || 'Not connected'}
              left={(props) => (
                <List.Icon {...props} icon="earth" color="#000000" />
              )}
            />
            <Divider />
            <List.Item
              title="Available Balance"
              description={wallet ? `${wallet.balance.usdc.toFixed(2)} USDC` : '0.00 USDC'}
              left={(props) => (
                <List.Icon {...props} icon="currency-usd" color="#10B981" />
              )}
            />
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Settings
            </Text>
            <List.Item
              title="Notifications"
              description="View all your notifications"
              left={(props) => (
                <List.Icon {...props} icon="bell-outline" color="#000000" />
              )}
              right={(props) => (
                <View style={styles.notificationRightContent}>
                  {unreadCount > 0 && (
                    <Badge size={20} style={styles.badge}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                  <List.Icon {...props} icon="chevron-right" color="#9CA3AF" />
                </View>
              )}
              onPress={handleNotificationsPress}
            />
            <Divider />
            <List.Item
              title="Push Notifications"
              description="Receive alerts about your savings"
              left={(props) => (
                <List.Icon {...props} icon="bell-ring-outline" color="#000000" />
              )}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color="#000000"
                />
              )}
            />
            <Divider />
            <List.Item
              title="Biometric Login"
              description="Use Face ID or fingerprint"
              left={(props) => (
                <List.Icon {...props} icon="fingerprint" color="#000000" />
              )}
              right={() => (
                <Switch
                  value={biometricsEnabled}
                  onValueChange={setBiometricsEnabled}
                  color="#000000"
                />
              )}
            />
            <Divider />
            <List.Item
              title="App Preferences"
              description="Customize your experience"
              left={(props) => (
                <List.Icon {...props} icon="cog-outline" color="#000000" />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color="#9CA3AF" />
              )}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Security"
              description="Password and 2FA settings"
              left={(props) => (
                <List.Icon {...props} icon="shield-lock-outline" color="#000000" />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color="#9CA3AF" />
              )}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              description="FAQs and contact us"
              left={(props) => (
                <List.Icon {...props} icon="help-circle-outline" color="#000000" />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color="#9CA3AF" />
              )}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        {/* Disconnect Wallet Button */}
        <Button
          mode="outlined"
          icon="wallet-remove"
          onPress={handleDisconnect}
          style={styles.logoutButton}
          textColor="#EF4444"
        >
          Disconnect Wallet
        </Button>

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  userEmail: {
    color: '#6B7280',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#000000',
  },
  statLabel: {
    color: '#6B7280',
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 16,
    borderColor: '#EF4444',
  },
  bottomSpacer: {
    height: 32,
  },
  notificationRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#EF4444',
  },
});
