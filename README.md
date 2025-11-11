# Zeller React Native User Management App

A React Native application for displaying, filtering, and managing a list of users with GraphQL API integration and local database persistence for offline usage.

## Features

- **User Management**: Add, edit, and delete users with form validation
- **GraphQL Integration**: Fetches user data from GraphQL API
- **Local Database**: Uses Realm for offline data persistence
- **Filtering**: Filter users by role (All, Admin, Manager)
- **Search**: Search users by name
- **Pull-to-Refresh**: Refresh user list with latest data from API
- **Swipe Navigation**: Swipe between filtered views using PagerView
- **Smooth Animations**: Animated tab transitions and role selection
- **Form Validation**: Comprehensive validation for name and email fields
- **Offline Support**: Works offline with local database

## Prerequisites

- Node.js >= 20
- Yarn or npm
- React Native development environment set up
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and Android SDK
- For running the mock server: Node.js with ES modules support

## Project Structure

```
zellerreactnativetask/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── UserList.tsx
│   │   ├── UserListItem.tsx
│   │   ├── UserModal.tsx
│   │   ├── TabBar.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   └── SectionHeader.tsx
│   ├── screens/             # Screen components
│   │   └── UserListScreen.tsx
│   ├── services/            # Business logic and API services
│   │   ├── api.ts           # GraphQL API integration
│   │   ├── database.ts      # Realm database operations
│   │   └── userService.ts   # User service orchestration
│   ├── models/              # Database models
│   │   └── UserSchema.ts
│   ├── types/               # TypeScript type definitions
│   │   └── User.ts
│   ├── utils/               # Utility functions
│   │   ├── theme.ts         # Theme configuration
│   └── config/              # Configuration files
│       └── graphql.ts      # Apollo Client configuration
├── tests/                   # Test files
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── utils/
│   └── setup.ts
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd zellerreactnativetask
yarn install
```

### 2. Install iOS Dependencies (iOS only)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 3. Start the Mock GraphQL Server

The app requires a GraphQL server to be running. Start the mock server from the parent directory:

```bash
# From the root directory (zeller-rn-task)
cd mock-server
yarn install
yarn start
```

The mock server will run on `http://localhost:9002/graphql` by default.

### 4. Configure GraphQL Endpoint (if needed)

The GraphQL endpoint is configured in `src/config/graphql.ts`. By default:
- **iOS Simulator**: `http://localhost:9002/graphql`
- **Android Emulator**: `http://10.0.2.2:9002/graphql`
- **Physical Device**: Update the IP address in `graphql.ts` to your computer's IP (e.g., `http://192.168.1.100:9002/graphql`)

## Running the App

### Start Metro Bundler

```bash
yarn start
```

### Run on iOS

```bash
yarn ios
```

### Run on Android

```bash
yarn android
```

## Running Tests

### Run all tests

```bash
yarn test
```

### Run tests with coverage

```bash
yarn test:coverage
```

The test suite includes:
- **Unit Tests**: Validation logic, utility functions, services
- **Integration Tests**: API integration, database operations
- **Component Tests**: UI components, user interactions
- **Screen Tests**: Main screen functionality


## Technologies Used

- **React Native** 0.82.1
- **TypeScript** - Type safety
- **Apollo Client** 3.8.10 - GraphQL client
- **Realm** 20.2.0 - Local database
- **React Native Pager View** - Swipe navigation
- **React Native Safe Area Context** - Safe area handling
- **Jest** - Testing framework
- **React Native Testing Library** - Component testing

## Key Features Implementation

### Form Validation

- Name validation:
  - Cannot be empty
  - Only alphabets and spaces allowed
  - Maximum 50 characters
- Email validation:
  - Valid email format (if provided)
  - Optional field

### Data Flow

1. **Initial Load**: App loads users from local database
2. **Empty Database**: If database is empty, fetches from GraphQL API and saves to database
3. **Pull-to-Refresh**: Fetches latest data from API and updates database
4. **CRUD Operations**: All operations are saved to local database
5. **Offline Support**: App works offline using cached data

### User Interface

- **Tab Navigation**: Filter by All, Admin, or Manager
- **Swipe Gestures**: Swipe between filtered views
- **Search**: Real-time search by user name
- **Alphabetical Grouping**: Users grouped by first letter
- **Pull-to-Refresh**: Refresh data from API
- **Floating Action Button**: Quick access to add new user

## Troubleshooting

### GraphQL Connection Issues

- **iOS Simulator**: Ensure mock server is running on `localhost:9002`
- **Android Emulator**: Use `10.0.2.2:9002` instead of `localhost`
- **Physical Device**: Update IP address in `src/config/graphql.ts` to your computer's local IP

### Database Issues

- If you encounter Realm errors, try clearing the app data and reinstalling
- Check console logs for database initialization errors

### Build Issues

- **iOS**: Run `cd ios && bundle exec pod install` after installing dependencies
- **Android**: Ensure Android SDK and build tools are properly installed
- Clear cache: `yarn start --reset-cache`

## Development Notes

- The app uses Realm for local database persistence
- GraphQL queries are defined in `src/services/api.ts`
- Theme configuration is centralized in `src/utils/theme.ts`
- All components use the theme for consistent styling
- Tests are located in the `tests/` folder parallel to `src/`

## License

This project is part of a code challenge.
