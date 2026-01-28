import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Text,
  IconButton,
  Button,
  Card,
  Chip,
  TextInput,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProgressTracker from './components/ProgressTracker';
import MediaUploader from './components/MediaUploader';
import MaterialItem from './components/MaterialItem';
import TimeTracker from './components/TimeTracker';

const JobDetailsScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [materials, setMaterials] = useState([]);
  const [media, setMedia] = useState([]);
  const [timeTracking, setTimeTracking] = useState({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
  });
  const [savingNotes, setSavingNotes] = useState(false);

  const progressSteps = [
    { id: 1, label: 'Assigned', status: 'Assigned' },
    { id: 2, label: 'Accepted', status: 'Accepted' },
    { id: 3, label: 'En Route', status: 'En Route' },
    { id: 4, label: 'On Site', status: 'On Site' },
    { id: 5, label: 'Working', status: 'Working' },
    { id: 6, label: 'Completed', status: 'Completed' },
  ];

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    // Auto-save notes after 2 seconds of inactivity
    const timer = setTimeout(() => {
      if (notes && notes !== job?.notes) {
        saveNotes();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [notes]);

  const fetchJobDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`YOUR_API_BASE_URL/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setJob(data.job);
        setNotes(data.job.notes || '');
        setMaterials(data.job.materials || []);
        setMedia(data.job.media || []);
        setTimeTracking({
          isRunning: data.job.timeTracking?.isRunning || false,
          startTime: data.job.timeTracking?.startTime || null,
          elapsedTime: data.job.timeTracking?.elapsedTime || 0,
        });
      } else {
        Alert.alert('Error', 'Failed to fetch job details');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobDetails();
  };

  const updateJobStatus = async (newStatus) => {
    Alert.alert(
      'Update Status',
      `Are you sure you want to update the status to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');

              const response = await fetch(
                `YOUR_API_BASE_URL/jobs/${jobId}/status`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ status: newStatus }),
                }
              );

              if (response.ok) {
                setJob({ ...job, status: newStatus });
                Alert.alert('Success', 'Job status updated successfully');
              } else {
                Alert.alert('Error', 'Failed to update job status');
              }
            } catch (error) {
              console.error('Error updating status:', error);
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`YOUR_API_BASE_URL/jobs/${jobId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        console.log('Notes saved successfully');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAcceptJob = () => {
    updateJobStatus('Accepted');
  };

  const handleStartJob = () => {
    updateJobStatus('Working');
  };

  const handleCompleteJob = () => {
    if (media.length === 0) {
      Alert.alert(
        'Photos Required',
        'Please upload at least one photo before completing the job.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Complete Job',
      'Are you sure you want to mark this job as completed? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'destructive',
          onPress: () => updateJobStatus('Completed'),
        },
      ]
    );
  };

  const handleAddMaterial = () => {
    navigation.navigate('AddMaterial', {
      jobId,
      onMaterialAdded: (material) => {
        setMaterials([...materials, material]);
      },
    });
  };

  const handleDeleteMaterial = (materialId) => {
    Alert.alert('Delete Material', 'Are you sure you want to delete this material?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMaterials(materials.filter((m) => m.id !== materialId));
        },
      },
    ]);
  };

  const handleMediaUpload = (newMedia) => {
    setMedia([...media, ...newMedia]);
  };

  const handleShareJob = () => {
    // Implement share functionality
    Alert.alert('Share', 'Share job report functionality');
  };

  const handleDownloadReport = () => {
    // Implement PDF download
    Alert.alert('Download', 'Download PDF report functionality');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Plumbing: 'pipe-wrench',
      Electrical: 'lightning-bolt',
      HVAC: 'air-conditioner',
      Carpentry: 'hammer',
      Maintenance: 'tools',
    };
    return icons[category] || 'wrench';
  };

  const renderActionButton = () => {
    if (!job) return null;

    if (job.status === 'Assigned') {
      return (
        <Button
          mode="contained"
          onPress={handleAcceptJob}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
          icon="check-circle"
        >
          Accept Job
        </Button>
      );
    }

    if (job.status === 'Accepted' || job.status === 'En Route' || job.status === 'On Site') {
      return (
        <Button
          mode="contained"
          onPress={handleStartJob}
          style={[styles.actionButton, { backgroundColor: '#FF9500' }]}
          contentStyle={styles.actionButtonContent}
          icon="play-circle"
        >
          Start Job
        </Button>
      );
    }

    if (job.status === 'Working') {
      return (
        <Button
          mode="contained"
          onPress={handleCompleteJob}
          style={[styles.actionButton, { backgroundColor: '#34C759' }]}
          contentStyle={styles.actionButtonContent}
          icon="check-all"
        >
          Mark Complete
        </Button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={80} color="#FF3B30" />
        <Text style={styles.errorTitle}>Job Not Found</Text>
        <Text style={styles.errorSubtitle}>
          Unable to load job details. Please try again.
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {job.title}
        </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={handleShareJob} title="Share" leadingIcon="share" />
          <Menu.Item
            onPress={handleDownloadReport}
            title="Download Report"
            leadingIcon="download"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              Alert.alert('Report', 'Report issue functionality');
            }}
            title="Report Issue"
            leadingIcon="flag"
          />
        </Menu>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
          />
        }
      >
        {/* Progress Tracker */}
        <ProgressTracker
          steps={progressSteps}
          currentStatus={job.status}
          onStepPress={updateJobStatus}
        />

        {/* Job Information Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoHeader}>
              <Chip
                icon={getCategoryIcon(job.category)}
                style={styles.categoryChip}
                textStyle={styles.categoryChipText}
              >
                {job.category}
              </Chip>
              {job.priority === 'Urgent' && (
                <Chip
                  icon="fire"
                  style={styles.urgentChip}
                  textStyle={styles.urgentChipText}
                >
                  Urgent
                </Chip>
              )}
            </View>

            {/* Time Slot */}
            <View style={styles.infoRow}>
              <Icon name="calendar-clock" size={20} color="#6366F1" />
              <Text style={styles.infoText}>{job.timeSlot}</Text>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
              <Icon name="map-marker" size={20} color="#6366F1" />
              <View style={styles.locationTextContainer}>
                <Text style={styles.infoText}>
                  {job.location.building}, {job.location.apartment}
                </Text>
                {job.location.address && (
                  <Text style={styles.addressText}>{job.location.address}</Text>
                )}
              </View>
            </View>

            {/* Tenant Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Tenant Description</Text>
              <Text style={styles.descriptionText}>{job.description}</Text>
            </View>

            {/* Tenant Contact */}
            {job.tenant && (
              <View style={styles.tenantSection}>
                <Text style={styles.sectionTitle}>Tenant Contact</Text>
                <View style={styles.tenantInfo}>
                  <Icon name="account" size={20} color="#757575" />
                  <Text style={styles.tenantText}>{job.tenant.name}</Text>
                </View>
                <View style={styles.tenantInfo}>
                  <Icon name="phone" size={20} color="#757575" />
                  <Text style={styles.tenantText}>{job.tenant.phone}</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Button */}
        {renderActionButton()}

        {/* Time Tracker */}
        <TimeTracker
          jobId={jobId}
          timeTracking={timeTracking}
          onUpdate={setTimeTracking}
        />

        {/* Notes Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Technician Notes</Text>
              {savingNotes && (
                <View style={styles.savingIndicator}>
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text style={styles.savingText}>Saving...</Text>
                </View>
              )}
            </View>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about the job, issues found, work performed, etc."
              style={styles.notesInput}
              outlineColor="#E0E0E0"
              activeOutlineColor="#6366F1"
            />
            <Text style={styles.characterCount}>{notes.length} characters</Text>
          </Card.Content>
        </Card>

        {/* Materials Used */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Materials Used</Text>
              <Button
                mode="outlined"
                onPress={handleAddMaterial}
                icon="plus"
                compact
              >
                Add Material
              </Button>
            </View>
            {materials.length === 0 ? (
              <Text style={styles.emptyText}>No materials added yet</Text>
            ) : (
              materials.map((material) => (
                <MaterialItem
                  key={material.id}
                  material={material}
                  onDelete={() => handleDeleteMaterial(material.id)}
                />
              ))
            )}
          </Card.Content>
        </Card>

        {/* Media Upload */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Photos & Videos</Text>
            <MediaUploader
              jobId={jobId}
              media={media}
              onMediaUpload={handleMediaUpload}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#E8E7FF',
  },
  categoryChipText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  urgentChip: {
    backgroundColor: '#FFE5E5',
  },
  urgentChipText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
  locationTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  descriptionSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  tenantSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  tenantText: {
    fontSize: 14,
    color: '#424242',
  },
  actionButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingText: {
    fontSize: 12,
    color: '#757575',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  characterCount: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});

export default JobDetailsScreen;
