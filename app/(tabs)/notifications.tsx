import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, IconButton, Divider, Button, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationContext';
import { Notification, NotificationType } from '../../types';

// Simple time ago function without external dependencies
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - in real app you might fetch from server
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setMenuVisible(false);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setMenuVisible(false);
  };

  const filteredNotifications = filterType === 'all'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'transaction':
        return '#3B82F6'; // Blue
      case 'reminder':
        return '#F59E0B'; // Orange
      case 'goal_achievement':
        return '#10B981'; // Green
      case 'streak':
        return '#EF4444'; // Red
      case 'milestone':
        return '#8B5CF6'; // Purple
      case 'system':
        return '#6B7280'; // Gray
      default:
        return '#6B7280';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { borderLeftWidth: 4, borderLeftColor: '#EF4444' };
      case 'medium':
        return { borderLeftWidth: 4, borderLeftColor: '#F59E0B' };
      case 'low':
        return { borderLeftWidth: 4, borderLeftColor: '#10B981' };
      default:
        return {};
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate to the action URL if available
    if (notification.actionUrl) {
      try {
        router.push(notification.actionUrl as any);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <Surface
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadCard,
          getPriorityStyle(item.priority),
        ]}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
            <MaterialCommunityIcons
              name={item.icon as any || 'bell'}
              size={24}
              color={getNotificationColor(item.type)}
            />
          </View>

          <View style={styles.textContent}>
            <View style={styles.headerRow}>
              <Text variant="titleSmall" style={styles.notificationTitle}>
                {item.title}
              </Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            <Text variant="bodyMedium" style={styles.notificationMessage}>
              {item.message}
            </Text>

            <Text variant="bodySmall" style={styles.timestamp}>
              {formatTimeAgo(item.timestamp)}
            </Text>
          </View>

          <IconButton
            icon="close"
            size={20}
            onPress={() => deleteNotification(item.id)}
            style={styles.deleteButton}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="bell-off-outline" size={64} color="#9CA3AF" />
      <Text variant="titleMedium" style={styles.emptyTitle}>
        No Notifications
      </Text>
      <Text variant="bodyMedium" style={styles.emptyMessage}>
        You're all caught up! Check back later for updates.
      </Text>
    </View>
  );

  const renderFilterChip = (type: NotificationType | 'all', label: string, icon: string) => (
    <TouchableOpacity
      onPress={() => setFilterType(type)}
      style={[
        styles.filterChip,
        filterType === type && styles.activeFilterChip,
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={filterType === type ? '#FFFFFF' : '#6B7280'}
      />
      <Text
        variant="labelMedium"
        style={[
          styles.filterLabel,
          filterType === type && styles.activeFilterLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text variant="bodyMedium" style={styles.unreadText}>
              {unreadCount} unread
            </Text>
          )}
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={handleMarkAllAsRead}
            title="Mark all as read"
            leadingIcon="check-all"
            disabled={unreadCount === 0}
          />
          <Divider />
          <Menu.Item
            onPress={handleClearAll}
            title="Clear all"
            leadingIcon="delete-outline"
            disabled={notifications.length === 0}
          />
        </Menu>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { type: 'all' as const, label: 'All', icon: 'filter-variant' },
            { type: 'transaction' as NotificationType, label: 'Transactions', icon: 'swap-horizontal' },
            { type: 'reminder' as NotificationType, label: 'Reminders', icon: 'bell' },
            { type: 'goal_achievement' as NotificationType, label: 'Goals', icon: 'trophy' },
            { type: 'streak' as NotificationType, label: 'Streaks', icon: 'fire' },
          ]}
          renderItem={({ item }) => renderFilterChip(item.type, item.label, item.icon)}
          keyExtractor={(item) => item.type}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredNotifications.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  unreadText: {
    color: '#6B7280',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    gap: 4,
  },
  activeFilterChip: {
    backgroundColor: '#000000',
  },
  filterLabel: {
    color: '#6B7280',
  },
  activeFilterLabel: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  notificationMessage: {
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    color: '#9CA3AF',
  },
  deleteButton: {
    margin: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
