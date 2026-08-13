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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import { COLORS } from '../../constants/Color';
import { socketService } from "../../services/socketService";
import { RootState } from '../../redux/store';

import { useGetMessagesQuery } from '../../redux/api/chatApi';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  senderAvatar: string;
  isMe: boolean;
}

const DEFAULT_AVATAR = require('../../assets/images/profile.png');

const ChatDetailScreen = ({ navigation, route }: any) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const token = useSelector((state: RootState) => state.auth.token);
  const clientData = route.params?.clientData;

  const conversationId = clientData?.id || clientData?._id;

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { data: initialHistory = [], isLoading } = useGetMessagesQuery(conversationId, {
    skip: !conversationId,
  });

  useEffect(() => {
    if (initialHistory.length > 0) {
      const formatted = initialHistory.map((m: any) => {
        const senderObj = m.sender || {};
        const senderId = senderObj._id || senderObj.id || senderObj;
        const isMe = senderId?.toString() === currentUserId?.toString();

        return {
          id: m._id || m.id,
          senderId,
          text: m.text || '',
          time: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '12:00PM',
          senderAvatar: senderObj.avatarUrl || '',
          isMe,
        };
      });
      setMessages(formatted);
    }
  }, [initialHistory, currentUserId]);

  useEffect(() => {
    if (!conversationId) return;
    if (token) {
      socketService.connectSocket(token);
    }

    socketService.emit('join_conversation', conversationId);

    socketService.on('receive_message', (socketMsg: any) => {
      const senderObj = socketMsg.sender || {};
      const senderId = senderObj._id || senderObj.id || senderObj;
      const isMe = senderId?.toString() === currentUserId?.toString();

      const newMsgObj: ChatMessage = {
        id: socketMsg._id || socketMsg.id || Date.now().toString(),
        senderId,
        text: socketMsg.text || '',
        time: socketMsg.createdAt
          ? new Date(socketMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderAvatar: senderObj.avatarUrl || clientData?.avatarUrl || '',
        isMe,
      };

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMsgObj.id)) return prev;
        return [...prev, newMsgObj];
      });
    });

    socketService.on('user_typing', ({ userId }: any) => {
      if (userId !== currentUserId) setIsTyping(true);
    });

    socketService.on('user_stop_typing', ({ userId }: any) => {
      if (userId !== currentUserId) setIsTyping(false);
    });

    return () => {
      socketService.emit('leave_conversation', conversationId);
      socketService.off('receive_message');
      socketService.off('user_typing');
      socketService.off('user_stop_typing');
    };
  }, [conversationId, currentUserId, clientData?.avatarUrl, token]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');

    socketService.emit('send_message', {
      conversationId,
      text: messageText,
    });

    socketService.emit('stop_typing', { conversationId });
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text.length > 0) {
      socketService.emit('typing', { conversationId });
    } else {
      socketService.emit('stop_typing', { conversationId });
    }
  };

  const renderBubbleItem = ({ item }: { item: ChatMessage }) => {
    if (item.isMe) {
      return (
        <View style={styles.myBubbleRow}>
          <View style={styles.myBubbleContainer}>
            <Text style={styles.myBubbleText}>{item.text}</Text>
            <Text style={styles.myTimeText}>{item.time}</Text>
          </View>
          <Image source={item.senderAvatar ? { uri: item.senderAvatar } : DEFAULT_AVATAR} style={styles.bubbleAvatar} />
        </View>
      );
    }

    return (
      <View style={styles.otherBubbleRow}>
        <Image source={item.senderAvatar ? { uri: item.senderAvatar } : DEFAULT_AVATAR} style={styles.bubbleAvatar} />
        <View style={styles.otherBubbleContainer}>
          <Text style={styles.otherBubbleText}>{item.text}</Text>
          <Text style={styles.otherTimeText}>{item.time}</Text>
        </View>
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

        <Image source={clientData?.avatarUrl ? { uri: clientData.avatarUrl } : DEFAULT_AVATAR} style={styles.headerAvatar} />

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerNameText}>{clientData.name}</Text>
          {isTyping && <Text style={styles.typingSubtext}>typing...</Text>}
        </View>

        <TouchableOpacity style={styles.menuBtn}>
          {/* Replaced Text with Image Tag */}
          <Image
            source={require('../../assets/images/threeDots.png')}
            style={styles.threeDotsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.datePillContainer}>
        <View style={styles.datePillBadge}>
          <Text style={styles.datePillText}>Today</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        <View style={styles.bottomBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Message..."
              placeholderTextColor="#66666A"
              value={inputText}
              onChangeText={handleInputChange}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity style={styles.sendGlowBtn} onPress={handleSendMessage}>
            <LinearGradient
              colors={['#FF1616', '#FF7A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendBtnGradient}
            >
              {/* Replaced Text Arrow with Image Tag */}
              <Image
                source={require('../../assets/images/sendArrowIcon.png')}
                style={styles.sendIcon}
                resizeMode="contain"
              />
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
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
    padding: 4,
  },
  threeDotsIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.white,
  },
  datePillContainer: {
    alignItems: 'center',
    marginVertical: 12,
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
    paddingBottom: 20,
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
    paddingVertical: 12,
    backgroundColor: COLORS.black,
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  textInput: {
    color: COLORS.white,
    fontSize: 14,
  },
  sendGlowBtn: {
    borderRadius: 22,
    shadowColor: '#FF3B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
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