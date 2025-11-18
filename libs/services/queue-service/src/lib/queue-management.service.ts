import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { IQueueSlot, IQueueRegistration, IQueueNotification } from '@angular-monorepo/types-calendar';

@Injectable({
  providedIn: 'root'
})
export class QueueManagementService {
  private queueSlotsSubject = new BehaviorSubject<IQueueSlot[]>([]);
  public queueSlots$ = this.queueSlotsSubject.asObservable();

  private registrationsSubject = new BehaviorSubject<IQueueRegistration[]>([]);
  public registrations$ = this.registrationsSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<IQueueNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private pollingInterval = 30000; // Poll every 30 seconds
  private isPolling = signal(false);

  constructor() {
    this.loadInitialData();
  }

  /**
   * Start monitoring for new queue slots
   */
  startMonitoring(): void {
    if (this.isPolling()) return;
    
    this.isPolling.set(true);
    interval(this.pollingInterval).subscribe(() => {
      if (this.isPolling()) {
        this.checkForNewSlots();
      }
    });
  }

  /**
   * Stop monitoring for new queue slots
   */
  stopMonitoring(): void {
    this.isPolling.set(false);
  }

  /**
   * Get all available queue slots
   */
  getAvailableSlots(): Observable<IQueueSlot[]> {
    return this.queueSlots$;
  }

  /**
   * Register for a queue slot
   */
  registerForSlot(slotId: string, userId: string): Observable<boolean> {
    return new Observable(observer => {
      const slots = this.queueSlotsSubject.value;
      const slot = slots.find(s => s.id === slotId);

      if (!slot) {
        observer.error('Slot not found');
        return;
      }

      if (!slot.isAvailable || slot.availableSpots <= 0) {
        observer.error('Slot is not available');
        return;
      }

      // Check if user is already registered
      const registrations = this.registrationsSubject.value;
      const existingRegistration = registrations.find(
        r => r.slotId === slotId && r.userId === userId
      );

      if (existingRegistration) {
        observer.error('Already registered for this slot');
        return;
      }

      // Create registration
      const registration: IQueueRegistration = {
        slotId,
        userId,
        registeredAt: new Date(),
        status: 'confirmed'
      };

      // Update slot
      slot.availableSpots--;
      if (slot.availableSpots === 0) {
        slot.isAvailable = false;
      }
      if (!slot.registeredUsers) {
        slot.registeredUsers = [];
      }
      slot.registeredUsers.push(userId);

      // Update subjects
      this.queueSlotsSubject.next([...slots]);
      this.registrationsSubject.next([...registrations, registration]);

      // Save to local storage
      this.saveToLocalStorage();

      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Cancel registration for a queue slot
   */
  cancelRegistration(slotId: string, userId: string): Observable<boolean> {
    return new Observable(observer => {
      const registrations = this.registrationsSubject.value;
      const registrationIndex = registrations.findIndex(
        r => r.slotId === slotId && r.userId === userId
      );

      if (registrationIndex === -1) {
        observer.error('Registration not found');
        return;
      }

      // Update registration status
      registrations[registrationIndex].status = 'cancelled';

      // Update slot
      const slots = this.queueSlotsSubject.value;
      const slot = slots.find(s => s.id === slotId);
      if (slot) {
        slot.availableSpots++;
        slot.isAvailable = true;
        if (slot.registeredUsers) {
          slot.registeredUsers = slot.registeredUsers.filter(id => id !== userId);
        }
      }

      // Update subjects
      this.queueSlotsSubject.next([...slots]);
      this.registrationsSubject.next([...registrations]);

      // Save to local storage
      this.saveToLocalStorage();

      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Get user's registrations
   */
  getUserRegistrations(userId: string): Observable<IQueueRegistration[]> {
    return new Observable(observer => {
      const registrations = this.registrationsSubject.value;
      const userRegistrations = registrations.filter(r => r.userId === userId);
      observer.next(userRegistrations);
      observer.complete();
    });
  }

  /**
   * Add a new queue slot (for testing/demo purposes)
   */
  addQueueSlot(slot: Omit<IQueueSlot, 'id'>): void {
    const newSlot: IQueueSlot = {
      ...slot,
      id: this.generateId()
    };

    const slots = this.queueSlotsSubject.value;
    this.queueSlotsSubject.next([...slots, newSlot]);
    this.saveToLocalStorage();

    // Create notification
    this.addNotification({
      slotId: newSlot.id,
      message: `New queue slot available: ${newSlot.title}`,
      timestamp: new Date(),
      read: false
    });
  }

  /**
   * Check for new slots (simulated)
   */
  private checkForNewSlots(): void {
    // This is a placeholder for actual API call
    // In a real implementation, this would fetch from a backend
    console.log('Checking for new queue slots...');
    
    // Simulate random new slot appearance (for demo)
    if (Math.random() > 0.9) {
      const randomSlot: Omit<IQueueSlot, 'id'> = {
        title: `Queue Slot ${new Date().toLocaleTimeString()}`,
        description: 'New slot available',
        dateTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        capacity: Math.floor(Math.random() * 10) + 5,
        availableSpots: Math.floor(Math.random() * 10) + 5,
        isAvailable: true,
        registeredUsers: []
      };
      this.addQueueSlot(randomSlot);
    }
  }

  /**
   * Add notification
   */
  private addNotification(notification: Omit<IQueueNotification, 'id'>): void {
    const newNotification: IQueueNotification = {
      ...notification,
      id: this.generateId()
    };

    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...notifications, newNotification]);
    this.saveToLocalStorage();
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next([...notifications]);
      this.saveToLocalStorage();
    }
  }

  /**
   * Get unread notifications count
   */
  getUnreadNotificationsCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  /**
   * Load initial data from local storage
   */
  private loadInitialData(): void {
    const storedSlots = localStorage.getItem('queueSlots');
    const storedRegistrations = localStorage.getItem('queueRegistrations');
    const storedNotifications = localStorage.getItem('queueNotifications');

    if (storedSlots) {
      const slots = JSON.parse(storedSlots);
      // Convert date strings back to Date objects
      slots.forEach((slot: IQueueSlot) => {
        slot.dateTime = new Date(slot.dateTime);
      });
      this.queueSlotsSubject.next(slots);
    } else {
      // Initialize with demo data
      this.initializeDemoData();
    }

    if (storedRegistrations) {
      const registrations = JSON.parse(storedRegistrations);
      registrations.forEach((reg: IQueueRegistration) => {
        reg.registeredAt = new Date(reg.registeredAt);
      });
      this.registrationsSubject.next(registrations);
    }

    if (storedNotifications) {
      const notifications = JSON.parse(storedNotifications);
      notifications.forEach((notif: IQueueNotification) => {
        notif.timestamp = new Date(notif.timestamp);
      });
      this.notificationsSubject.next(notifications);
    }
  }

  /**
   * Save data to local storage
   */
  private saveToLocalStorage(): void {
    localStorage.setItem('queueSlots', JSON.stringify(this.queueSlotsSubject.value));
    localStorage.setItem('queueRegistrations', JSON.stringify(this.registrationsSubject.value));
    localStorage.setItem('queueNotifications', JSON.stringify(this.notificationsSubject.value));
  }

  /**
   * Initialize with demo data
   */
  private initializeDemoData(): void {
    const demoSlots: IQueueSlot[] = [
      {
        id: this.generateId(),
        title: 'Morning Consultation',
        description: 'Available consultation slot in the morning',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        location: 'Office A',
        capacity: 10,
        availableSpots: 7,
        isAvailable: true,
        registeredUsers: []
      },
      {
        id: this.generateId(),
        title: 'Afternoon Service',
        description: 'Service appointment in the afternoon',
        dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        location: 'Office B',
        capacity: 5,
        availableSpots: 2,
        isAvailable: true,
        registeredUsers: []
      },
      {
        id: this.generateId(),
        title: 'Evening Session',
        description: 'Evening session available',
        dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Office C',
        capacity: 8,
        availableSpots: 8,
        isAvailable: true,
        registeredUsers: []
      }
    ];

    this.queueSlotsSubject.next(demoSlots);
    this.saveToLocalStorage();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
