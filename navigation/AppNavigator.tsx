import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../types/navigation.types';
import { useAuth } from '../contexts/AuthContext';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import JobDetailsScreen from '../screens/JobDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ animationTypeForReplace: 'pop' }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ animationTypeForReplace: 'push' }} />
            <Stack.Screen
              name="JobDetails"
              component={JobDetailsScreen}
              options={{
                title: 'Job Details',
                headerShown: true,
                presentation: 'card',
                headerStyle: { backgroundColor: '#6366F1' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default AppNavigator;
