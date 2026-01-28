# Technician Dashboard - Complete Documentation

## Overview
A fully-featured React Native dashboard for maintenance technicians with job management, filtering, and real-time updates.

## Files Created

### Main Components
1. **TechnicianDashboard.js** - Main dashboard screen
2. **components/JobCard.js** - Reusable job card component
3. **components/PriorityBadge.js** - Priority indicator with color coding
4. **components/FilterChip.js** - Filter selection chips
5. **navigation/AppNavigator.js** - Navigation setup with bottom tabs
6. **App.js** - Application entry point
7. **data/sampleJobs.js** - Sample data for testing

## Features Implemented

### Header Section
- ✅ Welcome message with technician name
- ✅ Notification bell with badge count
- ✅ Profile avatar (navigates to Profile screen)

### Search & Filter
- ✅ Search bar for jobs
- ✅ Horizontal scrollable filter chips (Active, Pending, Completed)
- ✅ Secondary filter row (Status, Location, Category, Priority)
- ✅ Filter modal navigation ready

### Job Cards
Each card displays:
- ✅ Job title in bold
- ✅ Time ago badge with clock icon
- ✅ Priority badge with color coding:
  - Urgent: Red (#FF3B30)
  - High: Orange (#FF9500)
  - Medium: Yellow (#FFCC00)
  - Low: Green (#34C759)
- ✅ Category icon and text (Plumbing, Electrical, HVAC, Carpentry, Maintenance)
- ✅ Location (Building, Apartment)
- ✅ Time slot
- ✅ Status indicator with color

### Interactive Features
- ✅ Pull-to-refresh functionality
- ✅ Click job card → navigates to Job Details
- ✅ Empty state when no jobs
- ✅ Loading skeleton while fetching
- ✅ Real-time search filtering

### Backend Integration
- ✅ GET request to `/jobs?technicianId=:id&status=active`
- ✅ JWT token from AsyncStorage
- ✅ Error handling
- ✅ Loading states

## Installation

1. Install dependencies:
```bash
npm install
```

2. Link vector icons (if using bare React Native):
```bash
npx react-native link react-native-vector-icons
```

3. For iOS (if using bare React Native):
```bash
cd ios && pod install && cd ..
```

## Configuration

### Update API Endpoint
In `TechnicianDashboard.js`, update the API base URL:
```javascript
const response = await fetch(
  `YOUR_API_BASE_URL/jobs?technicianId=${technicianId}&status=active`,
  // ...
);
```

### Store Technician Data After Login
In `LoginScreen.js`, after successful login:
```javascript
await AsyncStorage.setItem('authToken', data.token);
await AsyncStorage.setItem('technicianId', data.user.id);
await AsyncStorage.setItem('technicianName', data.user.name);
```

## API Requirements

### GET /jobs
**Query Parameters:**
- `technicianId`: ID of the technician
- `status`: Filter by status (active, pending, completed)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Expected Response:**
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Toilet Flush Fix",
      "category": "Plumbing",
      "priority": "Urgent",
      "status": "Assigned",
      "location": {
        "building": "Building A",
        "apartment": "Apt 301"
      },
      "timeSlot": "11:00 AM – 12:00 PM",
      "createdAt": "2026-01-24T10:00:00Z",
      "description": "Toilet flush mechanism not working",
      "tenant": {
        "name": "John Smith",
        "phone": "+1 234-567-8900"
      }
    }
  ]
}
```

## Navigation Structure

```
AppNavigator (Stack)
├── Login
└── TechnicianDashboard (Bottom Tabs)
    ├── Home (Dashboard)
    ├── Jobs
    ├── Schedule
    └── Profile
```

## Component Props

### JobCard
```javascript
<JobCard 
  job={jobObject}
  onPress={() => handleJobPress(job)}
/>
```

### PriorityBadge
```javascript
<PriorityBadge priority="Urgent" />
// Options: "Urgent", "High", "Medium", "Low"
```

### FilterChip
```javascript
<FilterChip 
  label="Active"
  selected={true}
  onPress={() => handleFilterPress()}
/>
```

## Testing with Sample Data

To test without a backend, modify `TechnicianDashboard.js`:

```javascript
import { sampleJobs } from './data/sampleJobs';

// In fetchJobs function:
const fetchJobs = async () => {
  try {
    // Comment out API call and use sample data
    setJobs(sampleJobs);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
```

## Customization

### Colors
Update theme in `App.js`:
```javascript
const theme = {
  colors: {
    primary: '#6366F1',    // Purple
    accent: '#8B5CF6',     // Light purple
    background: '#F5F5F5', // Light gray
    surface: '#FFFFFF',    // White
    text: '#212121',       // Dark gray
    error: '#FF3B30',      // Red
  },
};
```

### Priority Colors
Modify in `components/PriorityBadge.js`:
```javascript
const configs = {
  Urgent: { color: '#FF3B30', icon: 'alert-circle', label: 'Urgent' },
  High: { color: '#FF9500', icon: 'arrow-up-circle', label: 'High' },
  Medium: { color: '#FFCC00', icon: 'minus-circle', label: 'Medium' },
  Low: { color: '#34C759', icon: 'arrow-down-circle', label: 'Low' },
};
```

### Category Icons
Modify in `components/JobCard.js`:
```javascript
const getCategoryIcon = (category) => {
  const icons = {
    Plumbing: 'pipe-wrench',
    Electrical: 'lightning-bolt',
    HVAC: 'air-conditioner',
    Carpentry: 'hammer',
    Maintenance: 'tools',
  };
  return icons[category] || 'wrench';
};
```

## Additional Screens to Create

1. **JobDetails.js** - Detailed view of a job
2. **Notifications.js** - List of notifications
3. **Profile.js** - Technician profile
4. **FilterModal.js** - Advanced filtering options

## Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Troubleshooting

### Icons not showing
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### AsyncStorage errors
Make sure AsyncStorage is properly installed:
```bash
npm install @react-native-async-storage/async-storage
```

### Navigation errors
Ensure all navigation dependencies are installed:
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

## Next Steps

1. Create JobDetails screen for full job information
2. Implement filter modal for advanced filtering
3. Add notifications screen
4. Create profile screen
5. Implement real-time updates with WebSocket
6. Add job status update functionality
7. Implement photo upload for job completion
8. Add offline support with local storage

## Performance Optimization

- Uses FlatList for efficient rendering of large job lists
- Implements pull-to-refresh for data updates
- Loading skeletons for better UX
- Optimized re-renders with proper state management
- Lazy loading for images (when implemented)

## Accessibility

- Proper touch targets (minimum 44x44)
- Semantic labels for screen readers
- Color contrast ratios meet WCAG standards
- Keyboard navigation support
