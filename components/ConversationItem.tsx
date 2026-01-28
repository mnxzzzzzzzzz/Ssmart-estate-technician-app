import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, Button, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ConversationItemProps } from '../types/message.types';

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const otherParticipant = conversation.participants.find(
    (p) => p.role !== 'technician'
  );

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleViewTicket = (): void => {
    onPress(conversation);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleViewTicket} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {otherParticipant?.avatarUrl ? (
          <Avatar.Image
            size={56}
            source={{ uri: otherParticipant.avatarUrl }}
          />
        ) : (
          <Avatar.Text
            size={56}
            label={getInitials(otherParticipant?.name || 'U')}
            style={styles.avatar}
          />
        )}
        {otherParticipant?.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.participantName} numberOfLines={1}>
            {otherParticipant?.name || 'Unknown'}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(conversation.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.jobRow}>
          <MaterialCommunityIcons name="briefcase-outline" size={14} color="#6366F1" />
          <Text style={styles.jobTitle} numberOfLines={1}>
            {conversation.jobTitle || 'General Inquiry'}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {conversation.lastMessage.senderRole === 'technician' ? 'You: ' : ''}
            {conversation.lastMessage.content}
          </Text>
          {conversation.unreadCount > 0 && (
            <Badge style={styles.unreadBadge} size={20}>
              {conversation.unreadCount}
            </Badge>
          )}
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Button
          mode="contained"
          onPress={handleViewTicket}
          style={styles.chatButton}
          labelStyle={styles.chatButtonText}
          contentStyle={styles.chatButtonContent}
          icon="message-text"
        >
          Chat
        </Button>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    backgroundColor: '#6366F1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: '#6366F1',
    marginLeft: 8,
  },
  actionContainer: {
    marginLeft: 12,
  },
  chatButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
  },
  chatButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  chatButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ConversationItem;
