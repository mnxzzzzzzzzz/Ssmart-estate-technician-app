# Technician Profile Screen - TypeScript Documentation

## Overview
A comprehensive, fully-typed TypeScript profile screen for maintenance technicians with strict type safety and proper interfaces.

## TypeScript Implementation

### ✅ All Files Use TypeScript (.tsx/.ts)
- **Strict typing enabled** - No 'any' types allowed
- **Comprehensive interfaces** - All data structures properly typed
- **Type-safe props** - All component props have interfaces
- **Enum usage** - For skills, availability, and building codes
- **Proper generics** - For navigation and API responses

## Files Created

### Type Definitions
1. **types/technician.types.ts** - Complete type system
   - `TechnicianSkill` enum (8 skills)
   - `AvailabilityStatus` enum (4 statuses)
   - `BuildingCode` enum (6 buildings)
   - `TechnicianProfile` interface
   - `AccountSettings` interface
   - Component prop interfaces
   - API request/response types
   - Utility types

### Screens (.tsx)
2. **screens/ProfileScreen.tsx** - Main profile screen
   - Fully typed with strict TypeScript
   - Comprehensive state management
   - Type-safe API calls
   - Proper error handling

### Components (.tsx)
3. **components/SkillTag.tsx** - Skill badge component
   - Typed with `SkillTagProps` interface
   - Enum-based skill configuration
   - Type-safe event handlers

4. **components/AvailabilityToggle.tsx** - Availability selector
   - Typed with `AvailabilityToggleProps` interface
   - Enum-based status configuration
   - Type-safe status changes

5. **components/BuildingItem.tsx** - Building assignment item
   - Typed with `BuildingItemProps` interface
   - Type-safe toggle handler
   - Proper boolean state management

### Sample Data (.ts)
6. **data/sampleProfile.ts** - Sample profile data
   - Fully typed sample data
   - Matches all interfaces
   - Ready for testing

## Type System Architecture

### Core Enums

```typescript
// Skills Enum
export enum TechnicianSkill {
  HVAC = 'HVAC',
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  CARPENTRY = 'Carpentry',
  MAINTENANCE = 'Maintenance',
  PAINTING = 'Painting',
  LANDSCAPING = 'Landscaping',
  SECURITY = 'Security',
}

// Availability Status Enum
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFDUTY = 'offduty',
  ONBREAK = 'onbreak',
}

// Building Codes Enum
export enum BuildingCode {
  BUILDING_A = 'Building A',
  BUILDING_B = 'Building B',
  BUILDING_C = 'Building C',
  BUILDING_D = 'Building D',
  BUILDING_E = 'Building E',
  BUILDING_F = 'Building F',
}
```

### Main Interfaces

```typescript
// Technician Profile
export interface TechnicianProfile {
  id: string;
  technicianId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  skills: TechnicianSkill[];
  assignedBuildings: BuildingCode[];
  availability: AvailabilityStatus;
  currentLocation?: Location;
  rating: number;
  totalJobsCompleted: number;
  averageResponseTime: number;
  joinDate: Date;
  isVerified: boolean;
}

// Account Settings
export interface AccountSettings {
  enableFaceId: boolean;
  enableTwoFactorAuth: boolean;
  notificationPreferences: NotificationPreferences;
  autoAcceptJobs: boolean;
  defaultWorkRadius: number;
  workingHours: WorkingHours;
}

// Notification Preferences
export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
```

### Component Props

```typescript
// Skill Tag Props
export interface SkillTagProps {
  skill: TechnicianSkill;
  isSelected?: boolean;
  onPress?: (skill: TechnicianSkill) => void;
  removable?: boolean;
  showIcon?: boolean;
}

// Availability Toggle Props
export interface AvailabilityToggleProps {
  status: AvailabilityStatus;
  onChange: (status: AvailabilityStatus) => void;
  disabled?: boolean;
}

// Building Item Props
export interface BuildingItemProps {
  building: BuildingCode;
  isAssigned: boolean;
  onToggle: (building: BuildingCode, assigned: boolean) => void;
}
```

## Features Implemented

### Profile Management
- ✅ View technician profile
- ✅ Edit profile information
- ✅ Update contact details
- ✅ Change avatar (placeholder)
- ✅ View statistics (rating, jobs, response time)
- ✅ Verified badge display

### Skills Management
- ✅ View all available skills (8 types)
- ✅ Add/remove skills in edit mode
- ✅ Visual skill tags with icons
- ✅ Color-coded skill categories
- ✅ Type-safe skill selection

### Availability Management
- ✅ 4 availability statuses:
  - Available (Green)
  - Busy (Orange)
  - Off Duty (Red)
  - On Break (Yellow)
- ✅ Visual status cards
- ✅ Status descriptions
- ✅ Type-safe status changes

### Building Assignments
- ✅ View assigned buildings
- ✅ Toggle building assignments
- ✅ Visual assignment indicators
- ✅ 6 building options (A-F)
- ✅ Type-safe building codes

### Account Settings
- ✅ Face ID toggle
- ✅ Two-Factor Authentication
- ✅ Auto Accept Jobs
- ✅ Type-safe setting updates

### Notification Settings
- ✅ Push notifications
- ✅ Email notifications
- ✅ SMS notifications
- ✅ Sound toggle
- ✅ Vibration toggle
- ✅ Type-safe preference updates

### Additional Features
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Error handling
- ✅ Edit mode
- ✅ Save/Cancel actions
- ✅ Logout functionality
- ✅ Member since date
- ✅ Version display

## TypeScript Benefits

### 1. Compile-Time Type Safety
```typescript
// ✅ Type-safe - Compiler catches errors
const handleSkillToggle = (skill: TechnicianSkill): void => {
  setSelectedSkills((prev) => {
    if (prev.includes(skill)) {
      return prev.filter((s) => s !== skill);
    } else {
      return [...prev, skill];
    }
  });
};

// ❌ Would cause compile error
handleSkillToggle("InvalidSkill"); // Error: not assignable to TechnicianSkill
```

### 2. Enum Safety
```typescript
// ✅ Only valid enum values allowed
const status: AvailabilityStatus = AvailabilityStatus.AVAILABLE;

// ❌ Would cause compile error
const status: AvailabilityStatus = "available"; // Error: use enum
```

### 3. Interface Validation
```typescript
// ✅ All required fields must be present
const profile: TechnicianProfile = {
  id: '1',
  technicianId: 'TCH-1023',
  fullName: 'John Doe',
  // ... all required fields
};

// ❌ Would cause compile error if missing required fields
```

### 4. Type-Safe State Management
```typescript
// ✅ State is properly typed
const [profile, setProfile] = useState<TechnicianProfile | null>(null);
const [selectedSkills, setSelectedSkills] = useState<TechnicianSkill[]>([]);
const [availability, setAvailability] = useState<AvailabilityStatus>(
  AvailabilityStatus.AVAILABLE
);
```

### 5. Type-Safe API Calls
```typescript
// ✅ Request and response are typed
const updateData: ProfileUpdateRequest = {
  fullName,
  email,
  phoneNumber,
  skills: selectedSkills,
  assignedBuildings,
  availability,
};

const response = await fetch(url, {
  method: 'PUT',
  body: JSON.stringify(updateData),
});

const data: ProfileUpdateResponse = await response.json();
```

## API Integration

### GET /technicians/:id/profile
**Response Type:** `TechnicianProfile`
```typescript
{
  id: string;
  technicianId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  skills: TechnicianSkill[];
  assignedBuildings: BuildingCode[];
  availability: AvailabilityStatus;
  currentLocation?: Location;
  rating: number;
  totalJobsCompleted: number;
  averageResponseTime: number;
  joinDate: string; // ISO date string
  isVerified: boolean;
}
```

### PUT /technicians/:id/profile
**Request Type:** `ProfileUpdateRequest`
```typescript
{
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  skills?: TechnicianSkill[];
  assignedBuildings?: BuildingCode[];
  availability?: AvailabilityStatus;
}
```

**Response Type:** `ProfileUpdateResponse`
```typescript
{
  success: boolean;
  profile: TechnicianProfile;
  message?: string;
}
```

### GET /technicians/:id/settings
**Response Type:** `AccountSettings`

### PUT /technicians/:id/settings
**Request Type:** `SettingsUpdateRequest`
```typescript
{
  settings: Partial<AccountSettings>;
}
```

## Usage Examples

### Using SkillTag Component
```typescript
import SkillTag from '../components/SkillTag';
import { TechnicianSkill } from '../types/technician.types';

<SkillTag
  skill={TechnicianSkill.PLUMBING}
  isSelected={true}
  onPress={(skill) => console.log(skill)}
  removable={true}
  showIcon={true}
/>
```

### Using AvailabilityToggle Component
```typescript
import AvailabilityToggle from '../components/AvailabilityToggle';
import { AvailabilityStatus } from '../types/technician.types';

<AvailabilityToggle
  status={AvailabilityStatus.AVAILABLE}
  onChange={(newStatus) => setStatus(newStatus)}
  disabled={false}
/>
```

### Using BuildingItem Component
```typescript
import BuildingItem from '../components/BuildingItem';
import { BuildingCode } from '../types/technician.types';

<BuildingItem
  building={BuildingCode.BUILDING_A}
  isAssigned={true}
  onToggle={(building, assigned) => {
    console.log(`${building} is now ${assigned ? 'assigned' : 'unassigned'}`);
  }}
/>
```

## Testing with Sample Data

To test without a backend, use the sample data:

```typescript
import {
  sampleTechnicianProfile,
  sampleAccountSettings,
} from '../data/sampleProfile';

// In ProfileScreen.tsx
const fetchProfile = async (): Promise<void> => {
  try {
    // Use sample data instead of API call
    setProfile(sampleTechnicianProfile);
    setSettings(sampleAccountSettings);
    
    // Initialize form fields
    setFullName(sampleTechnicianProfile.fullName);
    setEmail(sampleTechnicianProfile.email);
    // ... etc
  } finally {
    setLoading(false);
  }
};
```

## Type Checking

### Run Type Check
```bash
npx tsc --noEmit
```

### Check Specific File
```bash
npx tsc --noEmit screens/ProfileScreen.tsx
```

## Common TypeScript Patterns Used

### 1. Enum Iteration
```typescript
Object.values(TechnicianSkill).map((skill) => (
  <SkillTag key={skill} skill={skill} />
))
```

### 2. Type Guards
```typescript
if (profile) {
  // TypeScript knows profile is not null here
  console.log(profile.fullName);
}
```

### 3. Optional Chaining
```typescript
const location = profile?.currentLocation?.latitude;
```

### 4. Type Assertions (Avoided)
```typescript
// ❌ Avoid using 'as' unless absolutely necessary
const data = response.json() as TechnicianProfile;

// ✅ Better: Use proper typing
const data: TechnicianProfile = await response.json();
```

### 5. Partial Types
```typescript
// Update only some settings
const updateData: Partial<AccountSettings> = {
  enableFaceId: true,
};
```

## Best Practices Followed

### ✅ Strict Typing
- No 'any' types used
- All functions have return types
- All parameters are typed
- All state variables are typed

### ✅ Enum Usage
- Skills use enum (not strings)
- Availability uses enum
- Building codes use enum
- Type-safe comparisons

### ✅ Interface Definitions
- All data structures have interfaces
- Component props have interfaces
- API requests/responses typed
- Utility types defined

### ✅ Type Safety
- Compile-time error detection
- IDE autocomplete support
- Refactoring safety
- Self-documenting code

### ✅ Code Organization
- Types in separate file
- Components in separate files
- Proper imports/exports
- Clear file structure

## Extending the Type System

### Adding New Skills
```typescript
// In types/technician.types.ts
export enum TechnicianSkill {
  // ... existing skills
  APPLIANCE_REPAIR = 'Appliance Repair',
  LOCKSMITH = 'Locksmith',
}

// Update skill config in SkillTag.tsx
const skillConfig: SkillConfig = {
  // ... existing configs
  [TechnicianSkill.APPLIANCE_REPAIR]: {
    icon: 'washing-machine',
    color: '#9C27B0',
  },
};
```

### Adding New Availability Status
```typescript
// In types/technician.types.ts
export enum AvailabilityStatus {
  // ... existing statuses
  EMERGENCY = 'emergency',
}

// Update config in AvailabilityToggle.tsx
const availabilityConfig: AvailabilityConfig = {
  // ... existing configs
  [AvailabilityStatus.EMERGENCY]: {
    label: 'Emergency',
    color: '#D32F2F',
    icon: 'alert',
    description: 'Emergency response mode',
  },
};
```

## Troubleshooting

### Type Error: Property does not exist
**Solution:** Check interface definition and ensure property is included

### Type Error: Not assignable
**Solution:** Verify enum values and type compatibility

### Type Error: Possibly null
**Solution:** Use optional chaining or null checks

### Import Errors
**Solution:** Ensure correct import paths and file extensions

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

## Summary

✅ **100% TypeScript** - All files use .tsx/.ts extensions
✅ **Strict Typing** - No 'any' types, all properly typed
✅ **Comprehensive Enums** - Skills, availability, buildings
✅ **Complete Interfaces** - All data structures defined
✅ **Type-Safe Components** - All props properly typed
✅ **Production Ready** - Fully functional with type safety

---

**The profile screen is fully implemented with strict TypeScript typing! 🎉**
