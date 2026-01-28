import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../types/navigation.types';
import JobsListScreen from '../screens/JobsListScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import PlaceholderScreen from '../components/PlaceholderScreen';

// Import Jobs Stack Screens
// Placeholder screens - create these as needed
// import CreateJobScreen from '../screens/CreateJobScreen';
// import JobHistoryScreen from '../screens/JobHistoryScreen';

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: '#6366F1',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="JobsList"
        component={JobsListScreen}
        options={{
          title: 'All Jobs',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{
          title: 'Job Details',
          headerBackTitle: 'Jobs',
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide tab bar on JobDetails screen
        }}
      />
      {/* Uncomment when screens are created
      <Stack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{
          title: 'Create New Job',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="JobHistory"
        component={JobHistoryScreen}
        options={{
          title: 'Job History',
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default JobsStackNavigator;
