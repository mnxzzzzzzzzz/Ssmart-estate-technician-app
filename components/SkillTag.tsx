import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TechnicianSkill, SkillTagProps, SkillConfig } from '../types/technician.types';

const skillConfig: SkillConfig = {
  [TechnicianSkill.HVAC]: {
    icon: 'air-conditioner',
    color: '#2196F3',
  },
  [TechnicianSkill.PLUMBING]: {
    icon: 'pipe-wrench',
    color: '#00BCD4',
  },
  [TechnicianSkill.ELECTRICAL]: {
    icon: 'lightning-bolt',
    color: '#FFC107',
  },
  [TechnicianSkill.CARPENTRY]: {
    icon: 'hammer',
    color: '#795548',
  },
  [TechnicianSkill.MAINTENANCE]: {
    icon: 'tools',
    color: '#9E9E9E',
  },
  [TechnicianSkill.PAINTING]: {
    icon: 'format-paint',
    color: '#E91E63',
  },
  [TechnicianSkill.LANDSCAPING]: {
    icon: 'tree',
    color: '#4CAF50',
  },
  [TechnicianSkill.SECURITY]: {
    icon: 'shield-check',
    color: '#F44336',
  },
};

const SkillTag: React.FC<SkillTagProps> = ({
  skill,
  isSelected = false,
  onPress,
  removable = false,
  showIcon = true,
}) => {
  const config = skillConfig[skill];

  const handlePress = (): void => {
    if (onPress) {
      onPress(skill);
    }
  };

  const handleRemove = (e: any): void => {
    e.stopPropagation();
    if (onPress) {
      onPress(skill);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        { borderColor: config.color },
        isSelected && { backgroundColor: `${config.color}15` },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!onPress && !removable}
    >
      {showIcon && (
        <MaterialCommunityIcons
          name={config.icon}
          size={16}
          color={isSelected ? config.color : '#757575'}
        />
      )}
      <Text
        style={[
          styles.text,
          isSelected && styles.textSelected,
          isSelected && { color: config.color },
        ]}
      >
        {skill}
      </Text>
      {removable && isSelected && (
        <IconButton
          icon="close-circle"
          size={16}
          iconColor={config.color}
          onPress={handleRemove}
          style={styles.removeButton}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    gap: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  containerSelected: {
    borderWidth: 2,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#757575',
  },
  textSelected: {
    fontWeight: '600',
  },
  removeButton: {
    margin: 0,
    marginLeft: -4,
  },
});

export default SkillTag;
