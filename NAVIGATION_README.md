# React Navigation Structure - TypeScript Documentation

## Overview
Complete React Navigation implementation with strict TypeScript typing for the Technician Maintenance App.

## ✅ TypeScript Implementation

### All Files Use TypeScript (.tsx)
- **Strict typing** - No 'any' types in navigation
- **Comprehensive type definitions** - All navigation types defined
- **Type-safe navigation** - Compile-time route validation
- **Type-safe params** - All route params properly typed
- **Custom hooks** - Typed navigation hooks

## Files Created

### Type Definitions
1. **types/navigation.types.ts** - Complete navigation type system
   - 8 Param Lists (Root, Auth, Main, Home, Jobs, Messages, Profile, Schedule)
   - Screen Props types for all navigators
   - Navigation Prop types
   - Route Prop types
   - Global type declarations

### Custom Hooks
2. **hooks/useNavigation.ts** - Typed navigation hooks
   - `useRootNavigation()`
   - `useAuthNavigation()`
   - `useMainTabNavigation()`
   - `useHomeNavigation()`
   - `useJobsNavigation()`
   - `useMessagesNavigation()`
   - `useProfileNavigation()`
   - `useScheduleNavigation()`
   - Route hooks for all navigators

### Navigators (.tsx)
3. **navigation/AppNavigator.tsx** - Root navigator
4. **navigation/AuthNavigator.tsx** - Authentication flow
5. **navigation/MainTabNavigator.tsx** - Bottom tabs
6. **navigation/HomeStackNavigator.tsx** - Home stack
7. **navigation/JobsStackNavigator.tsx** - Jobs stack
8. **navigation/MessagesStackNavigator.tsx** - Messages stack
9. **navigation/ProfileStackNavigator.tsx** - Profile stack
10. **navigation/ScheduleStackNavigator.tsx** - Schedule stack

## Navigation Architecture

```
AppNavigator (Root Stack)
├── Auth Stack
│   ├── Login
│   ├── ForgotPassword
│   ├── ResetPassword
│   └── Register
│
└── Main (Bottom Tabs)
    ├── HomeTab (Stack)
    │   ├── Dashboard
    │   ├── JobDetails
    │   ├── Notifications
    │   └── QuickStats
    │
    ├── JobsTab (Stack)
    │   ├── JobsList
    │   ├── JobDetails
    │   ├── CreateJob
    │   └── JobHistory
    │
    ├── MessagesTab (Stack)
    │   ├── MessagesList
    │   ├── Chat
    │   ├── NewMessage
    │   └── ArchivedMessages
    │
    ├── ScheduleTab (Stack)
    │   ├── WeeklySchedule
    │   ├── DailySchedule
    │   ├── TimeOffRequest
    │   └── CalendarView
    │
    └── ProfileTab (Stack)
        ├── ProfileMain
        ├── EditProfile
        ├── AccountSettings
        ├── ChangePassword
        ├── StatisticsDetails
        ├── SecuritySettings
        └── NotificationSettings
```

## Type System

### Root Stack Param List
```typescript
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
```

### Auth Stack Param List
```typescript
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
    email: string;
  };
  Register: undefined;
};
```

### Main Tab Param List
```typescript
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  JobsTab: NavigatorScreenParams<JobsStackParamList>;
  MessagesTab: NavigatorScreenParams<MessagesStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  ScheduleTab: NavigatorScreenParams<ScheduleStackParamList>;
};
```

### Home Stack Param List
```typescript
export type HomeStackParamList = {
  Dashboard: undefined;
  JobDetails: {
    jobId: string;
    jobTitle?: string;
  };
  Notifications: undefined;
  QuickStats: undefined;
};
```

### Jobs Stack Param List
```typescript
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
```

### Messages Stack Param List
```typescript
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
```

### Profile Stack Param List
```typescript
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
```

### Schedule Stack Param List
```typescript
export type ScheduleStackParamList = {
  WeeklySchedule: undefined;
  DailySchedule: {
    date: string;
  };
  TimeOffRequest: undefined;
  CalendarView: undefined;
};
```

## Usage Examples

### 1. Using Typed Navigation in Screens

#### With Screen Props
```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { HomeStackScreenProps } from '../types/navigation.types';

type Props = HomeStackScreenProps<'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const handleNavigateToJob = (jobId: string): void => {
    navigation.navigate('JobDetails', {
      jobId,
      jobTitle: 'Toilet Flush Fix',
    });
  };

  return (
    <View>
      <Text>Dashboard</Text>
      <Button
        title="View Job"
        onPress={() => handleNavigateToJob('123')}
      />
    </View>
  );
};

export default DashboardScreen;
```

#### With Custom Hooks
```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useHomeNavigation } from '../hooks/useNavigation';

const DashboardScreen: React.FC = () => {
  const navigation = useHomeNavigation();

  const handleNavigateToJob = (jobId: string): void => {
    navigation.navigate('JobDetails', {
      jobId,
      jobTitle: 'Toilet Flush Fix',
    });
  };

  return (
    <View>
      <Text>Dashboard</Text>
      <Button
        title="View Job"
        onPress={() => handleNavigateToJob('123')}
      />
    </View>
  );
};

export default DashboardScreen;
```

### 2. Accessing Route Params

#### With Screen Props
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { HomeStackScreenProps } from '../types/navigation.types';

type Props = HomeStackScreenProps<'JobDetails'>;

const JobDetailsScreen: React.FC<Props> = ({ route }) => {
  const { jobId, jobTitle } = route.params;

  return (
    <View>
      <Text>Job ID: {jobId}</Text>
      <Text>Job Title: {jobTitle}</Text>
    </View>
  );
};

export default JobDetailsScreen;
```

#### With Custom Hook
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useHomeRoute } from '../hooks/useNavigation';

const JobDetailsScreen: React.FC = () => {
  const route = useHomeRoute('JobDetails');
  const { jobId, jobTitle } = route.params;

  return (
    <View>
      <Text>Job ID: {jobId}</Text>
      <Text>Job Title: {jobTitle}</Text>
    </View>
  );
};

export default JobDetailsScreen;
```

### 3. Navigating Between Stacks

#### From Home to Jobs
```typescript
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../types/navigation.types';

const SomeComponent: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const goToJobsList = (): void => {
    navigation.navigate('JobsTab', {
      screen: 'JobsList',
      params: {
        filter: 'active',
      },
    });
  };

  return <Button title="View Jobs" onPress={goToJobsList} />;
};
```

#### From Messages to Job Details
```typescript
import { useMessagesNavigation } from '../hooks/useNavigation';

const ChatScreen: React.FC = () => {
  const navigation = useMessagesNavigation();

  const viewJobDetails = (jobId: string): void => {
    // Navigate to JobDetails in the same stack
    navigation.navigate('JobDetails', { jobId });
  };

  return <Button title="View Job" onPress={() => viewJobDetails('123')} />;
};
```

### 4. Type-Safe Navigation with Optional Params

```typescript
import { useJobsNavigation } from '../hooks/useNavigation';

const JobsListScreen: React.FC = () => {
  const navigation = useJobsNavigation();

  // All valid - TypeScript validates params
  navigation.navigate('JobsList', {});
  navigation.navigate('JobsList', { filter: 'active' });
  navigation.navigate('JobsList', { filter: 'urgent', category: 'Plumbing' });

  // ❌ TypeScript error - invalid filter value
  // navigation.navigate('JobsList', { filter: 'invalid' });

  return null;
};
```

### 5. Nested Navigation

```typescript
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../types/navigation.types';

const SomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const navigateToChat = (): void => {
    navigation.navigate('Main', {
      screen: 'MessagesTab',
      params: {
        screen: 'Chat',
        params: {
          conversationId: '123',
          participantName: 'John Doe',
        },
      },
    });
  };

  return <Button title="Open Chat" onPress={navigateToChat} />;
};
```

## TypeScript Benefits

### 1. Compile-Time Route Validation
```typescript
// ✅ Valid - TypeScript knows this route exists
navigation.navigate('JobDetails', { jobId: '123' });

// ❌ Compile error - route doesn't exist
navigation.navigate('InvalidRoute');
```

### 2. Required Params Validation
```typescript
// ✅ Valid - all required params provided
navigation.navigate('ResetPassword', {
  token: 'abc123',
  email: 'user@example.com',
});

// ❌ Compile error - missing required params
navigation.navigate('ResetPassword');
```

### 3. Param Type Validation
```typescript
// ✅ Valid - correct param types
navigation.navigate('DailySchedule', { date: '2024-01-24' });

// ❌ Compile error - wrong param type
navigation.navigate('DailySchedule', { date: 123 });
```

### 4. Optional Params
```typescript
// ✅ Both valid - optional params
navigation.navigate('JobDetails', { jobId: '123' });
navigation.navigate('JobDetails', { jobId: '123', jobTitle: 'Fix AC' });
```

### 5. Autocomplete Support
```typescript
// IDE provides autocomplete for:
// - Screen names
// - Param names
// - Param values (for unions/enums)
navigation.navigate('JobsList', {
  filter: 'active', // Autocomplete suggests: 'active' | 'pending' | 'completed' | 'urgent'
});
```

## Custom Navigation Hooks

### Why Use Custom Hooks?

1. **Type Safety** - Automatic type inference
2. **Cleaner Code** - No need to import types
3. **Consistency** - Same pattern across app
4. **Refactoring** - Easier to update

### Available Hooks

```typescript
// Root navigation
const navigation = useRootNavigation();

// Auth navigation
const navigation = useAuthNavigation();

// Main tab navigation
const navigation = useMainTabNavigation();

// Stack navigations
const navigation = useHomeNavigation();
const navigation = useJobsNavigation();
const navigation = useMessagesNavigation();
const navigation = useProfileNavigation();
const navigation = useScheduleNavigation();

// Route hooks
const route = useHomeRoute('Dashboard');
const route = useJobsRoute('JobsList');
const route = useMessagesRoute('Chat');
```

## Deep Linking Support

### Configure Deep Links
```typescript
// In AppNavigator.tsx
const linking = {
  prefixes: ['techapp://', 'https://techapp.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          ResetPassword: 'reset-password/:token/:email',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Dashboard: 'dashboard',
              JobDetails: 'job/:jobId',
            },
          },
          MessagesTab: {
            screens: {
              Chat: 'chat/:conversationId',
            },
          },
        },
      },
    },
  },
};

// Use in NavigationContainer
<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

### Deep Link Examples
```
techapp://login
techapp://job/123
techapp://chat/456
techapp://reset-password/token123/user@example.com
```

## Navigation Guards

### Auth Guard Example
```typescript
// In AppNavigator.tsx
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

useEffect(() => {
  checkAuthStatus();
}, []);

const checkAuthStatus = async (): Promise<void> => {
  const token = await AsyncStorage.getItem('authToken');
  setIsAuthenticated(!!token);
};

// Conditional rendering based on auth status
{!isAuthenticated ? (
  <Stack.Screen name="Auth" component={AuthNavigator} />
) : (
  <Stack.Screen name="Main" component={MainTabNavigator} />
)}
```

## Tab Badges

### Dynamic Badge Example
```typescript
// In MainTabNavigator.tsx
const [unreadCount, setUnreadCount] = useState<number>(0);

<Tab.Screen
  name="MessagesTab"
  component={MessagesStackNavigator}
  options={{
    title: 'Messages',
    tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
  }}
/>
```

## Screen Options

### Common Screen Options
```typescript
// Header styling
headerStyle: {
  backgroundColor: '#6366F1',
},
headerTintColor: '#FFFFFF',
headerTitleStyle: {
  fontWeight: 'bold',
},

// Presentation modes
presentation: 'modal', // Modal presentation
presentation: 'card',  // Card presentation

// Animations
animation: 'slide_from_right',
animation: 'fade',
animation: 'none',

// Header visibility
headerShown: false,
headerShown: true,
```

## Best Practices

### ✅ Do's
1. Always use typed navigation hooks
2. Define all route params in types
3. Use NavigatorScreenParams for nested navigators
4. Keep param lists up to date
5. Use optional params when appropriate
6. Leverage TypeScript autocomplete

### ❌ Don'ts
1. Don't use 'any' for navigation types
2. Don't skip param type definitions
3. Don't use string literals for routes
4. Don't bypass TypeScript checks
5. Don't ignore navigation type errors

## Troubleshooting

### Type Error: Property does not exist
**Solution:** Check param list definitions in `navigation.types.ts`

### Type Error: Argument not assignable
**Solution:** Verify param types match the defined interface

### Navigation not working
**Solution:** Ensure screen is registered in navigator

### Params undefined
**Solution:** Check if params are optional or required

## Migration Guide

### From JavaScript to TypeScript

1. **Add type definitions**
```typescript
// Before (JS)
const navigation = useNavigation();
navigation.navigate('JobDetails', { jobId: '123' });

// After (TS)
const navigation = useJobsNavigation();
navigation.navigate('JobDetails', { jobId: '123' });
```

2. **Update screen components**
```typescript
// Before (JS)
const JobDetailsScreen = ({ navigation, route }) => {
  const { jobId } = route.params;
  // ...
};

// After (TS)
type Props = JobsStackScreenProps<'JobDetails'>;
const JobDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { jobId } = route.params;
  // ...
};
```

## Resources

- [React Navigation TypeScript](https://reactnavigation.org/docs/typescript/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)

## Summary

✅ **Complete Navigation Structure** - All navigators implemented
✅ **Strict TypeScript** - No 'any' types, full type safety
✅ **Custom Hooks** - Type-safe navigation hooks
✅ **Comprehensive Types** - All routes and params typed
✅ **Production Ready** - Auth guards, deep linking support

---

**The navigation system is fully implemented with strict TypeScript typing! 🎉**
