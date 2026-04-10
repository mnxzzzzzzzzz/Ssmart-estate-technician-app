import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { Text, Searchbar, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConversationItem from '../components/ConversationItem';
import { Conversation } from '../types/message.types';
import { getConversations, ApiConversation } from '../services/api';

interface Props {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

const MessagesScreen: React.FC<Props> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);

  const fetchConversations = async (): Promise<void> => {
    try {
      const response = await getConversations();
      // Map API conversations to the local Conversation type
      const mapped: Conversation[] = response.data.conversations.map((c: ApiConversation) => ({
        id: c.id,
        participants: c.participants.map(p => ({
          id: p.id,
          name: p.name,
          role: p.role as any,
          avatarUrl: undefined,
        })),
        lastMessage: {
          id: c.id + '-last',
          conversationId: c.id,
          senderId: c.lastMessage.senderId,
          senderName: '',
          senderRole: 'tenant' as any,
          content: c.lastMessage.content,
          type: 'text' as any,
          timestamp: new Date(c.lastMessage.timestamp),
          status: 'delivered' as any,
        },
        unreadCount: c.unreadCount,
        jobId: undefined,
        jobTitle: c.jobTitle,
        ticketId: c.ticketId,
      }));
      setConversations(mapped);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Keep empty list on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterConversations = (): void => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = conversations.filter((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p.role !== 'technician'
      );
      const participantName = otherParticipant?.name.toLowerCase() || '';
      const jobTitle = conv.jobTitle?.toLowerCase() || '';
      const lastMessageContent = conv.lastMessage.content.toLowerCase();

      return (
        participantName.includes(query) ||
        jobTitle.includes(query) ||
        lastMessageContent.includes(query)
      );
    });

    setFilteredConversations(filtered);
  };

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    fetchConversations();
  }, []);

  const handleConversationPress = (conversation: Conversation): void => {
    const otherParticipant = conversation.participants.find(
      (p) => p.role !== 'technician'
    );

    navigation.navigate('Chat', {
      conversationId: conversation.id,
      participantName: otherParticipant?.name || 'Unknown',
      jobId: conversation.jobId,
    });
  };

  const handleNewMessage = (): void => {
    // Navigate to contact selection or new message screen
    console.log('New message');
  };

  const renderConversationItem: ListRenderItem<Conversation> = ({ item }) => (
    <ConversationItem
      conversation={item}
      onPress={handleConversationPress}
    />
  );

  const renderEmptyState = (): React.JSX.Element => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="message-outline" size={80} color="#BDBDBD" />
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your conversations with tenants will appear here
      </Text>
    </View>
  );

  const renderHeader = (): React.JSX.Element => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Messages</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="message-processing" size={48} color="#6366F1" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <Searchbar
        placeholder="Search conversations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#6366F1"
        inputStyle={styles.searchInput}
      />

      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredConversations.length === 0 ? styles.emptyList : undefined
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="message-plus"
        style={styles.fab}
        onPress={handleNewMessage}
        color="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 12,
    elevation: 0,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    fontSize: 15,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6366F1',
  },
});

export default MessagesScreen;
