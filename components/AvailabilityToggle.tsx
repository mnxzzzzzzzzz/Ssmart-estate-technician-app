import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  AvailabilityStatus,
  AvailabilityToggleProps,
  AvailabilityConfig,
} from '../types/technician.types';

const availabilityConfig: AvailabilityConfig = {
  [AvailabilityStatus.AVAILABLE]: {
    label: 'Available',
    color: '#34C759',
    icon: 'check-circle',
    description: 'Ready to accept new jobs',
  },
  [AvailabilityStatus.BUSY]: {
    label: 'Busy',
    color: '#FF9500',
    icon: 'clock-alert',
    description: 'Currently working on a job',
  },
  [AvailabilityStatus.OFFDUTY]: {
    label: 'Off Duty',
    color: '#FF3B30',
    icon: 'power',
    description: 'Not accepting any jobs',
  },
  [AvailabilityStatus.ONBREAK]: {
    label: 'On Break',
    color: '#FFCC00',
    icon: 'coffee',
    description: 'Taking a short break',
  },
};

const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({
  status,
  onChange,
  disabled = false,
}) => {
  const statuses = Object.values(AvailabilityStatus);

  const handleStatusChange = (newStatus: AvailabilityStatus): void => {
    if (!disabled && newStatus !== status) {
      onChange(newStatus);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability Status</Text>
      <Text style={styles.subtitle}>Tap to change your current status</Text>
      <View style={styles.statusContainer}>
        {statuses.map((statusOption) => {
          const config = availabilityConfig[statusOption];
          const isSelected = status === statusOption;

          return (
            <TouchableOpacity
              key={statusOption}
              style={[
                styles.statusCard,
                isSelected && styles.statusCardSelected,
                isSelected && { borderColor: config.color },
                disabled && styles.statusCardDisabled,
              ]}
              onPress={() => handleStatusChange(statusOption)}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && { backgroundColor: config.color },
                ]}
              >
                <MaterialCommunityIcons
                  name={config.icon}
                  size={24}
                  color={isSelected ? '#FFFFFF' : config.color}
                />
              </View>
              <Text
                style={[
                  styles.statusLabel,
                  isSelected && styles.statusLabelSelected,
                  isSelected && { color: config.color },
                ]}
              >
                {config.label}
              </Text>
              <Text style={styles.statusDescription}>{config.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 16,
    alignItems: 'center',
  },
  statusCardSelected: {
    borderWidth: 2.5,
    backgroundColor: '#F9F9F9',
  },
  statusCardDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  statusLabelSelected: {
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'center',
  },
});

export default AvailabilityToggle;
