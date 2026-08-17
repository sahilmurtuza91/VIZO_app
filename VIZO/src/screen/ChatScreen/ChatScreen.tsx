import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import { COLORS } from '../../constants/Color';
import { socketService } from '../../services/socketService';
import { RootState } from '../../redux/store';

import { useGetMyConversationsQuery, useMarkAllAsReadMutation } from '../../redux/api/chatApi';

interface ConversationItem {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isRead: boolean;
  address?: string;
  rawConversationData?: any;
}

const DEFAULT_AVATAR = require('../../assets/images/profile.png');

const ChatScreen = ({ navigation }: any) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenMenue, setIsOpenMenue] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: rawConversations = [], isLoading, isFetching, refetch } = useGetMyConversationsQuery(undefined);
  const [markAllReadApi] = useMarkAllAsReadMutation();

  useEffect(() => {
    if (token) {
      socketService.connectSocket(token);

      socketService.on('new_message_notification', () => {
        refetch();
      });
    }

    return () => {
      socketService.off('new_message_notification');
    };
  }, [token, refetch]);

  const parsedConversations: ConversationItem[] = rawConversations.map((conv: any) => {
    const partner = conv.participants?.find(
      (p: any) => (p._id || p.id)?.toString() !== currentUserId?.toString()
    ) || conv.participants?.[0] || {};

    const myUnread = conv.unreadCounts ? conv.unreadCounts[currentUserId] || 0 : 0;

    const formattedTime = conv.updatedAt
      ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return {
      id: conv._id || conv.id,
      name: partner.name || 'Client',
      avatarUrl: partner.avatarUrl || '',
      lastMessage: conv.lastMessage || 'No messages yet',
      timestamp: formattedTime,
      unreadCount: myUnread,
      isRead: myUnread === 0,
      address: conv.clientRequest?.address || '',
      rawConversationData: conv,
    };
  });

  const filteredConversations = parsedConversations.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🟢 Fix: Immediate and visual feedback for Refetch
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch().unwrap();
    } catch (err) {
      console.log('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMenueAction = async (actionType: string) => {
    setIsOpenMenue(false);
    if (actionType === 'MARK_READ') {
      try {
        await markAllReadApi().unwrap();
        Alert.alert('Success', 'All conversations marked as read.');
      } catch (error: any) {
        Alert.alert('Error', error?.data?.message || 'Failed to mark as read.');
      }
    } else if (actionType === 'REFRESH') {
      handleManualRefresh();
    }
  };

  const renderConversationItem = ({ item }: { item: ConversationItem }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ChatDetailScreen', { clientData: item })}
    >
      <Image source={item.avatarUrl ? { uri: item.avatarUrl } : DEFAULT_AVATAR} style={styles.avatarImage} />

      <View style={styles.contentCol}>
        <View style={styles.nameTimeRow}>
          <Text style={styles.userNameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.timestamp}</Text>
        </View>

        <View style={styles.messageBadgeRow}>
          <View style={styles.lastMessageRow}>
            {item.isRead && (
              <Image
                source={require('../../assets/images/whiteCheck.png')}
                style={styles.doubleCheckIcon}
                resizeMode="contain"
              />
            )}
            <Text style={styles.lastMessageText} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      <LinearGradient
        colors={['#FF1616', '#FF7A00', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topGlowLayer}
      />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setIsOpenMenue(true)}
        >
          <Image
            source={require('../../assets/images/threeDots.png')}
            style={styles.threeDotsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <Modal
        visible={isOpenMenue}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setIsOpenMenue(false)}
        >
          <View style={styles.menuDropdownCard}>
            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => handleMenueAction('MARK_READ')}
            >
              <Text style={styles.menuItemText}>✓✓  Mark all as read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItemRow, { borderBottomWidth: 0 }]}
              onPress={() => handleMenueAction('REFRESH')}
            >
              <Text style={styles.menuItemText}>🔄  Refresh Chats</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.searchBarContainer}>
        <Image
          source={require('../../assets/images/searchIcon.png')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#66666A"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {isLoading && !isRefreshing ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversationItem}
          ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || isFetching}
              onRefresh={handleManualRefresh}
              tintColor={COLORS.orange}
              colors={[COLORS.orange]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topGlowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    opacity: 0.25,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  menuBtn: {
    padding: 6,
  },
  threeDotsIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.white,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuDropdownCard: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 50 : 60,
    right: 18,
    backgroundColor: '#1E1E22',
    borderRadius: 12,
    paddingVertical: 6,
    width: 200,
    borderWidth: 1,
    borderColor: '#2C2C30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#28282C',
  },
  menuItemText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E20',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2E',
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#66666A',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  contentCol: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userNameText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  timeText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  messageBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  doubleCheckIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.orange,
    marginRight: 4,
  },
  lastMessageText: {
    color: '#8E8E93',
    fontSize: 13,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.orange,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#242426',
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});