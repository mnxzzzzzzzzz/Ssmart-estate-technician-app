import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const FilterChip = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FilterChip;
