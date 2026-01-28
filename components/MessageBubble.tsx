import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  MessageBubbleProps,
  MessageType,
  MessageStatus,
} from '../types/message.types';

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showTimestamp = true,
  showSenderName = false,
  onPress,
  onLongPress,
}) => {
  const formatTime = (date: Date): string => {
    try {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (error) {
      return 'Invalid time';
    }
  };

  const getStatusIcon = (status: MessageStatus): string => {
    switch (status) {
      case MessageStatus.SENDING:
        return 'clock-outline';
      case MessageStatus.SENT:
        return 'check';
      case MessageStatus.DELIVERED:
        return 'check-all';
      case MessageStatus.READ:
        return 'check-all';
      case MessageStatus.FAILED:
        return 'alert-circle-outline';
      default:
        return 'check';
    }
  };

  const getStatusColor = (status: MessageStatus): string => {
    switch (status) {
      case MessageStatus.READ:
        return '#2196F3';
      case MessageStatus.FAILED:
        return '#FF3B30';
      default:
        return '#FFFFFF';
    }
  };

  const renderContent = (): React.JSX.Element => {
    return (
      <Text 
        style={[
          styles.messageText,
          { color: isOwnMessage ? '#FFFFFF' : '#212121' }
        ]}
      >
        {message.content || 'No content'}
      </Text>
    );
  };

  if (message.type === MessageType.SYSTEM) {
    return (
      <View style={styles.systemMessageContainer}>
        <View style={styles.systemMessageBubble}>
          <Text style={styles.systemMessageText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {showSenderName && !isOwnMessage && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      <TouchableOpacity
        onPress={() => onPress?.(message)}
        onLongPress={() => onLongPress?.(message)}
        activeOpacity={0.8}
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {renderContent()}

        <View style={styles.messageFooter}>
          {showTimestamp && (
            <Text
              style={[
                styles.timestamp,
                isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>
          )}
          {isOwnMessage && (
            <MaterialCommunityIcons
              name={getStatusIcon(message.status)}
              size={14}
              color={getStatusColor(message.status)}
              style={styles.statusIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownBubble: {
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTimestamp: {
    color: '#757575',
  },
  statusIcon: {
    marginLeft: 2,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageBubble: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  systemMessageText: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
  },
});

export default MessageBubble;