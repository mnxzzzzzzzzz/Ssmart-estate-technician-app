import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Switch,
  Avatar,
  Card,
  TextInput,
  IconButton,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import {
  TechnicianProfile,
  AccountSettings,
  AvailabilityStatus,
  TechnicianSkill,
} from '../types/technician.types';
import { ProfileStackParamList } from '../types/navigation.types';
import AssignedBuildingItem from '../components/AssignedBuildingItem';
import AvailabilityToggle from '../components/AvailabilityToggle';
import SkillTag from '../components/SkillTag';
import { sampleTechnicianProfile, sampleAccountSettings } from '../data/sampleProfile';
import { getMyProfile, updateAvailability } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileMain'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [settings, setSettings] = useState<AccountSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);

  // Editable fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<TechnicianSkill[]>([]);
  const [availability, setAvailability] = useState<AvailabilityStatus>(AvailabilityStatus.AVAILABLE);

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  const fetchProfile = async (): Promise<void> => {
    try {
      const response = await getMyProfile();
      const apiProfile = response.data;
      // Map API technician to local TechnicianProfile shape
      const mapped: TechnicianProfile = {
        ...sampleTechnicianProfile,
        fullName: apiProfile.name || sampleTechnicianProfile.fullName,
        email: apiProfile.email || sampleTechnicianProfile.email,
        phoneNumber: apiProfile.phone || sampleTechnicianProfile.phoneNumber,
        availability: (apiProfile.availability as AvailabilityStatus) || AvailabilityStatus.AVAILABLE,
        skills: (apiProfile.skills as TechnicianSkill[]) || sampleTechnicianProfile.skills,
        rating: apiProfile.rating ?? sampleTechnicianProfile.rating,
        totalJobsCompleted: apiProfile.totalJobsCompleted ?? sampleTechnicianProfile.totalJobsCompleted,
        avatarUrl: apiProfile.avatarUrl,
        technicianId: apiProfile.technicianId || apiProfile.id,
        isVerified: apiProfile.isVerified ?? true,
        assignedBuildings: (apiProfile.assignedBuildings as any[]) || sampleTechnicianProfile.assignedBuildings,
      };
      setProfile(mapped);
      setFullName(mapped.fullName);
      setEmail(mapped.email);
      setPhoneNumber(mapped.phoneNumber);
      setSelectedSkills(mapped.skills);
      setAvailability(mapped.availability);
      setAvatarUri(mapped.avatarUrl);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to sample data
      setProfile(sampleTechnicianProfile);
      setFullName(sampleTechnicianProfile.fullName);
      setEmail(sampleTechnicianProfile.email);
      setPhoneNumber(sampleTechnicianProfile.phoneNumber);
      setSelectedSkills(sampleTechnicianProfile.skills);
      setAvailability(sampleTechnicianProfile.availability);
      setAvatarUri(sampleTechnicianProfile.avatarUrl);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSettings = async (): Promise<void> => {
    // Settings are local for now; use sample data
    setSettings(sampleAccountSettings);
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    fetchProfile();
    fetchSettings();
  };

  const handleSaveProfile = async (): Promise<void> => {
    if (!fullName.trim()) { Alert.alert('Validation Error', 'Full name is required'); return; }
    if (!email.trim()) { Alert.alert('Validation Error', 'Email is required'); return; }
    if (!phoneNumber.trim()) { Alert.alert('Validation Error', 'Phone number is required'); return; }

    setSaving(true);
    try {
      // Profile update endpoint not in current API spec; update locally
      if (profile) {
        setProfile({ ...profile, fullName, email, phoneNumber, skills: selectedSkills, availability, avatarUrl: avatarUri });
      }
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = (): void => {
    if (profile) {
      setFullName(profile.fullName);
      setEmail(profile.email);
      setPhoneNumber(profile.phoneNumber);
      setSelectedSkills(profile.skills);
      setAssignedBuildings(profile.assignedBuildings);
      setAvailability(profile.availability);
      setAvatarUri(profile.avatarUrl);
    }
    setEditMode(false);
  };

  const handleSkillToggle = (skill: TechnicianSkill): void => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleAvailabilityChange = async (newStatus: AvailabilityStatus): Promise<void> => {
    const previous = availability;
    setAvailability(newStatus);
    try {
      const technicianId = await AsyncStorage.getItem('technicianId');
      if (technicianId) {
        await updateAvailability(technicianId, newStatus);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setAvailability(previous);
      Alert.alert('Error', 'Failed to update availability status. Please try again.');
    }
  };

  const handleSettingToggle = async (setting: keyof AccountSettings, value: boolean): Promise<void> => {
    if (!settings) return;
    setSettings({ ...settings, [setting]: value });
  };

  const handleNotificationToggle = async (
    preference: keyof AccountSettings['notificationPreferences'],
    value: boolean
  ): Promise<void> => {
    if (!settings) return;
    setSettings({ ...settings, notificationPreferences: { ...settings.notificationPreferences, [preference]: value } });
  };

  const handleLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const handleChangeAvatar = (): void => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => pickImageFromCamera(),
        },
        {
          text: 'Photo Library',
          onPress: () => pickImageFromLibrary(),
        },
        {
          text: 'Remove Photo',
          onPress: () => removeAvatar(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImageFromCamera = async (): Promise<void> => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
        if (profile) {
          setProfile({ ...profile, avatarUrl: result.assets[0].uri });
        }
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImageFromLibrary = async (): Promise<void> => {
    try {
      // Request media library permissions
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (libraryPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
        if (profile) {
          setProfile({ ...profile, avatarUrl: result.assets[0].uri });
        }
      }
    } catch (error) {
      console.error('Error picking image from library:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const removeAvatar = (): void => {
    setAvatarUri(undefined);
    if (profile) {
      setProfile({ ...profile, avatarUrl: undefined });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#FF3B30" />
        <Text style={styles.errorTitle}>Profile Not Found</Text>
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
        <Text style={styles.profileTitle}>Profile</Text>
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
        {/* Profile Header Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.profileHeader}>
            <View style={styles.profileHeaderTop}>
              <TouchableOpacity
                onPress={handleChangeAvatar}
                activeOpacity={0.7}
              >
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text
                    size={100}
                    label={profile.fullName.charAt(0).toUpperCase()}
                    style={styles.avatar}
                  />
                )}
                {editMode && (
                  <View style={styles.avatarBadge}>
                    <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              <IconButton
                icon={editMode ? 'close' : 'pencil'}
                size={24}
                onPress={() => (editMode ? handleCancelEdit() : setEditMode(true))}
                style={styles.editButton}
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <Text style={styles.profileId}>{profile.technicianId}</Text>
              {profile.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#34C759" />
                  <Text style={styles.verifiedText}>Verified Technician</Text>
                </View>
              )}
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={24} color="#FFC107" />
                <Text style={styles.statValue}>{profile.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="briefcase-check" size={24} color="#6366F1" />
                <Text style={styles.statValue}>{profile.totalJobsCompleted}</Text>
                <Text style={styles.statLabel}>Jobs Done</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="clock-fast" size={24} color="#34C759" />
                <Text style={styles.statValue}>
                  {profile.averageResponseTime}m
                </Text>
                <Text style={styles.statLabel}>Avg Response</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Contact Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              disabled={!editMode}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              disabled={!editMode}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              style={styles.input}
              disabled={!editMode}
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" />}
            />
          </Card.Content>
        </Card>

        {/* Availability Status */}
        <Card style={styles.card}>
          <Card.Content>
            <AvailabilityToggle
              status={availability}
              onChange={handleAvailabilityChange}
              disabled={false}
            />
          </Card.Content>
        </Card>

        {/* Skills */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <Text style={styles.sectionSubtitle}>
              {editMode
                ? 'Tap to add or remove skills'
                : 'Your certified skills'}
            </Text>
            <View style={styles.skillsContainer}>
              {Object.values(TechnicianSkill).map((skill) => (
                <SkillTag
                  key={skill}
                  skill={skill}
                  isSelected={selectedSkills.includes(skill)}
                  onPress={editMode ? handleSkillToggle : undefined}
                  removable={editMode}
                  showIcon={true}
                />
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Assigned Buildings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Assigned Buildings</Text>
            <Text style={styles.sectionSubtitle}>
              Buildings you are responsible for (read-only)
            </Text>
            {profile?.assignedBuildings.map((building) => (
              <AssignedBuildingItem
                key={building}
                building={building}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Account Settings */}
        {settings && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Account Settings</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="face-recognition" size={24} color="#6366F1" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Face ID</Text>
                    <Text style={styles.settingDescription}>
                      Use Face ID to login
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.enableFaceId}
                  onValueChange={(value) =>
                    handleSettingToggle('enableFaceId', value)
                  }
                  color="#6366F1"
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="shield-lock" size={24} color="#6366F1" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Two-Factor Auth</Text>
                    <Text style={styles.settingDescription}>
                      Extra security for your account
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.enableTwoFactorAuth}
                  onValueChange={(value) =>
                    handleSettingToggle('enableTwoFactorAuth', value)
                  }
                  color="#6366F1"
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="briefcase-check" size={24} color="#6366F1" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Auto Accept Jobs</Text>
                    <Text style={styles.settingDescription}>
                      Automatically accept assigned jobs
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.autoAcceptJobs}
                  onValueChange={(value) =>
                    handleSettingToggle('autoAcceptJobs', value)
                  }
                  color="#6366F1"
                />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Notification Settings */}
        {settings && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Notifications</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="bell" size={24} color="#6366F1" />
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={settings.notificationPreferences.pushNotifications}
                  onValueChange={(value) =>
                    handleNotificationToggle('pushNotifications', value)
                  }
                  color="#6366F1"
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="email" size={24} color="#6366F1" />
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                </View>
                <Switch
                  value={settings.notificationPreferences.emailNotifications}
                  onValueChange={(value) =>
                    handleNotificationToggle('emailNotifications', value)
                  }
                  color="#6366F1"
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="message" size={24} color="#6366F1" />
                  <Text style={styles.settingLabel}>SMS Notifications</Text>
                </View>
                <Switch
                  value={settings.notificationPreferences.smsNotifications}
                  onValueChange={(value) =>
                    handleNotificationToggle('smsNotifications', value)
                  }
                  color="#6366F1"
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="volume-high" size={24} color="#6366F1" />
                  <Text style={styles.settingLabel}>Sound</Text>
                </View>
                <Switch
                  value={settings.notificationPreferences.soundEnabled}
                  onValueChange={(value) =>
                    handleNotificationToggle('soundEnabled', value)
                  }
                  color="#6366F1"
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="vibrate" size={24} color="#6366F1" />
                  <Text style={styles.settingLabel}>Vibration</Text>
                </View>
                <Switch
                  value={settings.notificationPreferences.vibrationEnabled}
                  onValueChange={(value) =>
                    handleNotificationToggle('vibrationEnabled', value)
                  }
                  color="#6366F1"
                />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Save/Cancel Buttons */}
        {editMode && (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={handleCancelEdit}
              style={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.saveButton}
              loading={saving}
              disabled={saving}
            >
              Save Changes
            </Button>
          </View>
        )}

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#FF3B30"
          icon="logout"
        >
          Logout
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Member since {profile.joinDate.toLocaleDateString()}
          </Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileHeaderTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  editButton: {
    margin: 0,
  },
  avatar: {
    backgroundColor: '#6366F1',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366F1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  profileId: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  settingDescription: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  divider: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6366F1',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    borderColor: '#FF3B30',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
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
    marginBottom: 24,
  },
});

export default ProfileScreen;
