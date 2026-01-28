import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ListRenderItem,
} from 'react-native';
import { Text, IconButton, Avatar, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import {
  Message,
  MessageType,
  MessageStatus,
  UserRole,
  SendMessageRequest,
  SendMessageResponse,
} from '../types/message.types';
import {
  sampleMessages,
  getMessagesByConversationId,
  getConversationById,
} from '../data/sampleMessages';
import { useTabBar } from '../contexts/TabBarContext';

interface Props {
  route: {
    params: {
      conversationId: string;
      participantName: string;
      jobId?: string;
    };
  };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    getParent: () => any;
  };
}

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId, participantName, jobId } = route.params;
  const { hideTabBar, showTabBar } = useTabBar();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('tech-1');
  const [conversation, setConversation] = useState<any>(null);

  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    loadCurrentUser();
    fetchMessages();
    loadConversation();
    // Hide tab bar when entering chat
    console.log('ChatScreen - HIDING TAB BAR');
    hideTabBar();
    
    // Show tab bar when leaving chat
    return () => {
      console.log('ChatScreen - SHOWING TAB BAR');
      showTabBar();
    };
  }, [conversationId, hideTabBar, showTabBar]);

  const loadCurrentUser = async (): Promise<void> => {
    try {
      const technicianId = await AsyncStorage.getItem('technicianId');
      if (technicianId) {
        setCurrentUserId(technicianId);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadConversation = async (): Promise<void> => {
    try {
      const conv = getConversationById(conversationId);
      setConversation(conv);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const fetchMessages = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      // For testing with sample data
      // Comment this out when connecting to real API
      const conversationMessages = getMessagesByConversationId(conversationId);
      setMessages(conversationMessages.reverse()); // Reverse to show newest at bottom
      setLoading(false);
      
      // Scroll to bottom after loading
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      return;

      // Real API call (uncomment when ready)
      /*
      const response = await fetch(
        `YOUR_API_BASE_URL/conversations/${conversationId}/messages`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: MessagesResponse = await response.json();

      if (response.ok) {
        setMessages(data.messages.reverse());
        setTimeout(() => scrollToBottom(), 100);
      } else {
        Alert.alert('Error', 'Failed to load messages');
      }
      */
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    content: string,
    type: MessageType
  ): Promise<void> => {
    if (sending) return;

    setSending(true);

    // Create optimistic message
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content,
      type,
      timestamp: new Date(),
      status: MessageStatus.SENDING,
    };

    // Add message optimistically
    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    try {
      const token = await AsyncStorage.getItem('authToken');

      // For testing - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update message status to sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, status: MessageStatus.SENT, id: `msg-${Date.now()}` }
            : msg
        )
      );
      
      setSending(false);
      return;

      // Real API call (uncomment when ready)
      /*
      const requestBody: SendMessageRequest = {
        conversationId,
        content,
        type,
      };

      const response = await fetch(`YOUR_API_BASE_URL/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data: SendMessageResponse = await response.json();

      if (response.ok) {
        // Replace temp message with real message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? data.message : msg
          )
        );
      } else {
        // Mark message as failed
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, status: MessageStatus.FAILED }
              : msg
          )
        );
        Alert.alert('Error', 'Failed to send message');
      }
      */
    } catch (error) {
      console.error('Error sending message:', error);
      // Mark message as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, status: MessageStatus.FAILED }
            : msg
        )
      );
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleAttachFile = (): void => {
    Alert.alert('Attach File', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => console.log('Take photo'),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => console.log('Choose from gallery'),
      },
      {
        text: 'Document',
        onPress: () => console.log('Choose document'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleTyping = (typing: boolean): void => {
    // Send typing indicator to server
    console.log('Typing:', typing);
  };

  const scrollToBottom = (): void => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleMessagePress = (message: Message): void => {
    if (message.type === MessageType.IMAGE || message.type === MessageType.VIDEO) {
      // Open media viewer
      console.log('Open media:', message);
    } else if (message.type === MessageType.DOCUMENT) {
      // Open document
      console.log('Open document:', message);
    }
  };

  const handleMessageLongPress = (message: Message): void => {
    const options = ['Copy', 'Delete', 'Cancel'];
    const cancelButtonIndex = 2;

    Alert.alert('Message Options', '', [
      {
        text: 'Copy',
        onPress: () => console.log('Copy message'),
      },
      {
        text: 'Delete',
        onPress: () => console.log('Delete message'),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const renderMessage: ListRenderItem<Message> = ({ item, index }) => {
    const isOwnMessage = item.senderRole === UserRole.TECHNICIAN;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showTimestamp =
      !previousMessage ||
      item.timestamp.getTime() - previousMessage.timestamp.getTime() > 5 * 60 * 1000; // 5 minutes

    return (
      <MessageBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showTimestamp={showTimestamp}
        onPress={handleMessagePress}
        onLongPress={handleMessageLongPress}
      />
    );
  };

  const renderHeader = (): React.JSX.Element => (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.headerInfo}>
        <Avatar.Text
          size={40}
          label={participantName.charAt(0).toUpperCase()}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.participantName}>{participantName}</Text>
          {conversation?.jobTitle && (
            <View style={styles.jobTitleContainer}>
              <MaterialCommunityIcons name="briefcase-outline" size={12} color="#6366F1" />
              <Text style={styles.jobTitle} numberOfLines={1}>
                {conversation.jobTitle}
              </Text>
            </View>
          )}
          {isTyping && (
            <Text style={styles.typingIndicator}>typing...</Text>
          )}
        </View>
      </View>
      <IconButton
        icon="dots-vertical"
        size={24}
        onPress={() => {
          Alert.alert('Options', 'Chat options', [
            { text: 'View Job Details', onPress: handleViewJobDetails },
            { text: 'Block User', onPress: () => console.log('Block') },
            { text: 'Cancel', style: 'cancel' },
          ]);
        }}
      />
    </View>
  );

  const handleViewJobDetails = (): void => {
    if (!jobId) {
      Alert.alert('Error', 'Job ID not available');
      return;
    }

    try {
      // Navigate to the root navigator's JobDetails screen
      const rootNavigation = navigation.getParent()?.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('JobDetails', {
          jobId: jobId,
          jobTitle: `Job #${jobId}`,
        });
      } else {
        // Fallback: navigate to Jobs tab and then to JobDetails
        navigation.getParent()?.navigate('JobsTab', {
          screen: 'JobDetails',
          params: {
            jobId: jobId,
            jobTitle: `Job #${jobId}`,
          },
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to job details');
    }
  };

  const renderEmptyState = (): React.JSX.Element => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="message-text-outline" size={64} color="#BDBDBD" />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>Start the conversation!</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {renderHeader()}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          messages.length === 0 ? styles.emptyList : styles.messageList
        }
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput
        onSendMessage={sendMessage}
        onAttachFile={handleAttachFile}
        onTyping={handleTyping}
        disabled={sending}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#6366F1',
  },
  headerText: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  jobTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  jobTitle: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  typingIndicator: {
    fontSize: 12,
    color: '#6366F1',
    fontStyle: 'italic',
    marginTop: 2,
  },
  messageList: {
    paddingVertical: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
  },
});

export default ChatScreen;
