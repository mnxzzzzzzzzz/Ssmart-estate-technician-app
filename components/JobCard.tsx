import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PriorityBadge from './PriorityBadge';
import { Job, JobCategory, JobStatus } from '../types';

interface Props {
  job: Job;
  onPress: () => void;
}

const JobCard: React.FC<Props> = ({ job, onPress }) => {
  const getCategoryIcon = (category: JobCategory): string => {
    const icons: Record<JobCategory, string> = {
      Plumbing: 'pipe-wrench',
      Electrical: 'lightning-bolt',
      HVAC: 'air-conditioner',
      Carpentry: 'hammer',
      Maintenance: 'tools',
    };
    return icons[category] || 'wrench';
  };

  const getStatusColor = (status: JobStatus): string => {
    const colors: Record<JobStatus, string> = {
      Assigned: '#2196F3',
      Accepted: '#4CAF50',
      'In Progress': '#FF9500',
      'En Route': '#2196F3',
      'On Site': '#FF9500',
      Working: '#FF9500',
      Completed: '#34C759',
    };
    return colors[status] || '#757575';
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const jobTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - jobTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {job.title}
            </Text>
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#757575" />
              <Text style={styles.timeText}>{formatTimeAgo(job.createdAt)}</Text>
            </View>
          </View>

          {/* Priority Badge */}
          <View style={styles.badgeRow}>
            <PriorityBadge priority={job.priority} />
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(job.status) },
              ]}
            >
              <Text style={styles.statusText}>{job.status}</Text>
            </View>
          </View>

          {/* Category Row */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={getCategoryIcon(job.category)}
              size={18}
              color="#6366F1"
            />
            <Text style={styles.categoryText}>{job.category}</Text>
          </View>

          {/* Location Row */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color="#757575" />
            <Text style={styles.infoText}>
              {job.location.building}, {job.location.apartment}
            </Text>
          </View>

          {/* Time Slot Row */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-clock" size={18} color="#757575" />
            <Text style={styles.infoText}>{job.timeSlot}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#757575',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default JobCard;
