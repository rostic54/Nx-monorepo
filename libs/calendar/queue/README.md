# Queue Registration Library

This library provides an electronic queue registration system for managing appointment slots and registrations.

## Overview

The queue library enables users to:
- View available appointment/queue slots
- Register for available slots
- Cancel existing registrations
- Monitor for new slots in real-time
- Receive notifications when new slots become available

## Components

### QueueComponent

The main component that provides the UI for:
- Displaying available queue slots
- Managing registrations
- Monitoring for new slots
- Showing notifications

**Usage:**

```typescript
import { QueueComponent } from '@angular-monorepo/queue';

// In your routes
{
  path: 'queue',
  component: QueueComponent
}
```

## Features

### 1. Queue Slot Display
- Shows all available slots with details (date, time, location, capacity)
- Visual indicators for availability status:
  - Green border: Available with many spots
  - Orange border: Limited spots remaining
  - Gray border: Full/unavailable

### 2. Registration Management
- One-click registration for available slots
- Easy cancellation of existing registrations
- Visual feedback for registered slots

### 3. Real-time Monitoring
- Toggle monitoring to automatically check for new slots
- Polls every 30 seconds for updates
- Simulates new slot detection (can be connected to real API)

### 4. Notifications
- Displays unread notification count
- Shows all notifications with timestamps
- Click to mark notifications as read

### 5. Data Persistence
- Uses localStorage to persist slots and registrations
- Data survives page refreshes
- Includes demo data on first load

## API

The component uses the `QueueManagementService` from `@angular-monorepo/queue-service`.

### Key Methods:

- `registerForSlot(slot)` - Register for a queue slot
- `cancelRegistration(slotId)` - Cancel a registration
- `toggleMonitoring()` - Start/stop automatic monitoring
- `markNotificationRead(notification)` - Mark notification as read

## Styling

The component includes comprehensive CSS with:
- Responsive grid layout
- Smooth animations and transitions
- Modal for slot details
- Visual feedback for user interactions
- Mobile-responsive design

## Running unit tests

Run `nx test queue` to execute the unit tests.

## Building

This library is built as part of the calendar app build process:

```sh
npx nx build calendar
```

