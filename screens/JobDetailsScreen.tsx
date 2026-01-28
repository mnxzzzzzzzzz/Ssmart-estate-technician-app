import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  IconButton,
  Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { JobsStackScreenProps } from '../types/navigation.types';
import { useTabBar } from '../contexts/TabBarContext';

interface JobUpdate {
  id: string;
  title: string;
  timestamp: string;
  image?: string;
}

interface JobDetailsData {
  id: string;
  title: string;
  category: string;
  time: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  location: string;
  status: 'Assigned' | 'Accepted' | 'En Route' | 'On Site' | 'Working' | 'Completed';
  images: string[];
  updates: JobUpdate[];
}

type JobDetailsScreenProps = JobsStackScreenProps<'JobDetails'>;

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ navigation, route }) => {
  const { jobId } = route.params;
  const [jobDetails, setJobDetails] = useState<JobDetailsData | null>(null);
  const { hideTabBar, showTabBar } = useTabBar();

  // Hide tab bar when component mounts, show when unmounts
  useEffect(() => {
    console.log('JobDetailsScreen - HIDING TAB BAR');
    hideTabBar();
    return () => {
      console.log('JobDetailsScreen - SHOWING TAB BAR');
      showTabBar();
    };
  }, [hideTabBar, showTabBar]);

  // Sample job details data
  const sampleJobDetails: { [key: string]: JobDetailsData } = {
    '1': {
      id: '1',
      title: 'Toilet Flush Fix',
      category: 'Plumbing',
      time: '11:00 AM - 12:00 PM',
      description: "There's water leaking around the base of the toilet after flushing.",
      priority: 'Urgent',
      location: 'Building C, Apt 504',
      status: 'Working',
      images: [
        'https://via.placeholder.com/150x100/8B4513/FFFFFF?text=Toilet+Issue',
        'https://via.placeholder.com/150x100/696969/FFFFFF?text=Water+Leak',
      ],
      updates: [
        {
          id: '1',
          title: 'Fixed broken inlet pipe',
          timestamp: '2 hours ago',
          image: 'https://via.placeholder.com/80x60/8B7355/FFFFFF?text=Pipe',
        },
        {
          id: '2',
          title: 'Fixed worn out flush bushings',
          timestamp: '1 hour ago',
          image: 'https://via.placeholder.com/80x60/8B7355/FFFFFF?text=Flush',
        },
      ],
    },
    '2': {
      id: '2',
      title: 'Repair power socket',
      category: 'Electrical',
      time: '3:00 PM - 4:00 PM',
      description: 'Power socket in the living room is not working properly.',
      priority: 'Low',
      location: 'Building B, Apt 106',
      status: 'Accepted',
      images: [
        'https://via.placeholder.com/150x100/FFD700/000000?text=Socket+Issue',
      ],
      updates: [],
    },
    '3': {
      id: '3',
      title: 'AC not cooling',
      category: 'HVAC',
      time: '5:00 PM - 6:00 PM',
      description: 'Air conditioning unit is running but not cooling the room effectively.',
      priority: 'Medium',
      location: 'Building A, Apt 708',
      status: 'En Route',
      images: [
        'https://via.placeholder.com/150x100/87CEEB/000000?text=AC+Unit',
      ],
      updates: [],
    },
    '4': {
      id: '4',
      title: 'Replace main door lock',
      category: 'Carpentry',
      time: '6:00 PM - 7:00 PM',
      description: 'Main door lock is broken and needs replacement.',
      priority: 'High',
      location: 'Building A, Apt 708',
      status: 'Assigned',
      images: [
        'https://via.placeholder.com/150x100/8B4513/FFFFFF?text=Door+Lock',
      ],
      updates: [],
    },
    '5': {
      id: '5',
      title: 'Fix leaking faucet',
      category: 'Plumbing',
      time: '2:00 PM - 3:00 PM',
      description: 'Kitchen faucet is leaking and needs immediate attention.',
      priority: 'Medium',
      location: 'Building B, Apt 205',
      status: 'Assigned',
      images: [
        'https://via.placeholder.com/150x100/4682B4/FFFFFF?text=Faucet',
      ],
      updates: [],
    },
  };

  useEffect(() => {
    // Load job details based on jobId
    const details = sampleJobDetails[jobId];
    if (details) {
      setJobDetails(details);
    }
  }, [jobId]);

  const getStatusSteps = () => {
    const steps = ['Assigned', 'Accepted', 'En Route', 'On Site', 'Working', 'Completed'];
    return steps;
  };

  const getStepStatus = (step: string, currentStatus: string) => {
    const steps = getStatusSteps();
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'current';
    }
    return 'pending';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '#FF3B30';
      case 'High':
        return '#FF3B30';
      case 'Medium':
        return '#FF9500';
      case 'Low':
        return '#34C759';
      default:
        return '#34C759';
    }
  };

  const renderStatusTimeline = () => {
    const steps = getStatusSteps();
    const currentIndex = steps.indexOf(jobDetails?.status || 'Assigned');
    
    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.jobTitle}>{jobDetails?.title}</Text>
        
        <View style={styles.timelineWrapper}>
          {/* Timeline steps */}
          <View style={styles.timeline}>
            {steps.map((step, index) => {
              const status = getStepStatus(step, jobDetails?.status || 'Assigned');
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';
              const isPending = status === 'pending';
              
              return (
                <View key={step} style={styles.timelineStep}>
                  {/* Connecting line - only between steps, not before first or after last */}
                  {index > 0 && index < steps.length && (
                    <View style={[
                      styles.connectingLine,
                      index <= currentIndex ? styles.completedLine : styles.pendingLine,
                    ]} />
                  )}
                  
                  {/* Step Circle */}
                  <View style={[
                    styles.stepCircle,
                    isCompleted && styles.completedCircle,
                    isCurrent && styles.currentCircle,
                    isPending && styles.pendingCircle,
                  ]}>
                    {isCompleted && (
                      <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
                    )}
                    {isCurrent && <View style={styles.currentDot} />}
                  </View>
                  
                  {/* Step Label */}
                  <Text style={[
                    styles.stepLabel,
                    isCompleted && styles.completedLabel,
                    isCurrent && styles.currentLabel,
                    isPending && styles.pendingLabel,
                  ]}>
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderJobImages = () => {
    if (!jobDetails?.images || jobDetails.images.length === 0) return null;

    return (
      <View style={styles.imagesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {jobDetails.images.map((_, index) => (
            <View key={index} style={styles.imageWrapper}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📷</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderJobInfo = () => {
    if (!jobDetails) return null;

    return (
      <View style={styles.jobInfoContainer}>
        <Text style={styles.categoryText}>{jobDetails.category}</Text>
        <Text style={styles.timeText}>{jobDetails.time}</Text>
        
        <Text style={styles.descriptionLabel}>Tenant Description:</Text>
        <Text style={styles.descriptionText}>{jobDetails.description}</Text>
        
        <View style={styles.jobMetaContainer}>
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(jobDetails.priority) }]} />
            <Text style={styles.priorityText}>{jobDetails.priority}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
            <Text style={styles.locationText}>{jobDetails.location}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderUpdates = () => {
    if (!jobDetails?.updates || jobDetails.updates.length === 0) return null;

    return (
      <View style={styles.updatesContainer}>
        <Text style={styles.updatesTitle}>Updates</Text>
        
        {jobDetails.updates.map((update) => (
          <View key={update.id} style={styles.updateItem}>
            <View style={styles.updateImageContainer}>
              <View style={styles.updateImagePlaceholder}>
                <Text style={styles.updateImageText}>🔧</Text>
              </View>
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>{update.title}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (!jobDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Job Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Timeline */}
        {renderStatusTimeline()}
        
        {/* Job Images */}
        {renderJobImages()}
        
        {/* Job Information */}
        {renderJobInfo()}
        
        {/* Updates Section */}
        {renderUpdates()}
        
        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Container with Accept/Decline or Message Input and Finish Button */}
      <View style={styles.bottomContainer}>
        {jobDetails?.status === 'Assigned' ? (
          // Show Accept/Decline buttons for newly assigned jobs
          <>
            <Button
              mode="outlined"
              onPress={() => {
                // Handle decline job
                console.log('Decline job pressed');
              }}
              style={styles.declineButton}
              labelStyle={styles.declineButtonText}
            >
              Decline Job
            </Button>
            
            <Button
              mode="contained"
              onPress={() => {
                // Handle accept job - this should update the job status to 'Accepted'
                // and move it to the Pending filter in dashboard
                console.log('Accept job pressed');
                // TODO: Update job status and navigate back
              }}
              style={styles.acceptButton}
              labelStyle={styles.acceptButtonText}
            >
              Accept Job
            </Button>
          </>
        ) : (
          // Show message input and finish button for accepted/in-progress jobs
          <>
            {/* Message Input */}
            <View style={styles.messageInputContainer}>
              <MaterialCommunityIcons name="attachment" size={20} color="#9CA3AF" />
              <Text style={styles.messageInputPlaceholder}>Message here...</Text>
              <TouchableOpacity style={styles.sendButton}>
                <MaterialCommunityIcons name="arrow-up" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Finish Job Button */}
            <Button
              mode="contained"
              onPress={() => {
                // Handle finish job
                console.log('Finish job pressed');
              }}
              style={styles.finishButton}
              labelStyle={styles.finishButtonText}
            >
              Finish Job
            </Button>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  timelineWrapper: {
    position: 'relative',
    paddingHorizontal: 30,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 2,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    top: 15,
    left: -50,
    width: 100,
    height: 2,
    zIndex: 1,
  },
  completedLine: {
    backgroundColor: '#6366F1',
  },
  pendingLine: {
    backgroundColor: '#E5E7EB',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    marginBottom: 8,
  },
  completedCircle: {
    backgroundColor: '#6366F1',
  },
  currentCircle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  pendingCircle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 65,
    lineHeight: 13,
  },
  completedLabel: {
    color: '#374151',
    fontWeight: '600',
  },
  currentLabel: {
    color: '#374151',
    fontWeight: '600',
  },
  pendingLabel: {
    color: '#9CA3AF',
  },
  imagesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  imageWrapper: {
    marginLeft: 20,
    marginRight: 8,
  },
  imagePlaceholder: {
    width: 120,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 24,
  },
  jobInfoContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  jobMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  updatesContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 8,
  },
  updatesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  updateImageContainer: {
    marginRight: 16,
  },
  updateImagePlaceholder: {
    width: 80,
    height: 60,
    backgroundColor: '#8B7355',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateImageText: {
    fontSize: 24,
  },
  updateContent: {
    flex: 1,
    justifyContent: 'center',
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 22,
  },
  updateTimestamp: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  declineButton: {
    borderColor: '#6366F1',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 4,
    marginBottom: 12,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  acceptButton: {
    backgroundColor: '#6366F1',
    borderRadius: 25,
    paddingVertical: 4,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  messageInputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 12,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#6366F1',
    borderRadius: 25,
    paddingVertical: 4,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default JobDetailsScreen;