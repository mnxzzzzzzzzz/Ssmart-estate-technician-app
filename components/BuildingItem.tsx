import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BuildingItemProps } from '../types/technician.types';

const BuildingItem: React.FC<BuildingItemProps> = ({
  building,
  isAssigned,
  onToggle,
}) => {
  const handleToggle = (): void => {
    onToggle(building, !isAssigned);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isAssigned && styles.containerAssigned]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconContainer,
            isAssigned && styles.iconContainerAssigned,
          ]}
        >
          <MaterialCommunityIcons
            name="office-building"
            size={24}
            color={isAssigned ? '#6366F1' : '#9E9E9E'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buildingName}>{building}</Text>
          <Text style={styles.buildingStatus}>
            {isAssigned ? 'Assigned to you' : 'Not assigned'}
          </Text>
        </View>
      </View>
      <Switch
        value={isAssigned}
        onValueChange={handleToggle}
        color="#6366F1"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  containerAssigned: {
    borderColor: '#6366F1',
    borderWidth: 2,
    backgroundColor: '#F9F9FF',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerAssigned: {
    backgroundColor: '#E8E7FF',
  },
  textContainer: {
    flex: 1,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  buildingStatus: {
    fontSize: 13,
    color: '#757575',
  },
});

export default BuildingItem;
