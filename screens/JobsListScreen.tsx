import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { JobsStackScreenProps } from '../types/navigation.types';
import { getJobs, Job } from '../services/api';

type JobsListScreenProps = JobsStackScreenProps<'JobsList'>;

const CATEGORY_ICONS: Record<string, string> = {
  Plumbing: '🚽',
  Electrical: '🔌',
  HVAC: '❄️',
  Carpentry: '🚪',
  General: '🔧',
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'urgent': return '#FF3B30';
    case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'low': return '#34C759';
    default: return '#34C759';
  }
};

const JobsListScreen: React.FC<JobsListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setError(null);
      const response = await getJobs({ limit: 50 });
      setJobs(response.data);
    } catch (err: any) {
      console.error('Failed to fetch jobs:', err);
      setError(err?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job =>
    job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.issueCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.ticketId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderJobCard = (job: Job) => (
    <TouchableOpacity
      key={job.id}
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { jobId: job.id, jobTitle: job.issueCategory })}
    >
      <View style={styles.jobCardContent}>
        <View style={styles.jobImageContainer}>
          <View style={styles.jobImagePlaceholder}>
            <Text style={styles.jobImageText}>
              {CATEGORY_ICONS[job.issueCategory] || '🔧'}
            </Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.issueCategory}</Text>
            <Text style={styles.timeAgo}>{job.ticketId}</Text>
          </View>

          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(job.priority) }]}>
            <View style={styles.priorityDot} />
            <Text style={styles.priorityText}>{job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}</Text>
          </View>

          <View style={styles.jobInfo}>
            <Text style={styles.jobInfoText} numberOfLines={2}>• {job.description}</Text>
            <Text style={styles.jobInfoText}>• Location: {job.building}, {job.unit}</Text>
            <Text style={styles.jobInfoText}>• Status: {job.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>

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
        <TouchableOpacity style={styles.filtersButton}>
          <Text style={styles.filtersText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchJobs} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.jobsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsListContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366F1']} />}
        >
          {filteredJobs.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No jobs found</Text>
            </View>
          ) : (
            filteredJobs.map(renderJobCard)
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 16 },
  errorText: { color: '#FF3B30', fontSize: 16, textAlign: 'center', marginBottom: 12 },
  emptyText: { color: '#9CA3AF', fontSize: 16 },
  retryButton: { backgroundColor: '#6366F1', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: '600' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#6366F1', textAlign: 'center' },
  searchContainer: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  searchBar: { backgroundColor: '#F8F9FA', borderRadius: 12, elevation: 0, shadowOpacity: 0, marginBottom: 12 },
  searchInput: { fontSize: 16, color: '#000000' },
  filtersButton: { alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 8 },
  filtersText: { fontSize: 14, color: '#6366F1', fontWeight: '500' },
  jobsList: { flex: 1 },
  jobsListContent: { paddingHorizontal: 20, paddingBottom: 100 },
  jobCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  jobCardContent: { flexDirection: 'row', padding: 16 },
  jobImageContainer: { marginRight: 16 },
  jobImagePlaceholder: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  jobImageText: { fontSize: 24 },
  jobDetails: { flex: 1 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  jobTitle: { fontSize: 18, fontWeight: '600', color: '#000000', flex: 1 },
  timeAgo: { fontSize: 12, color: '#9CA3AF' },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  priorityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF', marginRight: 6 },
  priorityText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  jobInfo: { gap: 4 },
  jobInfoText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
});

export default JobsListScreen;
