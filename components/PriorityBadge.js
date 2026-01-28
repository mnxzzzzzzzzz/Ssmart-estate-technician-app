import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    const configs = {
      Urgent: {
        color: '#FF3B30',
        icon: 'alert-circle',
        label: 'Urgent',
      },
      High: {
        color: '#FF9500',
        icon: 'arrow-up-circle',
        label: 'High',
      },
      Medium: {
        color: '#FFCC00',
        icon: 'minus-circle',
        label: 'Medium',
      },
      Low: {
        color: '#34C759',
        icon: 'arrow-down-circle',
        label: 'Low',
      },
    };
    return configs[priority] || configs.Medium;
  };

  const config = getPriorityConfig(priority);

  return (
    <View style={[styles.container, { backgroundColor: config.color }]}>
      <Icon name={config.icon} size={14} color="#FFFFFF" />
      <Text style={styles.text}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PriorityBadge;
