import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNotifications } from '../contexts/NotificationContext';

interface HomeHeaderProps {
  notificationCount?: number;
}

export default function HomeHeader({
  notificationCount,
}: HomeHeaderProps) {
  const { unreadCount } = useNotifications();

  // Use real unread count from context, fallback to prop
  const displayCount = notificationCount ?? unreadCount;

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleNotificationPress = () => {
    router.push('/(tabs)/notifications');
  };

  return (
    <View style={styles.container}>
      {/* Left: App Logo/Title */}
      <View style={styles.leftSection}>
        <Text variant="titleLarge" style={styles.appTitle}>
          StackSave
        </Text>
      </View>

      {/* Right: Notifications, Profile */}
      <View style={styles.rightSection}>
        {/* Notifications */}
        <View style={styles.notificationContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#000000" />
            {displayCount > 0 && (
              <View style={styles.badgeContainer}>
                <Badge size={16} style={styles.badge}>
                  {displayCount > 99 ? '99+' : displayCount}
                </Badge>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
          <Avatar.Icon
            size={36}
            icon="account"
            style={styles.avatar}
            color="#000000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftSection: {
    flex: 1,
  },
  appTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  notificationContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  badge: {
    backgroundColor: '#EF4444',
  },
  profileButton: {
    marginLeft: 4,
  },
  avatar: {
    backgroundColor: '#F3F4F6',
  },
});
