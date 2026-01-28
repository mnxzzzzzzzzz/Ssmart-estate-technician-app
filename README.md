# Smart Estate Technician App

A comprehensive React Native mobile application for maintenance technicians in smart estate management. Built with Expo, TypeScript, and React Navigation.

## 🚀 Features

### ✅ Completed Features

- **Authentication System**
  - Login screen with email/password validation
  - JWT token storage and management
  - Secure password toggle and loading states

- **Dashboard**
  - Welcome header with profile avatar
  - Job filtering (Active/Pending/Completed)
  - Real-time job cards with priority badges
  - Pull-to-refresh functionality

- **Job Management**
  - Comprehensive job list with search and filters
  - Detailed job view with 6-stage progress tracking
  - Time tracking with start/stop functionality
  - Materials tracking and management
  - Media upload with before/after categorization

- **Messaging System**
  - Real-time chat functionality
  - Message bubbles with status indicators
  - File and media sharing capabilities
  - Conversation management

- **Profile Management**
  - Technician profile with avatar and stats
  - Skills management with 8+ skill categories
  - Availability status toggle (4 statuses)
  - Building assignments management
  - Account settings (Face ID, 2FA, notifications)

- **Custom Navigation**
  - Beautiful custom bottom tab bar with animated white bubble
  - Purple pill-shaped container (90% screen width)
  - Smooth animations between tabs
  - TypeScript-powered navigation system

### 🎨 Design System

- **Theme**: Purple primary color (#6366F1)
- **Typography**: Consistent font weights and sizes
- **Components**: React Native Paper with custom styling
- **Icons**: Expo Vector Icons (MaterialCommunityIcons)
- **Layout**: Responsive design with proper spacing

## 🛠 Tech Stack

### Frontend (Mobile App)
- **React Native** with Expo SDK 54
- **TypeScript** with strict mode enabled
- **React Navigation 7** with custom tab bar
- **React Native Paper** for UI components
- **Expo Vector Icons** for iconography
- **AsyncStorage** for local data persistence

### Backend API
- **Node.js** with Express.js
- **TypeScript** with strict typing
- **PostgreSQL** with Prisma ORM
- **JWT** authentication
- **Socket.IO** for real-time features
- **Comprehensive API** with 33+ endpoints

### Development Tools
- **Expo CLI** for development and building
- **Metro Bundler** for JavaScript bundling
- **ESLint & Prettier** for code quality
- **Git** for version control

## 📱 Screenshots

### Dashboard
- Clean header with "Dashboard" title
- Today's Jobs section with filter tabs
- Job cards with icons, priorities, and details

### Jobs List
- Full-width search bar with filters below
- Job cards matching reference design
- Priority badges with color coding

### Custom Tab Bar
- Purple pill-shaped container
- Animated white bubble behind active tab
- Smooth transitions between tabs

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (optional)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mnxzzzzzzzzz/smart-estate_technician.git
   cd smart-estate_technician
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator

### Backend Setup (Optional)

1. **Navigate to backend directory**
   ```bash
   cd backend-aligned
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
smart-estate_technician/
├── components/           # Reusable UI components
│   ├── CustomTabBar.tsx # Custom animated tab bar
│   ├── JobCard.tsx      # Job card component
│   ├── MessageBubble.tsx# Chat message component
│   └── ...
├── screens/             # Screen components
│   ├── JobsListScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ChatScreen.tsx
│   └── ...
├── navigation/          # Navigation configuration
│   ├── MainTabNavigator.tsx
│   ├── AppNavigator.tsx
│   └── ...
├── types/              # TypeScript type definitions
│   ├── navigation.types.ts
│   ├── technician.types.ts
│   └── ...
├── data/               # Sample data and mock APIs
├── hooks/              # Custom React hooks
├── backend-aligned/    # Backend API (Node.js + PostgreSQL)
└── ...
```

## 🎯 Key Components

### Custom Tab Bar
- Animated white bubble that slides between tabs
- Purple pill-shaped container
- Smooth spring animations
- TypeScript integration

### Job Management
- 6-stage progress tracking
- Time tracking functionality
- Materials and media management
- Real-time updates

### Messaging System
- Real-time chat with Socket.IO
- File sharing capabilities
- Message status indicators
- Conversation management

## 🔧 Configuration

### Expo Configuration (`app.json`)
```json
{
  "expo": {
    "name": "Smart Estate Technician",
    "slug": "smart-estate-technician",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "sdkVersion": "54.0.0"
  }
}
```

### TypeScript Configuration
- Strict mode enabled
- Path mapping configured
- Comprehensive type definitions

## 🧪 Testing

The app includes mock data and sample APIs for testing:
- Sample jobs with different priorities
- Mock user profiles and settings
- Simulated real-time messaging
- Test authentication flows

## 📚 Documentation

- [Navigation System](./NAVIGATION_README.md)
- [TypeScript Migration](./TYPESCRIPT_MIGRATION.md)
- [Features Summary](./FEATURES_SUMMARY.md)
- [Backend API Documentation](./backend-aligned/API_DOCS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for the amazing development platform
- React Navigation for the flexible navigation system
- All contributors and testers

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the documentation files
- Review the sample code and examples

---

**Built with ❤️ for Smart Estate Management**