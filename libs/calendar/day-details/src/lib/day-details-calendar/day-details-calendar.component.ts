import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateManagerService} from "@angular-monorepo/services-calendar";
import {CdkVirtualForOf, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {HoursModel} from "@angular-monorepo/models-calendar";
import {HOURS_IN_DAY} from "@angular-monorepo/constants";
import {ScheduledEvent} from "@angular-monorepo/models-calendar";
import {NgFor} from "@angular/common";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {filter, Subject, takeUntil} from "rxjs";
import {DayEventHandlerService} from "@angular-monorepo/services-calendar";
import {scheduledEventFactory} from "@angular-monorepo/factories-calendar";
import {createDateWithSpecifiedTime} from "@angular-monorepo/utils-calendar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {EventEditDialogComponent} from "@angular-monorepo/ui";
import {IDeletePermissions} from "@angular-monorepo/types-calendar";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList, CdkDropListGroup, DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NotificationService} from "@angular-monorepo/services-calendar";

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
  CdkDropListGroup
]

@Component({
  selector: 'lib-day-details',
  standalone: true,
  imports: [
    ...virtualScrolling,
    ...dragAndDrop,
    NgFor,
    MatButton,
    RouterOutlet,
    MatDialogModule,
  ],
  providers: [
    DayEventHandlerService,
  ],
  templateUrl: './day-details-calendar.component.html',
  styleUrl: './day-details-calendar.component.scss'
})
export class DayDetailsCalendarComponent implements OnInit, OnDestroy {
  hours: HoursModel[] = [];
  connectedTo: string[] = [];
  isDeletable: IDeletePermissions = {isAllowed: true}
  private onDestroy$ = new Subject();

  constructor(private dateManagerService: DateManagerService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private dialog: MatDialog) {
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.dateManagerService.getSelectedDay$.pipe(
      takeUntil(this.onDestroy$)
    )
      .subscribe(() => {
        this.buildHours(this.dateManagerService.selectedDay().events);
      });
    this.buildHours(this.dateManagerService.selectedDay().events);
  }

  buildHours(dayEvents: ScheduledEvent[]) {
    this.connectedTo.length = 0;
    this.hours = Array.from({length: HOURS_IN_DAY}, (value, index) => index)
      .map((index): HoursModel => {
        this.connectedTo.push('hour_' + index);
        const foundEvents: ScheduledEvent[] = dayEvents
          .map(({
                  currentDate,
                  content,
                  editable,
                  id
                }: ScheduledEvent) => scheduledEventFactory(currentDate, content, editable, id))
          .filter((event: ScheduledEvent) => event.dateHour === index)
        return new HoursModel(index, [...foundEvents]);
      })
  }

  openHourDetails(hour: HoursModel): void {
    this.router.navigate(['create', hour.timeNumber], {relativeTo: this.route});
  }

  setSelectedEventForEdit(event: Event, scheduledEvent: ScheduledEvent): void {
    event.stopPropagation();
    this.dialog.open(EventEditDialogComponent, {
      data: {
        appointment: scheduledEvent,
        permissionDelete: this.isDeletable
      },
      height: '400px',
      width: '600px',
    }).afterClosed()
      .pipe(filter(message => message))
      .subscribe((result: string) => {
          this.notificationService.openSnackBar(result)
        }
      )
  }

  drop(event: CdkDragDrop<ScheduledEvent[]>, hour: HoursModel) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const transferredEvent = event.container.data[event.currentIndex];

      const updatedDate = createDateWithSpecifiedTime(transferredEvent.currentDate, hour.timeNumber, transferredEvent.dateMinutes);
      const updatedEvent = scheduledEventFactory(updatedDate, transferredEvent.content, transferredEvent.editable, transferredEvent.id);
      this.updateStore(updatedEvent);
      this.notificationService.openSnackBar('The appointment was rescheduled successfully.')
    }
  }

  updateStore(updatedEvent: ScheduledEvent): void {
    this.dateManagerService.createEventForParticularDate(updatedEvent);

  }

  back() {
    this.router.navigate(['..'])
  }

  identify(index: number, item: ScheduledEvent): number {
    return item.id
  }
}
