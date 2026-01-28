import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types/navigation.types';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (): Promise<void> => {
    // Reset errors
    setError('');
    setEmailError('');

    // Validation
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Mock authentication - simulate API delay
      console.log('Starting login process for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock credentials validation
      const validCredentials = [
        { email: 'mike.johnson@smartestate.com', password: 'password123', name: 'Mike Johnson', id: 'tech-1' },
        { email: 'sarah.williams@smartestate.com', password: 'password123', name: 'Sarah Williams', id: 'tech-2' },
        { email: 'david.chen@smartestate.com', password: 'password123', name: 'David Chen', id: 'tech-3' },
      ];

      const user = validCredentials.find(
        cred => cred.email.toLowerCase() === email.trim().toLowerCase() && cred.password === password
      );

      if (user) {
        console.log('Login successful for user:', user.name);
        
        // Store mock JWT token and user data
        const authToken = 'mock-jwt-token-' + Date.now();
        await AsyncStorage.multiSet([
          ['authToken', authToken],
          ['userRole', 'technician'],
          ['technicianId', user.id],
          ['technicianName', user.name]
        ]);
        
        console.log('Auth token stored:', authToken);
        console.log('Login completed - AppNavigator should detect change');
        
      } else {
        console.log('Login failed - invalid credentials for email:', email);
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (): void => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo/Brand Header */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SmartEstate</Text>
          <Text style={styles.brandText}>Maintenance Pro</Text>
          <Text style={styles.brandSubtext}>Technician Portal</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              setEmailError('');
              setError('');
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!emailError}
            disabled={loading}
            theme={{
              colors: {
                primary: '#6366F1',
                outline: '#E0E0E0',
              },
            }}
          />
          {emailError ? (
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>
          ) : null}

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setError('');
            }}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            autoComplete="password"
            disabled={loading}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            theme={{
              colors: {
                primary: '#6366F1',
                outline: '#E0E0E0',
              },
            }}
          />

          {/* Forgot Password Link */}
          <Button
            mode="text"
            onPress={handleForgotPassword}
            style={styles.forgotButton}
            labelStyle={styles.forgotButtonText}
            disabled={loading}
          >
            Forgot your password?
          </Button>

          {/* Error Message */}
          {error ? (
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginButtonText}
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </Button>

          {/* Loading Indicator */}
          {loading && (
            <ActivityIndicator
              animating={true}
              color="#6366F1"
              size="large"
              style={styles.loader}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  brandSubtext: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  forgotButtonText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 16,
  },
});

export default LoginScreen;
