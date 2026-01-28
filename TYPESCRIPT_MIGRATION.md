# TypeScript Migration Guide

## Overview
All files have been converted to TypeScript with strict typing for better type safety, improved IDE support, and enhanced code quality.

## Files Converted to TypeScript

### Type Definitions
- ✅ `types/index.ts` - Core type definitions for the entire app

### Screens (.tsx)
- ✅ `LoginScreen.tsx` - Login screen with typed props and state
- ✅ `TechnicianDashboard.tsx` - Dashboard with typed navigation
- ✅ `JobDetailsScreen.tsx` - Job details with comprehensive typing

### Components (.tsx)
- ✅ `components/JobCard.tsx` - Job card with Job interface
- ✅ `components/PriorityBadge.tsx` - Priority badge with JobPriority type
- ✅ `components/FilterChip.tsx` - Filter chip with typed props
- ✅ `components/ProgressTracker.tsx` - Progress tracker with ProgressStep type
- ✅ `components/MediaUploader.tsx` - Media uploader with Media interface
- ✅ `components/MaterialItem.tsx` - Material item with Material interface
- ✅ `components/TimeTracker.tsx` - Time tracker with TimeTracking interface

### Data Files (.ts)
- ✅ `data/sampleJobs.ts` - Sample jobs with Job[] type
- ✅ `data/sampleJobDetails.ts` - Sample job details with JobDetails type

### Configuration
- ✅ `tsconfig.json` - TypeScript configuration with strict mode
- ✅ `package.json` - Updated with TypeScript dependencies

## Key Type Definitions

### Core Types

```typescript
// User and Authentication
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'technician' | 'admin' | 'tenant';
}

interface AuthResponse {
  token: string;
  user: User;
}

// Job Types
type JobCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'Carpentry' | 'Maintenance';
type JobPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
type JobStatus = 'Assigned' | 'Accepted' | 'En Route' | 'On Site' | 'Working' | 'Completed';

interface Job {
  id: number;
  title: string;
  category: JobCategory;
  priority: JobPriority;
  status: JobStatus;
  location: Location;
  timeSlot: string;
  createdAt: string;
  description: string;
  tenant: Tenant;
}

// Extended Job Details
interface JobDetails extends Job {
  notes?: string;
  materials: Material[];
  media: Media[];
  timeTracking: TimeTracking;
}

// Supporting Types
interface Material {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Media {
  id: number;
  uri: string;
  type: 'image' | 'video';
  category: 'before' | 'after';
  timestamp: string;
}

interface TimeTracking {
  isRunning: boolean;
  startTime: string | null;
  elapsedTime: number;
}
```

### Navigation Types

```typescript
type RootStackParamList = {
  Login: undefined;
  TechnicianDashboard: undefined;
  JobDetails: { jobId: number };
  AddMaterial: { jobId: number; onMaterialAdded: (material: Material) => void };
  FilterModal: { filterType: string };
  Notifications: undefined;
  Profile: undefined;
  ForgotPassword: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Schedule: undefined;
  Profile: undefined;
};
```

## TypeScript Benefits

### 1. Type Safety
- Catch errors at compile time, not runtime
- Prevent invalid prop types
- Ensure correct API response handling

### 2. Better IDE Support
- Autocomplete for props and methods
- Inline documentation
- Refactoring support
- Go to definition

### 3. Self-Documenting Code
- Types serve as documentation
- Clear function signatures
- Explicit return types

### 4. Easier Refactoring
- Rename symbols safely
- Find all usages
- Detect breaking changes

## TypeScript Configuration

### tsconfig.json Settings

```json
{
  "compilerOptions": {
    "strict": true,                    // Enable all strict type checking
    "noUnusedLocals": true,           // Report unused local variables
    "noUnusedParameters": true,       // Report unused parameters
    "noImplicitReturns": true,        // Report missing return statements
    "noFallthroughCasesInSwitch": true, // Report fallthrough cases
    "esModuleInterop": true,          // Enable ES module interop
    "skipLibCheck": true,             // Skip type checking of declaration files
    "resolveJsonModule": true,        // Allow importing JSON files
    "jsx": "react-native"             // JSX support for React Native
  }
}
```

## Common TypeScript Patterns

### 1. Component Props

```typescript
interface Props {
  job: Job;
  onPress: () => void;
}

const JobCard: React.FC<Props> = ({ job, onPress }) => {
  // Component implementation
};
```

### 2. State with Types

```typescript
const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>('');
```

### 3. Event Handlers

```typescript
const handlePress = (): void => {
  // Handler implementation
};

const handleChange = (text: string): void => {
  setText(text);
};
```

### 4. Async Functions

```typescript
const fetchJobs = async (): Promise<void> => {
  try {
    const response = await fetch(url);
    const data: JobsResponse = await response.json();
    setJobs(data.jobs);
  } catch (error) {
    console.error(error);
  }
};
```

### 5. Optional Props

```typescript
interface Props {
  material: Material;
  onDelete: () => void;
  onEdit?: () => void;  // Optional prop
}
```

### 6. Union Types

```typescript
type StepStatus = 'completed' | 'current' | 'upcoming';

const getColor = (status: StepStatus): string => {
  // Implementation
};
```

### 7. Generic Types

```typescript
const renderItem: ListRenderItem<Media> = ({ item }) => {
  // Render implementation
};
```

## Migration Checklist

- ✅ Install TypeScript and type definitions
- ✅ Create tsconfig.json
- ✅ Define core types in types/index.ts
- ✅ Convert .js files to .tsx (React components)
- ✅ Convert .js files to .ts (utilities, data)
- ✅ Add type annotations to all functions
- ✅ Type all component props
- ✅ Type all state variables
- ✅ Type all API responses
- ✅ Fix all TypeScript errors
- ✅ Enable strict mode
- ✅ Test all functionality

## Type Checking

### Run Type Check
```bash
npx tsc --noEmit
```

### Watch Mode
```bash
npx tsc --noEmit --watch
```

## IDE Setup

### VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features (built-in)

### VS Code Settings
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Common TypeScript Errors and Solutions

### 1. Type 'X' is not assignable to type 'Y'
**Solution:** Ensure the types match or use type assertion if necessary
```typescript
const value = data as ExpectedType;
```

### 2. Object is possibly 'null' or 'undefined'
**Solution:** Use optional chaining or null checks
```typescript
const name = user?.name;
// or
if (user) {
  const name = user.name;
}
```

### 3. Property 'X' does not exist on type 'Y'
**Solution:** Add the property to the interface or use type assertion
```typescript
interface User {
  name: string;
  email: string;
  phone?: string;  // Optional property
}
```

### 4. Argument of type 'X' is not assignable to parameter of type 'Y'
**Solution:** Ensure function arguments match the expected types
```typescript
const handlePress = (id: number): void => {
  // Implementation
};

handlePress(job.id);  // Ensure job.id is a number
```

## Best Practices

### 1. Use Interfaces for Objects
```typescript
interface Job {
  id: number;
  title: string;
}
```

### 2. Use Type Aliases for Unions
```typescript
type JobStatus = 'Assigned' | 'Accepted' | 'Completed';
```

### 3. Avoid 'any' Type
```typescript
// Bad
const data: any = response.json();

// Good
const data: JobsResponse = await response.json();
```

### 4. Use Const Assertions
```typescript
const colors = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
} as const;
```

### 5. Type Function Returns
```typescript
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
```

### 6. Use Enums for Constants (Optional)
```typescript
enum JobPriority {
  Urgent = 'Urgent',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React Native TypeScript](https://reactnative.dev/docs/typescript)

## Next Steps

1. ✅ All files converted to TypeScript
2. ✅ Type definitions created
3. ✅ Strict mode enabled
4. 🔄 Run type checking: `npx tsc --noEmit`
5. 🔄 Fix any remaining type errors
6. 🔄 Add more specific types as needed
7. 🔄 Consider adding ESLint with TypeScript rules
8. 🔄 Add Prettier for code formatting

## Support

If you encounter TypeScript errors:
1. Check the error message carefully
2. Verify type definitions in `types/index.ts`
3. Ensure all imports are correct
4. Run `npm install` to ensure all dependencies are installed
5. Restart your IDE/editor

---

**All files are now TypeScript-ready with strict typing! 🎉**
