import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface PlaceholderScreenProps {
  title: string;
  message?: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ 
  title, 
  message = 'This screen is coming soon!' 
}) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.message}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    color: '#6366F1',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: '#666',
    textAlign: 'center',
  },
});

export default PlaceholderScreen;
