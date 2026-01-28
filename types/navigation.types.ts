// Complete Navigation Types for Technician App with strict TypeScript

import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TechnicianProfile, AccountSettings } from './technician.types';

// Root Stack Param List
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  JobDetails: {
    jobId: string;
    jobTitle?: string;
    fromNotification?: boolean;
  };
  NotFound: undefined;
};

// Auth Stack Param List
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
    email: string;
  };
  Register: undefined;
};

// Main Tab Param List
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  JobsTab: NavigatorScreenParams<JobsStackParamList>;
  MessagesTab: NavigatorScreenParams<MessagesStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack Param List
export type HomeStackParamList = {
  Dashboard: undefined;
  JobDetails: {
    jobId: string;
    jobTitle?: string;
  };
  Notifications: undefined;
  QuickStats: undefined;
};

// Jobs Stack Param List
export type JobsStackParamList = {
  JobsList: {
    filter?: 'active' | 'pending' | 'completed' | 'urgent';
    category?: string;
    building?: string;
  };
  JobDetails: {
    jobId: string;
    jobTitle?: string;
  };
  CreateJob: undefined;
  JobHistory: undefined;
};

// Messages Stack Param List
export type MessagesStackParamList = {
  MessagesList: undefined;
  Chat: {
    conversationId: string;
    jobId?: string;
    participantName?: string;
  };
  NewMessage: {
    jobId?: string;
    recipientId?: string;
  };
  ArchivedMessages: undefined;
};

// Profile Stack Param List
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: {
    profile: TechnicianProfile;
  };
  AccountSettings: {
    settings: AccountSettings;
  };
  ChangePassword: undefined;
  StatisticsDetails: {
    period: 'weekly' | 'monthly' | 'yearly';
    metric?: 'jobs' | 'time' | 'rating';
  };
  SecuritySettings: undefined;
  NotificationSettings: undefined;
};

// Screen Props Types for Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Screen Props Types for Auth Stack
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Screen Props Types for Main Tabs
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Screen Props Types for Home Stack
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'HomeTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Screen Props Types for Jobs Stack
export type JobsStackScreenProps<T extends keyof JobsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<JobsStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'JobsTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Screen Props Types for Messages Stack
export type MessagesStackScreenProps<T extends keyof MessagesStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MessagesStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'MessagesTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Screen Props Types for Profile Stack
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    CompositeScreenProps<
      MainTabScreenProps<'ProfileTab'>,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

// Navigation Prop Types (for useNavigation hook)
export type RootNavigationProp = NativeStackScreenProps<
  RootStackParamList
>['navigation'];

export type AuthNavigationProp = NativeStackScreenProps<
  AuthStackParamList
>['navigation'];

export type MainTabNavigationProp = BottomTabScreenProps<
  MainTabParamList
>['navigation'];

export type HomeNavigationProp = NativeStackScreenProps<
  HomeStackParamList
>['navigation'];

export type JobsNavigationProp = NativeStackScreenProps<
  JobsStackParamList
>['navigation'];

export type MessagesNavigationProp = NativeStackScreenProps<
  MessagesStackParamList
>['navigation'];

export type ProfileNavigationProp = NativeStackScreenProps<
  ProfileStackParamList
>['navigation'];

// Route Prop Types
export type RootRouteProp<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>['route'];

export type AuthRouteProp<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>['route'];

export type HomeRouteProp<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>['route'];

export type JobsRouteProp<T extends keyof JobsStackParamList> =
  NativeStackScreenProps<JobsStackParamList, T>['route'];

export type MessagesRouteProp<T extends keyof MessagesStackParamList> =
  NativeStackScreenProps<MessagesStackParamList, T>['route'];

export type ProfileRouteProp<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>['route'];

// Declare global types for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
