import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { JobsStackScreenProps } from '../types/navigation.types';
import { useTabBar } from '../contexts/TabBarContext';
import { getJobById, updateJobStatus, completeJob, Job } from '../services/api';

type JobDetailsScreenProps = JobsStackScreenProps<'JobDetails'>;

const STATUS_STEPS = ['assigned', 'in-progress', 'completed'];
const STATUS_LABELS: Record<string, string> = {
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  completed: 'Completed',
  pending: 'Pending',
  escalated: 'Escalated',
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'urgent': case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    default: return '#34C759';
  }
};

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ navigation, route }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { hideTabBar, showTabBar } = useTabBar();

  useEffect(() => {
    hideTabBar();
    return () => showTabBar();
  }, [hideTabBar, showTabBar]);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await getJobById(jobId);
      setJob(response.data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!job) return;
    setUpdating(true);
    try {
      const response = await updateJobStatus(job.id, 'in-progress', 'Job accepted by technician');
      setJob(response.data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to accept job');
    } finally {
      setUpdating(false);
    }
  };

  const handleDecline = async () => {
    Alert.alert('Decline Job', 'Are you sure you want to decline this job?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          setUpdating(true);
          try {
            await updateJobStatus(job!.id, 'pending', 'Declined by technician');
            navigation.goBack();
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to decline job');
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  const handleFinish = async () => {
    if (!job) return;
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: async () => {
          setUpdating(true);
          try {
            const response = await completeJob(job.id, { notes: 'Job completed by technician' });
            setJob(response.data);
            Alert.alert('Success', 'Job marked as completed');
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to complete job');
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  const renderStatusTimeline = () => {
    if (!job) return null;
    const currentIndex = STATUS_STEPS.indexOf(job.status);

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.jobTitle}>{job.issueCategory}</Text>
        <Text style={styles.ticketId}>{job.ticketId}</Text>

        <View style={styles.timeline}>
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <View key={step} style={styles.timelineStep}>
                {index > 0 && (
                  <View style={[styles.connectingLine, index <= currentIndex ? styles.completedLine : styles.pendingLine]} />
                )}
                <View style={[
                  styles.stepCircle,
                  isCompleted && styles.completedCircle,
                  isCurrent && styles.currentCircle,
                  !isCompleted && !isCurrent && styles.pendingCircle,
                ]}>
                  {isCompleted && <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />}
                  {isCurrent && <View style={styles.currentDot} />}
                </View>
                <Text style={[styles.stepLabel, (isCompleted || isCurrent) ? styles.activeLabel : styles.pendingLabel]}>
                  {STATUS_LABELS[step]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="close" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="close" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAssigned = job.status === 'assigned';
  const isCompleted = job.status === 'completed';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="close" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Job Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStatusTimeline()}

        <View style={styles.infoCard}>
          <Text style={styles.categoryText}>{job.issueCategory}</Text>
          {job.slaDeadline && (
            <Text style={styles.timeText}>Due: {new Date(job.slaDeadline).toLocaleString()}</Text>
          )}

          <Text style={styles.descriptionLabel}>Description:</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.priorityContainer}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(job.priority) }]} />
              <Text style={styles.priorityText}>{job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}</Text>
            </View>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
              <Text style={styles.locationText}>{job.building}, {job.unit}</Text>
            </View>
          </View>

          <View style={styles.tenantRow}>
            <MaterialCommunityIcons name="account" size={16} color="#6B7280" />
            <Text style={styles.tenantText}>Tenant: {job.tenant}</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {!isCompleted && (
        <View style={styles.bottomContainer}>
          {isAssigned ? (
            <>
              <Button
                mode="outlined"
                onPress={handleDecline}
                style={styles.declineButton}
                labelStyle={styles.declineButtonText}
                disabled={updating}
              >
                Decline Job
              </Button>
              <Button
                mode="contained"
                onPress={handleAccept}
                style={styles.acceptButton}
                labelStyle={styles.acceptButtonText}
                loading={updating}
                disabled={updating}
              >
                Accept Job
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={handleFinish}
              style={styles.finishButton}
              labelStyle={styles.finishButtonText}
              loading={updating}
              disabled={updating}
            >
              Finish Job
            </Button>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#6366F1' },
  content: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#6B7280' },
  errorText: { color: '#FF3B30', fontSize: 16 },
  timelineContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 20 },
  jobTitle: { fontSize: 20, fontWeight: 'bold', color: '#000000', textAlign: 'center', marginBottom: 4 },
  ticketId: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginBottom: 20 },
  timeline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 10 },
  timelineStep: { alignItems: 'center', flex: 1, position: 'relative' },
  connectingLine: { position: 'absolute', top: 15, left: -50, width: 100, height: 2, zIndex: 1 },
  completedLine: { backgroundColor: '#6366F1' },
  pendingLine: { backgroundColor: '#E5E7EB' },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', zIndex: 3, marginBottom: 8 },
  completedCircle: { backgroundColor: '#6366F1' },
  currentCircle: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#6366F1' },
  pendingCircle: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E5E7EB' },
  currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366F1' },
  stepLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center', maxWidth: 65, lineHeight: 13 },
  activeLabel: { color: '#374151', fontWeight: '600' },
  pendingLabel: { color: '#9CA3AF' },
  infoCard: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 20, marginTop: 8 },
  categoryText: { fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 4 },
  timeText: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  descriptionLabel: { fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 4 },
  descriptionText: { fontSize: 16, color: '#6B7280', lineHeight: 24, marginBottom: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  priorityContainer: { flexDirection: 'row', alignItems: 'center' },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  priorityText: { fontSize: 16, fontWeight: '600', color: '#000000' },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 14, color: '#6B7280', marginLeft: 4 },
  tenantRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tenantText: { fontSize: 14, color: '#6B7280' },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32 },
  declineButton: { borderColor: '#6366F1', borderWidth: 1, borderRadius: 25, paddingVertical: 4, marginBottom: 12 },
  declineButtonText: { fontSize: 16, fontWeight: '600', color: '#6366F1' },
  acceptButton: { backgroundColor: '#6366F1', borderRadius: 25, paddingVertical: 4 },
  acceptButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  finishButton: { backgroundColor: '#6366F1', borderRadius: 25, paddingVertical: 4 },
  finishButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default JobDetailsScreen;
