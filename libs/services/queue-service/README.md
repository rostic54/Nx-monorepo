# Queue Management Service

This library provides the core service for managing electronic queue registrations and slot availability.

## Overview

The `QueueManagementService` is a singleton service that handles:
- Queue slot management
- User registrations
- Real-time monitoring for new slots
- Notifications
- Data persistence

## Service: QueueManagementService

### Installation

```typescript
import { QueueManagementService } from '@angular-monorepo/queue-service';

// The service is provided in 'root', so it's automatically available
constructor(private queueService: QueueManagementService) {}
```

### Key Features

#### 1. Queue Slot Management

**Get Available Slots:**
```typescript
this.queueService.getAvailableSlots()
  .subscribe(slots => {
    // Handle slots array
  });
```

**Add New Slot (Demo/Testing):**
```typescript
this.queueService.addQueueSlot({
  title: 'Morning Consultation',
  description: 'Available consultation slot',
  dateTime: new Date(),
  capacity: 10,
  availableSpots: 10,
  isAvailable: true,
  registeredUsers: []
});
```

#### 2. Registration Management

**Register for a Slot:**
```typescript
this.queueService.registerForSlot(slotId, userId)
  .subscribe({
    next: (success) => console.log('Registered!'),
    error: (err) => console.error('Registration failed:', err)
  });
```

**Cancel Registration:**
```typescript
this.queueService.cancelRegistration(slotId, userId)
  .subscribe({
    next: (success) => console.log('Cancelled!'),
    error: (err) => console.error('Cancellation failed:', err)
  });
```

**Get User Registrations:**
```typescript
this.queueService.getUserRegistrations(userId)
  .subscribe(registrations => {
    // Handle user's registrations
  });
```

#### 3. Real-time Monitoring

**Start Monitoring:**
```typescript
this.queueService.startMonitoring();
// Polls for new slots every 30 seconds
```

**Stop Monitoring:**
```typescript
this.queueService.stopMonitoring();
```

#### 4. Notifications

**Access Notifications:**
```typescript
this.queueService.notifications$
  .subscribe(notifications => {
    // Handle notifications array
  });
```

**Mark as Read:**
```typescript
this.queueService.markNotificationAsRead(notificationId);
```

**Get Unread Count:**
```typescript
const count = this.queueService.getUnreadNotificationsCount();
```

### Data Models

The service uses the following interfaces from `@angular-monorepo/types-calendar`:

#### IQueueSlot
```typescript
interface IQueueSlot {
  id: string;
  title: string;
  description?: string;
  dateTime: Date;
  location?: string;
  capacity: number;
  availableSpots: number;
  isAvailable: boolean;
  registeredUsers?: string[];
}
```

#### IQueueRegistration
```typescript
interface IQueueRegistration {
  slotId: string;
  userId: string;
  registeredAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

#### IQueueNotification
```typescript
interface IQueueNotification {
  id: string;
  slotId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
```

### Data Persistence

The service automatically persists data to localStorage:
- Queue slots: `queueSlots`
- Registrations: `queueRegistrations`
- Notifications: `queueNotifications`

Data is loaded on service initialization and saved after every change.

### Demo Data

On first load, the service initializes with 3 demo slots for testing purposes.

### Monitoring Simulation

The current implementation simulates new slot detection with a 10% random chance every poll cycle. In a production environment, this should be replaced with actual API calls to a backend service.

## Running unit tests

Run `nx test queue-service` to execute the unit tests.

## Future Enhancements

- Connect to real backend API
- Add WebSocket support for real-time updates
- Implement user authentication integration
- Add email/push notification support
- Support for recurring slots
- Waitlist functionality

