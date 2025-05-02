import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { DateManagerService } from '@angular-monorepo/services-calendar';
import {
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { HoursModel } from '@angular-monorepo/models-calendar';
import { HOURS_IN_DAY } from '@angular-monorepo/constants';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { DatePipe, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { filter, Subject } from 'rxjs';
import { ScheduledEventAPIService } from '@angular-monorepo/services-calendar';
import { scheduledEventFactory } from '@angular-monorepo/factories-calendar';
import { createDateWithSpecifiedTime } from '@angular-monorepo/utils-calendar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventEditDialogComponent } from '@angular-monorepo/ui';
import {
  IDay,
  IDeletePermissions,
  IScheduledEvent,
} from '@angular-monorepo/types-calendar';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NotificationService } from '@angular-monorepo/services-calendar';

const virtualScrolling = [
  CdkVirtualScrollViewport,
  CdkVirtualForOf,
  ScrollingModule,
];

const dragAndDrop = [
  DragDropModule,
  CdkDrag,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
];

@Component({
  selector: 'lib-day-details',
  standalone: true,
  imports: [
    ...virtualScrolling,
    ...dragAndDrop,
    NgFor,
    MatButton,
    DatePipe,
    RouterOutlet,
    MatDialogModule,
  ],
  providers: [ScheduledEventAPIService],
  templateUrl: './day-details-calendar.component.html',
  styleUrl: './day-details-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayDetailsCalendarComponent implements OnInit, OnDestroy {
  hours: HoursModel[] = [];
  connectedTo: string[] = [];
  selectedDay: Signal<IDay> = computed(() => {
    this.buildHours(this.dateManagerService.selectedDay().events);
    return this.dateManagerService.selectedDay();
  });
  isDeletable: IDeletePermissions = { isAllowed: true };
  private onDestroy$ = new Subject();

  constructor(
    private dateManagerService: DateManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    if (this.dateManagerService.selectedDay()) {
      // this.selectedDay =
    }
  }

  buildHours(dayEvents: IScheduledEvent[]) {
    this.connectedTo.length = 0;
    this.hours = Array.from(
      { length: HOURS_IN_DAY },
      (value, index) => index
    ).map((index): HoursModel => {
      this.connectedTo.push('hour_' + index);
      const foundEvents: IScheduledEvent[] = dayEvents
        .map(
          ({
            currentDate,
            content,
            editable,
            id,
            attendees,
            ownerId,
          }: IScheduledEvent) =>
            scheduledEventFactory({
              date: currentDate,
              content,
              editable,
              id,
              attendees,
              ownerId,
            })
        )
        .filter((event: ScheduledEvent) => event.dateHour === index);
      return new HoursModel(index, [...foundEvents]);
    });
  }

  openHourDetails(hour: HoursModel): void {
    this.router.navigate(['create', hour.timeNumber], {
      relativeTo: this.route,
    });
  }

  setSelectedEventForEdit(event: Event, scheduledEvent: IScheduledEvent): void {
    event.stopPropagation();
    this.dialog
      .open(EventEditDialogComponent, {
        data: {
          appointment: scheduledEvent,
          permissionDelete: this.isDeletable,
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

  drop(event: CdkDragDrop<IScheduledEvent[]>, hour: HoursModel) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const transferredEvent = event.container.data[event.currentIndex];

      const updatedDate = createDateWithSpecifiedTime(
        transferredEvent.currentDate,
        hour.timeNumber,
        transferredEvent.dateMinutes
      );
      const updatedEvent = scheduledEventFactory({
        date: updatedDate,
        content: transferredEvent.content,
        editable: transferredEvent.editable,
        id: transferredEvent.id,
        attendees: transferredEvent.attendees,
        ownerId: transferredEvent.ownerId,
      });
      this.updateScheduledEvent(updatedEvent);
    }
  }

  updateScheduledEvent(updatedEvent: ScheduledEvent): void {
    this.dateManagerService.updateScheduledEvent(updatedEvent);
  }

  back() {
    this.router.navigate(['..']);
  }

  identify(index: number, item: IScheduledEvent): string {
    return item.id;
  }
}
