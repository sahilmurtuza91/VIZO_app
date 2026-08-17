import React, { useState, useEffect, useRef } from 'react';
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
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import { COLORS } from '../../constants/Color';
import { socketService } from "../../services/socketService";
import { RootState } from '../../redux/store';

import { 
  useGetMessagesQuery, 
  useClearChatMutation,
  useToggleMuteChatMutation
} from '../../redux/api/chatApi';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  rawDate: Date;
  senderAvatar: string;
  isMe: boolean;
}

const DEFAULT_AVATAR = require('../../assets/images/profile.png');

const formatMessageDateGroup = (dateInput: Date | string) => {
  const d = new Date(dateInput);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (msgDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (msgDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const ChatDetailScreen = ({ navigation, route }: any) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id || (state.auth.user as any)?._id);
  const token = useSelector((state: RootState) => state.auth.token);
  const clientData = route.params?.clientData;

  const conversationId = clientData?.id || clientData?._id;

  const targetUserId =
    clientData?.partnerId ||
    clientData?.rawConversationData?.participants?.find(
      (p: any) => (p._id || p.id || p)?.toString() !== currentUserId?.toString()
    )?._id ||
    clientData?.clientUserId;

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { data: initialHistory = [], isLoading } = useGetMessagesQuery(conversationId, {
    skip: !conversationId,
  });
  const [clearChatApi] = useClearChatMutation();
  const [toggleMuteApi] = useToggleMuteChatMutation();
  const [isSending, setIsSending] = useState(false);

  const mapServerMessage = (m: any): ChatMessage => {
    const senderObj = m.sender || {};
    const senderId = senderObj._id || senderObj.id || senderObj;
    const isMe = senderId?.toString() === currentUserId?.toString();
    const createdDate = m.createdAt ? new Date(m.createdAt) : new Date();

    return {
      id: m._id || m.id || String(Math.random()),
      senderId,
      text: m.text || '',
      time: createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawDate: createdDate,
      senderAvatar: senderObj.avatarUrl || clientData?.avatarUrl || '',
      isMe,
    };
  };

  useEffect(() => {
    if (initialHistory.length > 0) {
      setMessages(initialHistory.map(mapServerMessage));
    }
  }, [initialHistory, currentUserId]);

  useEffect(() => {
    if (!conversationId) return;
    if (token) {
      socketService.connectSocket(token);
    }

    socketService.emit('join_conversation', conversationId);

    socketService.on('receive_message', (socketMsg: any) => {
      const newMsgObj = mapServerMessage(socketMsg);

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMsgObj.id)) return prev;
        return [...prev, newMsgObj];
      });
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socketService.on('user_typing', ({ userId }: any) => {
      if (userId !== currentUserId) setIsTyping(true);
    });

    socketService.on('user_stop_typing', ({ userId }: any) => {
      if (userId !== currentUserId) setIsTyping(false);
    });

    const keyboardListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
    );

    return () => {
      keyboardListener.remove();
      socketService.emit('leave_conversation', conversationId);
      socketService.off('receive_message');
      socketService.off('user_typing');
      socketService.off('user_stop_typing');
    };
  }, [conversationId, currentUserId, clientData?.avatarUrl, token]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    socketService.emit('stop_typing', { conversationId });
    setIsSending(true);

    try {
      socketService.emit('send_message', {
        conversationId,
        text: messageText,
      });

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    } catch (error: any) {
      setInputText(messageText);
      Alert.alert('Message not sent', 'Check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text.length > 0) {
      socketService.emit('typing', { conversationId });
    } else {
      socketService.emit('stop_typing', { conversationId });
    }
  };

  const handleDetailMenuAction = async (actionType: string) => {
    setIsMenuOpen(false);

    if ((actionType === 'AUDIO_CALL' || actionType === 'VIDEO_CALL') && !targetUserId) {
      Alert.alert('Call Error', 'Recipient user ID not found. Please try again.');
      return;
    }

    switch (actionType) {
      case 'AUDIO_CALL':
        socketService.emit('call_user', {
          toUserId: targetUserId,
          conversationId,
          callType: 'audio',
          offer: { type: 'offer', sdp: 'vizo_webrtc_audio_offer' },
        });
        navigation.navigate('AudioCallScreen', { 
          clientData: { ...clientData, partnerId: targetUserId }, 
          isIncoming: false 
        });
        break;

      case 'VIDEO_CALL':
        socketService.emit('call_user', {
          toUserId: targetUserId,
          conversationId,
          callType: 'video',
          offer: { type: 'offer', sdp: 'vizo_webrtc_video_offer' },
        });
        navigation.navigate('VideoCallScreen', { 
          clientData: { ...clientData, partnerId: targetUserId }, 
          isIncoming: false 
        });
        break;

      case 'VIEW_PROFILE':
        navigation.navigate('ClientDetail', { clientData });
        break;

      case 'MUTE':
        try {
          const res = await toggleMuteApi(conversationId).unwrap();
          setIsMuted(res.data?.isMuted);
          Alert.alert('Notification', res.message || 'Updated mute status.');
        } catch (err: any) {
          Alert.alert('Error', err?.data?.message || 'Failed to update mute status.');
        }
        break;

      case 'CLEAR_CHAT':
        Alert.alert('Clear Chat', 'Are you sure you want to delete all messages', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: async () => {
              try {
                await clearChatApi(conversationId).unwrap();
                setMessages([]);
                navigation.goBack();
              } catch (err: any) {
                Alert.alert('Error', err?.data?.message || 'Failed to clear chat.');
              }
            },
          },
        ]);
        break;
    }
  };

  const renderBubbleItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isFirstMessage = index === 0;
    const prevMessage = index > 0 ? messages[index - 1] : null;

    const currentDateGroup = formatMessageDateGroup(item.rawDate);
    const prevDateGroup = prevMessage ? formatMessageDateGroup(prevMessage.rawDate) : null;

    const shouldShowDatePill = isFirstMessage || currentDateGroup !== prevDateGroup;

    return (
      <View>
        {shouldShowDatePill && (
          <View style={styles.datePillContainer}>
            <View style={styles.datePillBadge}>
              <Text style={styles.datePillText}>{currentDateGroup}</Text>
            </View>
          </View>
        )}

        {item.isMe ? (
          <View style={styles.myBubbleRow}>
            <View style={styles.myBubbleContainer}>
              <Text style={styles.myBubbleText}>{item.text}</Text>
              <Text style={styles.myTimeText}>{item.time}</Text>
            </View>
            <Image
              source={item.senderAvatar ? { uri: item.senderAvatar } : DEFAULT_AVATAR}
              style={styles.bubbleAvatar}
            />
          </View>
        ) : (
          <View style={styles.otherBubbleRow}>
            <Image
              source={item.senderAvatar ? { uri: item.senderAvatar } : DEFAULT_AVATAR}
              style={styles.bubbleAvatar}
            />
            <View style={styles.otherBubbleContainer}>
              <Text style={styles.otherBubbleText}>{item.text}</Text>
              <Text style={styles.otherTimeText}>{item.time}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (!clientData || !conversationId) {
    return (
      <SafeAreaView style={[styles.container, styles.loaderCenter]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
        <Text style={styles.otherBubbleText}>Conversation not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.orange, fontSize: 14 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/backIcon.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Image
          source={clientData?.avatarUrl ? { uri: clientData.avatarUrl } : DEFAULT_AVATAR}
          style={styles.headerAvatar}
        />

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerNameText}>{clientData.name}</Text>
          {isTyping && <Text style={styles.typingSubtext}>typing...</Text>}
        </View>

        <TouchableOpacity style={styles.menuBtn} onPress={() => setIsMenuOpen(true)}>
          <Image
            source={require('../../assets/images/threeDots.png')}
            style={styles.threeDotsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Modal visible={isMenuOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.detailMenuCard}>
            <TouchableOpacity style={styles.menuItemRow} onPress={() => handleDetailMenuAction('AUDIO_CALL')}>
              <Text style={styles.menuItemText}>Audio Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemRow} onPress={() => handleDetailMenuAction('VIDEO_CALL')}>
              <Text style={styles.menuItemText}>Video Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemRow} onPress={() => handleDetailMenuAction('VIEW_PROFILE')}>
              <Text style={styles.menuItemText}>View Client Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemRow} onPress={() => handleDetailMenuAction('MUTE')}>
              <Text style={styles.menuItemText}>{isMuted ? 'Unmute Chat' : 'Mute Chat'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItemRow, { borderBottomWidth: 0 }]} onPress={() => handleDetailMenuAction('CLEAR_CHAT')}>
              <Text style={[styles.menuItemText, { color: COLORS.red }]}>Clear Chat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.innerContainer}>
          {isLoading ? (
            <View style={styles.loaderCenter}>
              <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderBubbleItem}
              contentContainerStyle={styles.messagesListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}

          <View style={styles.bottomBar}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Message..."
                placeholderTextColor="#77777A"
                value={inputText}
                onChangeText={handleInputChange}
                style={styles.textInput}
                multiline={false}
              />
            </View>

            <TouchableOpacity 
              style={styles.sendGlowBtn} 
              onPress={handleSendMessage} 
              disabled={isSending}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF1616', '#FF7A00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendBtnGradient}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Image
                    source={require('../../assets/images/sendArrowIcon.png')}
                    style={styles.sendIcon}
                    resizeMode="contain"
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  topGlowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 550,
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F24',
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    marginRight: 8,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.white,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerNameText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  typingSubtext: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '500',
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
  detailMenuCard: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 48 : 58,
    right: 16,
    backgroundColor: '#1E1E22',
    borderRadius: 12,
    paddingVertical: 6,
    width: 220,
    borderWidth: 1,
    borderColor: '#2C2C30',
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
  datePillContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  datePillBadge: {
    backgroundColor: '#CC0000',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  datePillText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  messagesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  otherBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 60,
  },
  myBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 16,
    paddingLeft: 60,
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  otherBubbleContainer: {
    backgroundColor: '#1E1E22',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2E',
  },
  otherBubbleText: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 18,
  },
  otherTimeText: {
    color: '#8E8E93',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 6,
  },
  myBubbleContainer: {
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 14,
  },
  myBubbleText: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 18,
  },
  myTimeText: {
    color: '#FFE0CC',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#1F1F24',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  textInput: {
    color: COLORS.white,
    fontSize: 14,
    paddingVertical: 0,
  },
  sendGlowBtn: {
    borderRadius: 22,
  },
  sendBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.white,
  },
});