import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation.types';

// Import Profile Stack Screens
import ProfileScreen from '../screens/ProfileScreen';
// Placeholder screens - create these as needed
// import EditProfileScreen from '../screens/EditProfileScreen';
// import AccountSettingsScreen from '../screens/AccountSettingsScreen';
// import ChangePasswordScreen from '../screens/ChangePasswordScreen';
// import StatisticsDetailsScreen from '../screens/StatisticsDetailsScreen';
// import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';
// import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      {/* Uncomment when screens are created
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: 'Account Settings',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: 'Change Password',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="StatisticsDetails"
        component={StatisticsDetailsScreen}
        options={{
          title: 'Statistics',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
        options={{
          title: 'Security',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
