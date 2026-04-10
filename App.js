import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import { TabBarProvider } from './contexts/TabBarContext';
import { AuthProvider } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366F1',
    primaryContainer: '#E0E7FF',
    secondary: '#8B5CF6',
    secondaryContainer: '#EDE9FE',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#F5F5F5',
    error: '#FF3B30',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
  },
};

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <TabBarProvider>
          <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
          <AppNavigator />
          {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
        </TabBarProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
