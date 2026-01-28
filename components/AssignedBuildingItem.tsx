import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AssignedBuildingItemProps {
  building: string;
}

const AssignedBuildingItem: React.FC<AssignedBuildingItemProps> = ({
  building,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="office-building"
            size={24}
            color="#6366F1"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buildingName}>{building}</Text>
          <Text style={styles.buildingStatus}>Assigned to you</Text>
        </View>
      </View>
      <View style={styles.assignedBadge}>
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color="#34C759"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
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
    backgroundColor: '#E8E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  assignedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AssignedBuildingItem;