import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Searchbar,
} from 'react-native-paper';
import { JobsStackScreenProps } from '../types/navigation.types';

interface JobItem {
  id: string;
  title: string;
  category: string;
  location: string;
  time: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  timeAgo: string;
  icon: string;
}

type JobsListScreenProps = JobsStackScreenProps<'JobsList'>;

const JobsListScreen: React.FC<JobsListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<JobItem[]>([]);

  const sampleJobs: JobItem[] = [
    {
      id: '1',
      title: 'Toilet Flush Fix',
      category: 'Plumbing',
      location: 'Building C, Apt 504',
      time: '11:00 AM - 12:00 PM',
      priority: 'Urgent',
      timeAgo: '5m ago',
      icon: '🚽',
    },
    {
      id: '2',
      title: 'Repair power socket',
      category: 'Electrical',
      location: 'Building B, Apt 106',
      time: '3:00 PM - 4:00 PM',
      priority: 'Low',
      timeAgo: '6m ago',
      icon: '🔌',
    },
    {
      id: '3',
      title: 'AC not cooling',
      category: 'HVAC',
      location: 'Building A, Apt 708',
      time: '5:00 PM - 6:00 PM',
      priority: 'Medium',
      timeAgo: '10m ago',
      icon: '❄️',
    },
    {
      id: '4',
      title: 'Replace main door lock',
      category: 'Carpentry',
      location: 'Building A, Apt 708',
      time: '6:00 PM - 7:00 PM',
      priority: 'High',
      timeAgo: '20m ago',
      icon: '🚪',
    },
    {
      id: '5',
      title: 'Fix leaking faucet',
      category: 'Plumbing',
      location: 'Building B, Apt 205',
      time: '2:00 PM - 3:00 PM',
      priority: 'Medium',
      timeAgo: '30m ago',
      icon: '🚰',
    },
  ];

  useEffect(() => {
    setJobs(sampleJobs);
  }, []);

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

  const renderJobCard = (job: JobItem) => (
    <TouchableOpacity 
      key={job.id} 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { jobId: job.id, jobTitle: job.title })}
    >
      <View style={styles.jobCardContent}>
        <View style={styles.jobImageContainer}>
          <View style={styles.jobImagePlaceholder}>
            <Text style={styles.jobImageText}>{job.icon}</Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.timeAgo}>{job.timeAgo}</Text>
          </View>

          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(job.priority) }]}>
            <View style={styles.priorityDot} />
            <Text style={styles.priorityText}>{job.priority}</Text>
          </View>

          <View style={styles.jobInfo}>
            <Text style={styles.jobInfoText}>• Category: {job.category}</Text>
            <Text style={styles.jobInfoText}>• Location: {job.location}</Text>
            <Text style={styles.jobInfoText}>• Time: {job.time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>

      {/* Search Bar with Filter */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#9CA3AF"
          placeholderTextColor="#9CA3AF"
        />
        
        {/* Filter Button - positioned below search bar */}
        <TouchableOpacity style={styles.filtersButton}>
          <Text style={styles.filtersText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <ScrollView 
        style={styles.jobsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsListContent}
      >
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
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    elevation: 0,
    shadowOpacity: 0,
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#000000',
  },
  filtersButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  filtersText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  jobsList: {
    flex: 1,
  },
  jobsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  jobImageContainer: {
    marginRight: 16,
  },
  jobImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobImageText: {
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
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

export default JobsListScreen;