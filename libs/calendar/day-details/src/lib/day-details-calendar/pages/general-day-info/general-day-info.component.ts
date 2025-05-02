import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { DateManagerService, SessionService } from '@angular-monorepo/services-calendar';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { NgForOf } from '@angular/common';
import { filter, Subject } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { scheduledEventFactory } from '@angular-monorepo/factories-calendar';
import { EventEditDialogComponent } from '@angular-monorepo/ui';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { NotificationService } from '@angular-monorepo/services-calendar';
import { IDay, IScheduledEvent } from '@angular-monorepo/types-calendar';

@Component({
  selector: 'lib-app-general-day-info',
  standalone: true,
  imports: [NgForOf, FormsModule, ReactiveFormsModule, MatButton],
  templateUrl: './general-day-info.component.html',
  styleUrl: './general-day-info.component.scss',
})
export class GeneralDayInfoComponent implements OnInit, OnDestroy {
  currentDayInfo!: Signal<IDay>;
  eventsList!: IScheduledEvent[];
  private destroy$ = new Subject();

  constructor(
    private dateManagerService: DateManagerService,
    private sessionService: SessionService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.currentDayInfo = this.dateManagerService.selectedDay;
    this.eventsList = this.currentDayInfo().events;
  }

  setSelectedEventForEdit(): void {
    const event = this.createNewEvent(this.currentDayInfo().date);
    this.dialog
      .open(EventEditDialogComponent, {
        data: {
          appointment: event,
          permissionDelete: false,
        },
        height: '400px',
        width: '600px',
      })
      .afterClosed()
      .pipe(filter((message) => message))
      .subscribe((result: string) => {
        this.notificationService.openSnackBar(result);
      });
  }

  private createNewEvent(date: Date): ScheduledEvent {
    return scheduledEventFactory({
      date: new Date(date.setHours(0, 0, 0, 0)),
      content: '',
      editable: true,
      id: '',
      attendees: [],
      ownerId: this.sessionService.getUserId(),
    });
  }
}
