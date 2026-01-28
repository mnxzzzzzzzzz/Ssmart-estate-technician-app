import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation.types';

// Import Home Stack Screens
import TechnicianDashboard from '../TechnicianDashboard.js';
import PlaceholderScreen from '../components/PlaceholderScreen';
// import JobDetailsScreen from '../JobDetailsScreen';
// Placeholder screens - create these as needed
// import NotificationsScreen from '../screens/NotificationsScreen';
// import QuickStatsScreen from '../screens/QuickStatsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={TechnicianDashboard}
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="JobDetails"
        options={{
          title: 'Job Details',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      >
        {() => <PlaceholderScreen title="Job Details" />}
      </Stack.Screen>
      {/* Uncomment when screens are created
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="QuickStats"
        component={QuickStatsScreen}
        options={{
          title: 'Quick Stats',
          headerShown: true,
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
