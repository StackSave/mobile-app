import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Switch, Badge, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMode } from '../contexts/ModeContext';
import { useState } from 'react';

interface HomeHeaderProps {
  onSearchPress: () => void;
  notificationCount?: number;
}

export default function HomeHeader({
  onSearchPress,
  notificationCount = 0,
}: HomeHeaderProps) {
  const { mode, toggleMode, isProMode } = useMode();

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      {/* Left: Mode Switcher */}
      <View style={styles.leftSection}>
        <View style={styles.modeSwitch}>
          <Text
            variant="labelSmall"
            style={[styles.modeLabel, !isProMode && styles.activeModeLabel]}
          >
            Lite
          </Text>
          <Switch
            value={isProMode}
            onValueChange={toggleMode}
            color="#0052FF"
            style={styles.switch}
          />
          <Text
            variant="labelSmall"
            style={[styles.modeLabel, isProMode && styles.activeModeLabel]}
          >
            Pro
          </Text>
        </View>
      </View>

      {/* Right: Search, Notifications, Profile */}
      <View style={styles.rightSection}>
        {/* Search */}
        <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="magnify" size={24} color="#000000" />
        </TouchableOpacity>

        {/* Notifications */}
        <View style={styles.notificationContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#000000" />
            {notificationCount > 0 && (
              <View style={styles.badgeContainer}>
                <Badge size={16} style={styles.badge}>
                  {notificationCount}
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
  modeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeLabel: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  activeModeLabel: {
    color: '#000000',
    fontWeight: 'bold',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
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
