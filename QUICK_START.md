# Quick Start Guide - Technician Maintenance App

## Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Test with Sample Data (No Backend Required)

#### Test Login Screen
The login screen is ready to use. To test without a backend:

In `LoginScreen.js`, temporarily replace the API call:
```javascript
// Comment out the fetch call and use this:
if (email && password) {
  await AsyncStorage.setItem('authToken', 'sample-token');
  await AsyncStorage.setItem('technicianId', '1');
  await AsyncStorage.setItem('technicianName', 'John Technician');
  await AsyncStorage.setItem('userRole', 'technician');
  navigation.replace('TechnicianDashboard');
}
```

#### Test Dashboard
In `TechnicianDashboard.js`, replace the `fetchJobs` function:
```javascript
import { sampleJobs } from './data/sampleJobs';

const fetchJobs = async () => {
  try {
    setJobs(sampleJobs);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
```

#### Test Job Details
In `JobDetailsScreen.js`, replace the `fetchJobDetails` function:
```javascript
import { getJobDetailsById } from './data/sampleJobDetails';

const fetchJobDetails = async () => {
  try {
    const jobData = getJobDetailsById(jobId);
    
    if (jobData) {
      setJob(jobData);
      setNotes(jobData.notes || '');
      setMaterials(jobData.materials || []);
      setMedia(jobData.media || []);
      setTimeTracking(jobData.timeTracking);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
```

### 3. Run the App
```bash
# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### 4. Test Flow

1. **Login Screen**
   - Enter any email and password
   - Click "Log In"
   - Should navigate to Dashboard

2. **Dashboard**
   - See list of sample jobs
   - Try filters: Active, Pending, Completed
   - Use search bar
   - Pull down to refresh
   - Tap any job card

3. **Job Details**
   - View job information
   - Tap progress steps to update status
   - Try action buttons (Accept/Start/Complete)
   - Add notes (auto-saves after 2 seconds)
   - Start/Stop timer
   - Add photos (placeholder implementation)
   - View materials list

## Sample Data Available

### Jobs (6 total)
- Job #1: Toilet Flush Fix (Urgent, Assigned)
- Job #2: AC Not Cooling (High, In Progress) - Has materials and media
- Job #3: Light Switch Replacement (Medium, Accepted)
- Job #4: Cabinet Door Repair (Low, Completed) - Fully documented
- Job #5: Leaking Faucet (High, Assigned)
- Job #6: General Maintenance (Low, Completed)

### Test Different Scenarios

**New Job (ID: 1)**
- Status: Assigned
- No notes, materials, or media
- Test accepting and starting job

**Active Job (ID: 2)**
- Status: Working
- Has notes, materials, and media
- Timer is running
- Test completing job

**Completed Job (ID: 4)**
- Status: Completed
- Full documentation
- Multiple before/after photos
- Materials list with costs

## Connect to Real Backend

### 1. Update API Base URL

Create a config file `config.js`:
```javascript
export const API_BASE_URL = 'https://your-api.com/api';
```

### 2. Update All Screens

Replace `YOUR_API_BASE_URL` with:
```javascript
import { API_BASE_URL } from './config';

const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
```

### 3. Required API Endpoints

- `POST /auth/login` - User authentication
- `GET /jobs?technicianId=:id&status=:status` - List jobs
- `GET /jobs/:id` - Job details
- `PUT /jobs/:id/status` - Update job status
- `POST /jobs/:id/updates` - Save notes
- `POST /jobs/:id/media` - Upload media
- `PUT /jobs/:id/time` - Time tracking

See `JOB_DETAILS_README.md` for complete API specifications.

## Add Image Picker

### Using Expo
```bash
npm install expo-image-picker
```

In `components/MediaUploader.js`:
```javascript
import * as ImagePicker from 'expo-image-picker';

const handleCameraCapture = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    const mediaItem = {
      id: Date.now(),
      uri: result.assets[0].uri,
      type: 'image',
      category: 'before',
      timestamp: new Date().toISOString(),
    };
    await uploadMedia(mediaItem);
  }
};
```

### Using Bare React Native
```bash
npm install react-native-image-picker
```

See `JOB_DETAILS_README.md` for implementation details.

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm start -- --reset-cache
```

### Icons not showing
```bash
# For bare React Native
npx react-native link react-native-vector-icons

# For iOS
cd ios && pod install && cd ..
```

### Navigation errors
Make sure all screens are properly imported in `navigation/AppNavigator.js`

### AsyncStorage errors
```bash
npm install @react-native-async-storage/async-storage
```

## Project Structure Overview

```
Technician App
│
├── Authentication
│   └── LoginScreen.js
│
├── Main App (Bottom Tabs)
│   ├── Home Tab
│   │   ├── TechnicianDashboard.js
│   │   └── JobDetailsScreen.js (navigates from job card)
│   ├── Jobs Tab
│   ├── Schedule Tab
│   └── Profile Tab
│
└── Components (Reusable)
    ├── JobCard.js
    ├── PriorityBadge.js
    ├── FilterChip.js
    ├── ProgressTracker.js
    ├── MediaUploader.js
    ├── MaterialItem.js
    └── TimeTracker.js
```

## Key Features to Test

### Progress Tracker
- Tap any step to update job status
- Confirmation dialog appears
- Visual feedback with colors and checkmarks

### Time Tracking
- Start timer → "Live" indicator appears
- Time updates every second
- Stop timer → time is saved
- Elapsed time persists across sessions

### Notes Auto-Save
- Type in notes field
- Wait 2 seconds
- "Saving..." indicator appears
- Notes are saved automatically

### Media Upload
- Click "Add Photos/Videos"
- Choose Camera or Gallery
- Photo appears in grid
- Tap photo to preview
- Delete from preview modal

### Materials
- Click "Add Material"
- Enter name, quantity, price
- Total is calculated automatically
- Delete materials with confirmation

### Action Buttons
- Change based on job status
- Different colors for different actions
- Validation before completion

## Next Steps After Testing

1. ✅ Verify all screens work with sample data
2. ✅ Test navigation flow
3. ✅ Test all interactive features
4. 🔄 Connect to real backend API
5. 🔄 Implement image picker
6. 🔄 Add AddMaterial modal
7. 🔄 Create additional screens (Profile, Notifications)
8. 🔄 Add real-time updates
9. 🔄 Implement offline support
10. 🔄 Deploy to app stores

## Support & Documentation

- `README.md` - Main project documentation
- `DASHBOARD_README.md` - Dashboard screen details
- `JOB_DETAILS_README.md` - Job details screen details
- `QUICK_START.md` - This file

## Tips for Development

1. **Use Sample Data First** - Test all features before connecting to backend
2. **Test on Real Devices** - Camera and gallery features need real devices
3. **Check Permissions** - Camera and gallery require user permissions
4. **Monitor Console** - Watch for errors and API call logs
5. **Test Edge Cases** - Empty states, network errors, validation

## Common Customizations

### Change Colors
Edit `App.js`:
```javascript
const theme = {
  colors: {
    primary: '#6366F1',    // Your brand color
    accent: '#8B5CF6',
    // ... other colors
  },
};
```

### Add New Job Categories
Edit `components/JobCard.js`:
```javascript
const getCategoryIcon = (category) => {
  const icons = {
    Plumbing: 'pipe-wrench',
    Electrical: 'lightning-bolt',
    YourCategory: 'your-icon',
  };
  return icons[category] || 'wrench';
};
```

### Modify Progress Steps
Edit `JobDetailsScreen.js`:
```javascript
const progressSteps = [
  { id: 1, label: 'Your Step', status: 'YourStatus' },
  // ... more steps
];
```

Happy coding! 🚀
