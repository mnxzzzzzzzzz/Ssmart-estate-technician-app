import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import CustomTabBar from '../components/CustomTabBar';

// Import Stack Navigators
import HomeStackNavigator from './HomeStackNavigator';
import JobsStackNavigator from './JobsStackNavigator';
import MessagesStackNavigator from './MessagesStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="JobsTab"
        component={JobsStackNavigator}
        options={{
          title: 'Jobs',
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStackNavigator}
        options={{
          title: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
