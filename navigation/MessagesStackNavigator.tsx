import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesStackParamList } from '../types/navigation.types';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Import Messages Stack Screens
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

const MessagesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="MessagesList"
        component={MessagesScreen}
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide tab bar on Chat screen
        }}
      />
    </Stack.Navigator>
  );
};

export default MessagesStackNavigator;
