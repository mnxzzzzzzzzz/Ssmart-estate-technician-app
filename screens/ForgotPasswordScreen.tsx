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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation.types';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async (): Promise<void> => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    navigation.goBack();
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successText}>
            We've sent password reset instructions to {email}
          </Text>
          <Button
            mode="contained"
            onPress={handleBackToLogin}
            style={styles.backButton}
          >
            Back to Login
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              setError('');
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            disabled={loading}
            theme={{
              colors: {
                primary: '#6366F1',
                outline: '#E0E0E0',
              },
            }}
          />

          {error ? (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.resetButton}
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>

          <Button
            mode="text"
            onPress={handleBackToLogin}
            style={styles.backTextButton}
            disabled={loading}
          >
            Back to Login
          </Button>
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    lineHeight: 22,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  backTextButton: {
    marginTop: 16,
  },
});

export default ForgotPasswordScreen;