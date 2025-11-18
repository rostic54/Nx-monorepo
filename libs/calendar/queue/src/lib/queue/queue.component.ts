import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueManagementService } from '@angular-monorepo/queue-service';
import { IQueueSlot, IQueueNotification } from '@angular-monorepo/types-calendar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-queue',
  imports: [CommonModule],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css',
})
export class QueueComponent implements OnInit, OnDestroy {
  slots = signal<IQueueSlot[]>([]);
  notifications = signal<IQueueNotification[]>([]);
  unreadCount = signal<number>(0);
  isMonitoring = signal<boolean>(false);
  selectedSlot = signal<IQueueSlot | null>(null);
  currentUserId = 'user-demo-123'; // In real app, this would come from auth service

  private destroy$ = new Subject<void>();

  constructor(private queueService: QueueManagementService) {}

  ngOnInit(): void {
    this.loadQueueSlots();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.queueService.stopMonitoring();
  }

  loadQueueSlots(): void {
    this.queueService.getAvailableSlots()
      .pipe(takeUntil(this.destroy$))
      .subscribe(slots => {
        this.slots.set(slots);
      });
  }

  loadNotifications(): void {
    this.queueService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications.set(notifications);
        this.unreadCount.set(this.queueService.getUnreadNotificationsCount());
      });
  }

  toggleMonitoring(): void {
    if (this.isMonitoring()) {
      this.queueService.stopMonitoring();
      this.isMonitoring.set(false);
    } else {
      this.queueService.startMonitoring();
      this.isMonitoring.set(true);
    }
  }

  registerForSlot(slot: IQueueSlot): void {
    if (!slot.isAvailable) {
      alert('This slot is no longer available');
      return;
    }

    this.queueService.registerForSlot(slot.id, this.currentUserId)
      .subscribe({
        next: () => {
          alert(`Successfully registered for ${slot.title}`);
          this.selectedSlot.set(null);
        },
        error: (err) => {
          alert(`Registration failed: ${err}`);
        }
      });
  }

  cancelRegistration(slotId: string): void {
    if (confirm('Are you sure you want to cancel this registration?')) {
      this.queueService.cancelRegistration(slotId, this.currentUserId)
        .subscribe({
          next: () => {
            alert('Registration cancelled successfully');
          },
          error: (err) => {
            alert(`Cancellation failed: ${err}`);
          }
        });
    }
  }

  selectSlot(slot: IQueueSlot): void {
    this.selectedSlot.set(slot);
  }

  closeSlotDetails(): void {
    this.selectedSlot.set(null);
  }

  markNotificationRead(notification: IQueueNotification): void {
    this.queueService.markNotificationAsRead(notification.id);
  }

  isUserRegistered(slot: IQueueSlot): boolean {
    return slot.registeredUsers?.includes(this.currentUserId) || false;
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getAvailabilityClass(slot: IQueueSlot): string {
    if (!slot.isAvailable) return 'unavailable';
    if (slot.availableSpots <= 2) return 'limited';
    return 'available';
  }
}

