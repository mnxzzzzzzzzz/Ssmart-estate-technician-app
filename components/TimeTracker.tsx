import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeTracking } from '../types';

interface Props {
  jobId: number;
  timeTracking: TimeTracking;
  onUpdate: (timeTracking: TimeTracking) => void;
}

const TimeTracker: React.FC<Props> = ({ jobId, timeTracking, onUpdate }) => {
  const [displayTime, setDisplayTime] = useState<string>('0h 0m');

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timeTracking.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const startTime = new Date(timeTracking.startTime!).getTime();
        const elapsed = Math.floor((now - startTime) / 1000) + timeTracking.elapsedTime;
        setDisplayTime(formatTime(elapsed));
      }, 1000);
    } else {
      setDisplayTime(formatTime(timeTracking.elapsedTime));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeTracking]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleStartTimer = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const startTime = new Date().toISOString();

      const response = await fetch(`YOUR_API_BASE_URL/jobs/${jobId}/time`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'start',
          startTime,
        }),
      });

      if (response.ok) {
        onUpdate({
          isRunning: true,
          startTime,
          elapsedTime: timeTracking.elapsedTime,
        });
      } else {
        Alert.alert('Error', 'Failed to start timer');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleStopTimer = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const now = Date.now();
      const startTime = new Date(timeTracking.startTime!).getTime();
      const sessionTime = Math.floor((now - startTime) / 1000);
      const totalElapsed = timeTracking.elapsedTime + sessionTime;

      const response = await fetch(`YOUR_API_BASE_URL/jobs/${jobId}/time`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'stop',
          elapsedTime: totalElapsed,
        }),
      });

      if (response.ok) {
        onUpdate({
          isRunning: false,
          startTime: null,
          elapsedTime: totalElapsed,
        });
      } else {
        Alert.alert('Error', 'Failed to stop timer');
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#6366F1" />
            <Text style={styles.title}>Time Tracking</Text>
          </View>
          {timeTracking.isRunning && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}
        </View>

        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{displayTime}</Text>
          <Text style={styles.timeLabel}>Time Spent</Text>
        </View>

        <View style={styles.buttonContainer}>
          {!timeTracking.isRunning ? (
            <Button
              mode="contained"
              onPress={handleStartTimer}
              icon="play"
              style={styles.startButton}
              contentStyle={styles.buttonContent}
            >
              Start Timer
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleStopTimer}
              icon="stop"
              style={styles.stopButton}
              contentStyle={styles.buttonContent}
            >
              Stop Timer
            </Button>
          )}
        </View>

        {timeTracking.elapsedTime > 0 && (
          <Text style={styles.infoText}>
            Total time will be recorded for billing and reporting
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  timeDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: '#757575',
  },
  buttonContainer: {
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TimeTracker;
