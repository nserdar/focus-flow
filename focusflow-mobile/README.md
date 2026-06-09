# Focus Flow Mobile App

React Native mobile application for Focus Flow productivity management.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Task Management (CRUD, Search, Filter)
- ✅ Goal Management (CRUD, Search, Filter)
- ✅ Focus Session Tracking
- ✅ Pagination support for all lists
- ✅ Modern UI with React Native Paper

## Setup

### Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

3. Update API URL in `src/config/api.ts`:
```typescript
const API_BASE_URL = 'http://your-api-url:8081/api';
```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Project Structure

```
src/
├── config/          # API configuration
├── navigation/      # Navigation setup
├── screens/         # Screen components
│   ├── auth/       # Login, Register
│   ├── tasks/      # Task list and detail
│   ├── goals/      # Goal list and detail
│   ├── focus/      # Focus sessions
│   └── profile/    # User profile
├── services/        # API services
├── store/           # Redux store
└── types/           # TypeScript types
```

## API Integration

The app connects to the Focus Flow API running on port 8081 by default. Make sure the API is running and accessible from your device/emulator.

### Development
- Android Emulator: Use `http://10.0.2.2:8081/api`
- iOS Simulator: Use `http://localhost:8081/api`
- Physical Device: Use your computer's IP address (e.g., `http://192.168.1.100:8081/api`)

## Features Overview

### Authentication
- Secure JWT token storage
- Automatic token refresh
- Protected routes

### Tasks
- Create, read, update, delete tasks
- Search and filter by status, priority, area
- Pagination support
- Due date tracking

### Goals
- Create and manage goals
- Track progress with status
- Set start and end dates
- Filter by area

### Focus Sessions
- View focus session history
- Track session duration
- Filter by task and status

## License

MIT

