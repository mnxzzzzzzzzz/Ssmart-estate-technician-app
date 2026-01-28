import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation.types';

// Import Auth Screens
import LoginScreen from '../LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// Placeholder screens - create these as needed
// import ResetPasswordScreen from '../screens/ResetPasswordScreen';
// import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Forgot Password',
          headerShown: true,
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
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'Reset Password',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Register',
          headerShown: true,
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
