import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { JobPriority } from '../types';

interface PriorityConfig {
  color: string;
  icon: string;
  label: string;
}

interface Props {
  priority: JobPriority;
}

const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const getPriorityConfig = (priority: JobPriority): PriorityConfig => {
    const configs: Record<JobPriority, PriorityConfig> = {
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
    return configs[priority];
  };

  const config = getPriorityConfig(priority);

  return (
    <View style={[styles.container, { backgroundColor: config.color }]}>
      <MaterialCommunityIcons name={config.icon} size={14} color="#FFFFFF" />
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
