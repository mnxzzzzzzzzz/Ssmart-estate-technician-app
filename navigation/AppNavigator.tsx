import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet, AppState } from 'react-native';
import { RootStackParamList } from '../types/navigation.types';

// Import Navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Import Screens
import JobDetailsScreen from '../screens/JobDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const newAuthState = !!token;
      
      // Only log when auth state actually changes
      if (newAuthState !== isAuthenticated) {
        console.log('🔐 Auth state changed:', newAuthState ? 'LOGGED IN' : 'LOGGED OUT');
        setIsAuthenticated(newAuthState);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Listen for app state changes and auth changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkAuthStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Also check periodically but less frequently
    const interval = setInterval(checkAuthStatus, 3000); // Every 3 seconds
    
    return () => {
      subscription?.remove();
      clearInterval(interval);
    };
  }, [checkAuthStatus]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{
                animationTypeForReplace: 'push',
              }}
            />
            {/* Global Screens (accessible from anywhere) */}
            <Stack.Screen
              name="JobDetails"
              component={JobDetailsScreen}
              options={{
                title: 'Job Details',
                headerShown: true,
                presentation: 'card',
                headerStyle: {
                  backgroundColor: '#6366F1',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            {/* Uncomment when screens are created
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{
                title: 'Not Found',
                headerShown: true,
              }}
            />
            */}
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
