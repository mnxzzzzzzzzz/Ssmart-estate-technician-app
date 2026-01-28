// Custom typed navigation hooks for the Technician App

import { useNavigation as useRNNavigation, useRoute } from '@react-navigation/native';
import {
  RootNavigationProp,
  AuthNavigationProp,
  MainTabNavigationProp,
  HomeNavigationProp,
  JobsNavigationProp,
  MessagesNavigationProp,
  ProfileNavigationProp,
  RootRouteProp,
  AuthRouteProp,
  HomeRouteProp,
  JobsRouteProp,
  MessagesRouteProp,
  ProfileRouteProp,
  RootStackParamList,
  AuthStackParamList,
  HomeStackParamList,
  JobsStackParamList,
  MessagesStackParamList,
  ProfileStackParamList,
} from '../types/navigation.types';

// Root Navigation Hook
export const useRootNavigation = (): RootNavigationProp => {
  return useRNNavigation<RootNavigationProp>();
};

// Auth Navigation Hook
export const useAuthNavigation = (): AuthNavigationProp => {
  return useRNNavigation<AuthNavigationProp>();
};

// Main Tab Navigation Hook
export const useMainTabNavigation = (): MainTabNavigationProp => {
  return useRNNavigation<MainTabNavigationProp>();
};

// Home Navigation Hook
export const useHomeNavigation = (): HomeNavigationProp => {
  return useRNNavigation<HomeNavigationProp>();
};

// Jobs Navigation Hook
export const useJobsNavigation = (): JobsNavigationProp => {
  return useRNNavigation<JobsNavigationProp>();
};

// Messages Navigation Hook
export const useMessagesNavigation = (): MessagesNavigationProp => {
  return useRNNavigation<MessagesNavigationProp>();
};

// Profile Navigation Hook
export const useProfileNavigation = (): ProfileNavigationProp => {
  return useRNNavigation<ProfileNavigationProp>();
};

// Route Hooks
export const useRootRoute = <T extends keyof RootStackParamList>(
  screen: T
): RootRouteProp<T> => {
  return useRoute<RootRouteProp<T>>();
};

export const useAuthRoute = <T extends keyof AuthStackParamList>(
  screen: T
): AuthRouteProp<T> => {
  return useRoute<AuthRouteProp<T>>();
};

export const useHomeRoute = <T extends keyof HomeStackParamList>(
  screen: T
): HomeRouteProp<T> => {
  return useRoute<HomeRouteProp<T>>();
};

export const useJobsRoute = <T extends keyof JobsStackParamList>(
  screen: T
): JobsRouteProp<T> => {
  return useRoute<JobsRouteProp<T>>();
};

export const useMessagesRoute = <T extends keyof MessagesStackParamList>(
  screen: T
): MessagesRouteProp<T> => {
  return useRoute<MessagesRouteProp<T>>();
};

export const useProfileRoute = <T extends keyof ProfileStackParamList>(
  screen: T
): ProfileRouteProp<T> => {
  return useRoute<ProfileRouteProp<T>>();
};
