import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TechnicianDashboard = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('Active');

  // Sample jobs data matching the reference design
  const sampleJobs = [
    {
      id: '1',
      title: 'Repair power socket',
      category: 'Electrical',
      location: 'Building B, Apt 106',
      time: '3:00 PM - 4:00 PM',
      priority: 'Low',
      timeAgo: '6m ago',
      icon: '🔌',
      priorityColor: '#4CAF50',
    },
    {
      id: '2',
      title: 'AC not cooling',
      category: 'HVAC',
      location: 'Building A, Apt 708',
      time: '5:00 PM - 6:00 PM',
      priority: 'Medium',
      timeAgo: '10m ago',
      icon: '❄️',
      priorityColor: '#FF9800',
    },
    {
      id: '3',
      title: 'Replace main door lock',
      category: 'Carpentry',
      location: 'Building A, Apt 708',
      time: '6:00 PM - 7:00 PM',
      priority: 'High',
      timeAgo: '20m ago',
      icon: '🚪',
      priorityColor: '#F44336',
    },
  ];

  const [jobs, setJobs] = useState(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);

  useEffect(() => {
    // Filter jobs based on selected filter
    if (selectedFilter === 'Active') {
      setFilteredJobs(jobs);
    } else if (selectedFilter === 'Pending') {
      // Show jobs that have been accepted but not yet started
      const pendingJobs = [
        {
          id: 'pending-1',
          title: 'Fix leaking faucet',
          category: 'Plumbing',
          location: 'Building B, Apt 205',
          time: '2:00 PM - 3:00 PM',
          priority: 'Medium',
          timeAgo: '30m ago',
          icon: '🚰',
          priorityColor: '#FF9800',
        },
      ];
      setFilteredJobs(pendingJobs);
    } else {
      setFilteredJobs([]);
    }
  }, [selectedFilter, jobs]);

  const renderJobCard = (job) => (
    <TouchableOpacity key={job.id} style={styles.jobCard}>
      <View style={styles.jobCardContent}>
        {/* Job Icon */}
        <View style={styles.jobIconContainer}>
          <Text style={styles.jobIcon}>{job.icon}</Text>
        </View>

        {/* Job Details */}
        <View style={styles.jobDetails}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.timeAgo}>{job.timeAgo}</Text>
          </View>

          {/* Priority Badge */}
          <View style={[styles.priorityBadge, { backgroundColor: job.priorityColor }]}>
            <Text style={styles.priorityText}>{job.priority}</Text>
          </View>

          {/* Job Info */}
          <View style={styles.jobInfo}>
            <Text style={styles.jobInfoText}>• Category: {job.category}</Text>
            <Text style={styles.jobInfoText}>• Location: {job.location}</Text>
            <Text style={styles.jobInfoText}>• Time: {job.time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
      </View>

      {/* Today's Jobs Section */}
      <View style={styles.todaysJobsSection}>
        <Text style={styles.todaysJobsTitle}>Today's Jobs</Text>
        
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'Active' && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter('Active')}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === 'Active' && styles.activeFilterTabText
            ]}>
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'Pending' && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter('Pending')}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === 'Pending' && styles.activeFilterTabText
            ]}>
              Pending
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Jobs List */}
      <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
        {filteredJobs.map(renderJobCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    textAlign: 'center',
  },
  todaysJobsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  todaysJobsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 20,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  filterTabText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  jobsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  jobIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  jobIcon: {
    fontSize: 24,
  },
  jobDetails: {
    flex: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  timeAgo: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  priorityText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  jobInfo: {
    gap: 4,
  },
  jobInfoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default TechnicianDashboard;