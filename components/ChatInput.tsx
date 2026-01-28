import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChatInputProps, MessageType } from '../types/message.types';

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onAttachFile,
  onTyping,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTextChange = (text: string): void => {
    setMessage(text);

    // Typing indicator logic
    if (onTyping) {
      if (!isTyping && text.length > 0) {
        setIsTyping(true);
        onTyping(true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 2000);
    }
  };

  const handleSend = (): void => {
    const trimmedMessage = message.trim();
    
    if (trimmedMessage.length === 0 || disabled) {
      return;
    }

    onSendMessage(trimmedMessage, MessageType.TEXT);
    setMessage('');
    
    // Stop typing indicator
    if (isTyping && onTyping) {
      setIsTyping(false);
      onTyping(false);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    Keyboard.dismiss();
  };

  const handleAttach = (): void => {
    if (onAttachFile && !disabled) {
      onAttachFile();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={handleAttach}
          disabled={disabled}
          style={styles.attachButton}
        >
          <MaterialCommunityIcons
            name="paperclip"
            size={24}
            color={disabled ? '#BDBDBD' : '#6366F1'}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          multiline
          maxLength={1000}
          editable={!disabled}
          returnKeyType="default"
          blurOnSubmit={false}
        />

        {message.trim().length > 0 ? (
          <TouchableOpacity
            onPress={handleSend}
            disabled={disabled}
            style={[
              styles.sendButton,
              disabled && styles.sendButtonDisabled,
            ]}
          >
            <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              // Voice message functionality placeholder
              console.log('Voice message');
            }}
            disabled={disabled}
            style={styles.voiceButton}
          >
            <MaterialCommunityIcons
              name="microphone"
              size={24}
              color={disabled ? '#BDBDBD' : '#6366F1'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    color: '#212121',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  voiceButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});

export default ChatInput;
