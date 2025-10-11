# Design Document

## Overview

The cat feeder application will be built using React Native with Expo Router, featuring a bottom tab navigation structure with four main screens. The app communicates with a Seeed Studio XIAO ESP32S3 development board via MQTT over WiFi to control camera and motor operations. The design follows iOS design patterns, particularly for the schedule screen which mimics iPhone's native alarm app interface.

## Architecture

### Technology Stack
- **Frontend**: React Native with Expo SDK 54
- **Navigation**: Expo Router with bottom tabs (@react-navigation/bottom-tabs)
- **Communication**: MQTT protocol for ESP32S3 communication
- **State Management**: React hooks and context for local state
- **Styling**: React Native StyleSheet with theme support
- **Icons**: Expo Symbols for consistent iconography

### Communication Architecture
```
Mobile App (React Native) 
    ↕ MQTT over WiFi
ESP32S3 Development Board
    ↕ Hardware Control
Camera + Motor (Cat Feeder)
```

### MQTT Topics Structure
- `catfeeder/camera/stream` - Camera feed data
- `catfeeder/motor/feed` - Manual feeding commands
- `catfeeder/schedule/set` - Schedule configuration
- `catfeeder/status` - Device status updates
- `catfeeder/logs` - Feeding event logs

## Components and Interfaces

### Navigation Structure
```
Root Layout (_layout.tsx)
└── Tab Layout ((tabs)/_layout.tsx)
    ├── Camera (camera.tsx)
    ├── Manual (manual.tsx) 
    ├── Schedule (schedule.tsx)
    └── Log (log.tsx)
```

### Core Components

#### 1. Bottom Tab Navigation
- **File**: `app/(tabs)/_layout.tsx`
- **Icons**: Camera, Hand, Clock, List icons using Expo Symbols
- **Labels**: Korean labels (카메라, 수동, 스케줄, 기록)
- **Styling**: iOS-style tab bar with haptic feedback

#### 2. Camera Screen (`app/(tabs)/camera.tsx`)
- **Live Feed Component**: Displays MJPEG stream from ESP32S3
- **Connection Status**: Shows WiFi connection status
- **Loading States**: Skeleton loader during connection
- **Error Handling**: Retry mechanism for failed connections

#### 3. Manual Screen (`app/(tabs)/manual.tsx`)
- **Feed Button**: Large, prominent feeding trigger button
- **Amount Selector**: Adjustable feeding portion size
- **Status Display**: Real-time motor operation feedback
- **Connection Indicator**: ESP32S3 connectivity status

#### 4. Schedule Screen (`app/(tabs)/schedule.tsx`)
- **Schedule List**: iPhone alarm-style list interface
- **Add Schedule Button**: Floating action button
- **Schedule Item**: Toggle switch, time display, repeat pattern
- **Time Picker Modal**: iOS-style time selection
- **Repeat Options**: Daily, weekdays, weekends, custom days

#### 5. Log Screen (`app/(tabs)/log.tsx`)
- **Feed History List**: Chronological feeding events
- **Date Filter**: Date range picker
- **Summary Cards**: Daily/weekly feeding statistics
- **Empty State**: Friendly message when no logs exist

### Data Models

#### Schedule Interface
```typescript
interface FeedingSchedule {
  id: string;
  time: string; // HH:MM format
  amount: number; // in grams
  enabled: boolean;
  repeatPattern: 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[]; // 0-6 (Sunday-Saturday)
  label?: string;
}
```

#### Log Entry Interface
```typescript
interface FeedingLog {
  id: string;
  timestamp: Date;
  amount: number;
  type: 'manual' | 'scheduled';
  scheduleId?: string;
  success: boolean;
  errorMessage?: string;
}
```

#### Device Status Interface
```typescript
interface DeviceStatus {
  connected: boolean;
  lastSeen: Date;
  batteryLevel?: number;
  motorStatus: 'idle' | 'feeding' | 'error';
  cameraStatus: 'active' | 'inactive' | 'error';
}
```

## Error Handling

### Connection Errors
- **MQTT Connection Loss**: Auto-retry with exponential backoff
- **ESP32S3 Offline**: Clear status indicators and retry options
- **Network Issues**: Offline mode with cached data

### Hardware Errors
- **Motor Jam**: Error feedback from ESP32S3 with troubleshooting steps
- **Camera Failure**: Fallback to status-only mode
- **Low Battery**: Notifications and power-saving suggestions

### User Input Errors
- **Invalid Schedule Times**: Validation with helpful error messages
- **Conflicting Schedules**: Warning dialogs for overlapping times
- **Network Permissions**: Clear instructions for WiFi setup

## Testing Strategy

### Unit Testing
- MQTT connection utilities
- Schedule validation logic
- Date/time formatting functions
- Data model transformations

### Integration Testing
- ESP32S3 communication flow
- Schedule execution accuracy
- Log data persistence
- Navigation state management

### User Acceptance Testing
- Schedule creation workflow (iPhone alarm app similarity)
- Manual feeding responsiveness
- Camera feed quality and stability
- Log filtering and search functionality

### Device Testing
- Multiple screen sizes (phones/tablets)
- iOS and Android platform differences
- Network connectivity variations
- Background app behavior for scheduled feeds

## Performance Considerations

### Camera Stream Optimization
- Adaptive bitrate based on connection quality
- Frame rate throttling for battery conservation
- Efficient MJPEG decoding and display

### Schedule Management
- Local storage for offline schedule access
- Background task scheduling for feed notifications
- Efficient MQTT message queuing

### Data Storage
- SQLite for local log storage
- Periodic log cleanup to prevent storage bloat
- Compressed data transmission to ESP32S3

## Security Considerations

### MQTT Security
- TLS encryption for MQTT connections
- Device authentication tokens
- Topic access control

### Data Privacy
- Local data storage (no cloud dependency)
- Secure WiFi configuration storage
- Camera feed encryption in transit

## UI/UX Design Patterns

### iOS Design Language
- **Schedule Screen**: Exact replication of iOS alarm app patterns
- **Navigation**: Standard iOS tab bar behavior
- **Modals**: iOS-style sheet presentations
- **Haptic Feedback**: Consistent with iOS interaction patterns

### Accessibility
- VoiceOver support for all interactive elements
- High contrast mode compatibility
- Large text size support
- Semantic labeling for screen readers

### Responsive Design
- Adaptive layouts for different screen sizes
- Safe area handling for modern devices
- Landscape mode support where appropriate