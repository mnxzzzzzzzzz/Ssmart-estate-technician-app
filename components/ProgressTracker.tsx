import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressStep, JobStatus } from '../types';

interface Props {
  steps: ProgressStep[];
  currentStatus: JobStatus;
  onStepPress: (status: JobStatus) => void;
}

type StepStatus = 'completed' | 'current' | 'upcoming';

const ProgressTracker: React.FC<Props> = ({ steps, currentStatus, onStepPress }) => {
  const getCurrentStepIndex = (): number => {
    return steps.findIndex((step) => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: StepStatus): string => {
    if (status === 'completed') return '#34C759';
    if (status === 'current') return '#6366F1';
    return '#E0E0E0';
  };

  const renderStep = (step: ProgressStep, index: number) => {
    const status = getStepStatus(index);
    const color = getStepColor(status);
    const isLast = index === steps.length - 1;

    return (
      <View key={step.id} style={styles.stepContainer}>
        <View style={styles.stepContent}>
          {/* Connector Line (before) */}
          {index > 0 && (
            <View
              style={[
                styles.connectorLine,
                styles.connectorBefore,
                {
                  backgroundColor:
                    status === 'completed' || status === 'current'
                      ? '#34C759'
                      : '#E0E0E0',
                },
              ]}
            />
          )}

          {/* Step Circle */}
          <TouchableOpacity
            onPress={() => onStepPress(step.status)}
            activeOpacity={0.7}
            style={[styles.stepCircle, { borderColor: color }]}
          >
            {status === 'completed' ? (
              <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
            ) : status === 'current' ? (
              <View style={[styles.currentDot, { backgroundColor: color }]} />
            ) : (
              <View style={[styles.upcomingDot, { backgroundColor: color }]} />
            )}
            {status === 'completed' && (
              <View style={[styles.completedBackground, { backgroundColor: color }]} />
            )}
            {status === 'current' && (
              <View style={[styles.currentBackground, { backgroundColor: color }]} />
            )}
          </TouchableOpacity>

          {/* Connector Line (after) */}
          {!isLast && (
            <View
              style={[
                styles.connectorLine,
                styles.connectorAfter,
                {
                  backgroundColor:
                    status === 'completed' ? '#34C759' : '#E0E0E0',
                },
              ]}
            />
          )}
        </View>

        {/* Step Label */}
        <Text
          style={[
            styles.stepLabel,
            {
              color: status === 'current' ? '#6366F1' : '#757575',
              fontWeight: status === 'current' ? '600' : '400',
            },
          ]}
        >
          {step.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>{steps.map(renderStep)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepContent: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  completedBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: -1,
  },
  currentBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.2,
    zIndex: -1,
  },
  currentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  upcomingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectorLine: {
    position: 'absolute',
    height: 2,
    top: 19,
    zIndex: 1,
  },
  connectorBefore: {
    left: 0,
    right: '50%',
  },
  connectorAfter: {
    left: '50%',
    right: 0,
  },
  stepLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ProgressTracker;
