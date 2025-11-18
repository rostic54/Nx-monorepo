export interface IQueueSlot {
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

export interface IQueueRegistration {
  slotId: string;
  userId: string;
  registeredAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface IQueueNotification {
  id: string;
  slotId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
