import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MaterialItem = ({ material, onDelete, onEdit }) => {
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="package-variant" size={24} color="#6366F1" />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.materialName}>{material.name}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Qty: {material.quantity}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detailText}>
            {formatCurrency(material.unitPrice)} each
          </Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.totalPrice}>
          {formatCurrency(material.quantity * material.unitPrice)}
        </Text>
        <View style={styles.actionsContainer}>
          {onEdit && (
            <IconButton
              icon="pencil"
              size={18}
              iconColor="#757575"
              onPress={onEdit}
              style={styles.actionButton}
            />
          )}
          <IconButton
            icon="delete"
            size={18}
            iconColor="#FF3B30"
            onPress={onDelete}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  materialName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#757575',
  },
  separator: {
    fontSize: 13,
    color: '#BDBDBD',
    marginHorizontal: 6,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: -8,
  },
  actionButton: {
    margin: 0,
  },
});

export default MaterialItem;
