import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { Day } from '@angular-monorepo/models-calendar';
import {
  createDateInstance,
  createDateWithSpecifiedMonthDay,
  daysInMonth,
} from '@angular-monorepo/utils-calendar';
import { DAYS_IN_MONTH_VIEW } from '@angular-monorepo/constants';
import { Month } from '@angular-monorepo/models-calendar';
import { catchError, Observable, of, throwError } from 'rxjs';
import { DayFactory } from '@angular-monorepo/factories-calendar';
import { DatePipe } from '@angular/common';
import { ScheduledEventService } from './scheduled-event.service';
import {
  IDay,
  IDragAndDropEventDetails,
  IScheduledEvent,
} from '@angular-monorepo/types-calendar';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class DateManagerService {
  private storageService = inject(LocalStorageService);
  private readonly LAST_VIEWED_DATE = 'lastViewedDate';
  private _currentDate = signal(new Date(2030, 12, 8));
  private _monthDays = signal<IDay[]>([]);
  private _activeMonth = signal<Month>(new Month(this._currentDate()));
  private _selectedDay = signal<IDay>(new Day(new Date(), []));
  private _daySelectionMode = signal<boolean>(false);
  // getSelectedDay$: BehaviorSubject<Day> = new BehaviorSubject(
  //   new Day(new Date(), [])
  // );
  selectedDayIndex!: number;

  get currentDate(): Signal<Date> {
    return this._currentDate.asReadonly();
  }

  get days(): Signal<IDay[]> {
    return this._monthDays.asReadonly();
  }

  get activeMonth(): Signal<Month> {
    return this._activeMonth.asReadonly();
  }

  get selectedDay(): Signal<IDay> {
    return this._selectedDay.asReadonly();
  }

  get isSelectionModeActive(): Signal<boolean> {
    return this._daySelectionMode.asReadonly();
  }

  constructor(
    private scheduledEventService: ScheduledEventService,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {
    const storedDate = this.storageService.getItemFromLocalStorage(
      this.LAST_VIEWED_DATE
    );
    if (storedDate.length) {
      const date = new Date(JSON.parse(storedDate));
      this._currentDate.set(date);
    }
    this.setAppropriateMonth(this._currentDate());
    effect(() => {
      if (this._currentDate()) {
        this.setActiveDateToStorage(this._currentDate());
      }
      const selDay = this._selectedDay();
      // console.log('SELECTED DAY WAS CHANGED', selDay);
    });
  }

  changeDate(date: Date): void {
    if (this.isNotEqualToCurrentDate(date)) {
      this._currentDate.set(date);
      this.setAppropriateMonth(date);
    }
  }

  setSelectedDay(index: number): void {
    const selectedDay = this.getSelectedDayByIndex(index);
    this._selectedDay.set(selectedDay);
    // console.log('SELECTED DAY', selectedDay, this.selectedDay());
  }

  toggleSelectionMode(): void {
    this._daySelectionMode.set(!this._daySelectionMode());
  }

  isNotEqualToCurrentDate(date: Date): boolean {
    return (
      date.getFullYear() !== this._currentDate().getFullYear() ||
      date.getMonth() !== this._currentDate().getMonth()
    );
  }

  buildDaysOfMonth(): Day[] {
    const startsFrom = this._activeMonth().firstDay;
    const lastDayOfPreviousMonth = new Date(
      this.currentDate().getFullYear(),
      this.currentDate().getMonth(),
      0
    );
    const daysInCurrentMonth = daysInMonth(
      this.currentDate().getFullYear(),
      this.currentDate().getMonth() + 1
    );
    const takeDaysFromNextMonth =
      DAYS_IN_MONTH_VIEW - (startsFrom - 1 + daysInCurrentMonth);
    const displayMonth: Day[] = [];
    if (startsFrom !== 0) {
      for (let i = startsFrom - 1; i > 0; i--) {
        const day = createDateInstance(lastDayOfPreviousMonth);
        day.setDate(lastDayOfPreviousMonth.getDate() - (i - 1));
        this.pushDayToMonth(day, displayMonth, false);
      }
    }

    for (let i = 0; i < daysInCurrentMonth; i++) {
      const day = createDateWithSpecifiedMonthDay(
        this.currentDate().getFullYear(),
        this.currentDate().getMonth(),
        i + 1
      );
      this.pushDayToMonth(day, displayMonth);
    }

    if (takeDaysFromNextMonth > 0) {
      const firstDayOfNextMonth = createDateWithSpecifiedMonthDay(
        this.currentDate().getFullYear(),
        this.currentDate().getMonth() + 1,
        1
      );
      for (let i = 0; i <= takeDaysFromNextMonth % 7; i++) {
        const day = createDateInstance(firstDayOfNextMonth);
        day.setDate(firstDayOfNextMonth.getDate() + i);
        this.pushDayToMonth(day, displayMonth, false);
      }
    }
    return displayMonth;
  }

  //////////////////////////////////////////////////////////////////////////////////
  // *  REQUESTS                                                                 *//
  //////////////////////////////////////////////////////////////////////////////////

  updateRemoteAndLocalStorage(dropDetails: IDragAndDropEventDetails): void {
    // TODO: Update date in DB
    const { fromDay, toDay } = dropDetails;
    const { id, content, editable } = dropDetails.eventDetails;
    const scheduledEvent = new ScheduledEvent(
      toDay.date,
      content,
      editable,
      id
    );
    debugger;
    this.scheduledEventService
      .updateEventById(dropDetails.eventDetails.id, scheduledEvent)
      .subscribe((event) => {
        this.updateEventListForSelectedDay(event);
        this.updateEventsInCurrentMonth(event);
        console.log('MONTH DAYS AFTER DROPING ON MONTH: ', this._monthDays())
        this.updateDaysInLocalStore([fromDay, toDay]);
      });
  }

  private getAppointmentsForPeriod(periods: Day[]): void {
    // console.log('INSIDE GET EVENTS', periods);

    const fromDate = periods[0].date.toISOString();
    const toDate = periods[periods.length - 1].date.toISOString();

    this.scheduledEventService
      .getEventsFromPeriod(fromDate, toDate)
      .subscribe((appointments: IScheduledEvent[]) => {
        this._monthDays.update(() => {
          return periods.map((day) => {
            day.events = appointments.filter((appointment) =>
              this.compareDates(appointment.currentDate, day.date)
            );
            return day;
          });
        });
        this.updateDaysInLocalStore(this._monthDays());
      });
  }

  createEventForParticularDate(event: IScheduledEvent): void {
    this.scheduledEventService.addEvent(event).subscribe((event) => {
      this.updateEventListForSelectedDay(event);
      this.updateEventsInCurrentMonth(event);
      this.updateStore();
    });
  }

  updateScheduledEvent(event: IScheduledEvent): void {
    console.log(event);
    this.scheduledEventService
      .updateEventById(event.id, event)
      .pipe(
        catchError((err) => {
          this.showNotification(`Error occurs: ${err.message}`);
          return throwError(err);
        })
      )
      .subscribe((event) => {
        this.updateEventListForSelectedDay(event);
        this.updateEventsInCurrentMonth(event);
        this.updateStore();
        console.log('MONTH DAYS: ', this._monthDays());
        this.showNotification('The appointment was rescheduled successfully');
      });
  }

  updateEventListForSelectedDay(event: IScheduledEvent): void {
    // const indexOfExistedEvent = this.findIndexEventForCurrentTime(event.id);
    const eventsList = this.selectedDay().events.filter(
      (ev: IScheduledEvent) => ev.id !== event.id
    );
    // if (indexOfExistedEvent > -1) {
    //   eventsList = this.selectedDay().events.filter((ev: ScheduledEvent) => ev.id !== event.id);
    // } else {
    //   eventsList = this.selectedDay().events;
    // }
    debugger;
    this._selectedDay.set(
      this.createDayInstance(
        this._selectedDay().date,
        [...eventsList, event],
        this._selectedDay().isCurrentMonth,
        this._selectedDay().markedAsImportant
      )
    );
  }

  deleteEventFromStore(eventId: string): Observable<boolean> {
    const indexOfExistedEvent = this.findIndexEventForCurrentTime(eventId);
    return new Observable((subscriber) => {
      if (indexOfExistedEvent > -1) {
        this.selectedDay().events.splice(indexOfExistedEvent, 1);
        this.updateStore();
        //this.getSelectedDay$.next(this._selectedDay());
        subscriber.next(true);
      }
      subscriber.next(false);
      subscriber.complete();
    });
  }

  getDetailsForImportantDate(): Date {
    return createDateInstance(this._selectedDay().date);
  }

  setDayAsImportant(): void {
    // Sending updated data to server
    this.selectedDay().markedAsImportant = true;
    this.updateStore();
  }

  //////////////////////////////////////////////////////////////////////////////////
  // *  LOCAL STORAGE                                                            *//
  //////////////////////////////////////////////////////////////////////////////////

  private setActiveDateToStorage(currentDate: Date): void {
    this.storageService.setItemToLocalStorage(
      this.LAST_VIEWED_DATE,
      JSON.stringify(currentDate)
    );
  }

  private updateDaysInLocalStore(days: IDay[]) {
    this.storageService.updateStore(days);
  }

  private updateStore() {
    const { date, events, isCurrentMonth, markedAsImportant } =
      this.selectedDay();
    const dayModel: IDay = this.createDayInstance(
      date,
      events,
      isCurrentMonth,
      markedAsImportant
    );
    this.updateDaysInLocalStore([dayModel]);
  }

  getEventsByDate(dateInMilliseconds: number): IScheduledEvent[] {
    const resetDateHours = createDateInstance(dateInMilliseconds).setHours(
      0,
      0,
      0,
      0
    );
    const storedEventsStr = this.storageService.getCalendarEvents() || null;
    if (storedEventsStr) {
      const storedEvents = storedEventsStr;
      const eventsForDay = storedEvents[resetDateHours] || [];
      return eventsForDay.events || [];
    }
    return [];
  }

  //////////////////////////////////////////////////////////////////////////////////
  // *  HELPERS                                                                  *//
  //////////////////////////////////////////////////////////////////////////////////

  private compareDates(dateString: Date, dateObject: Date): boolean {
    // Format both dates to 'yyyy-MM-dd'
    const formattedDateString = this.datePipe.transform(
      dateString,
      'yyyy-MM-dd'
    );
    const formattedDateObject = this.datePipe.transform(
      dateObject,
      'yyyy-MM-dd'
    );
    return formattedDateString === formattedDateObject;
  }

  private setAppropriateMonth(date: Date): void {
    this._activeMonth.set(new Month(date));
    const monthDays = this.buildDaysOfMonth();
    this.getAppointmentsForPeriod(monthDays);
  }

  private getSelectedDayByIndex(index: number): IDay {
    this.selectedDayIndex = index;
    return this._monthDays()[this.selectedDayIndex || 1];
  }

  private pushDayToMonth(
    day: Date,
    monthContainer: IDay[],
    isCurrentMonth = true
  ): void {
    const events = this.getEventsByDate(day.getTime());
    monthContainer.push(this.createDayInstance(day, events, isCurrentMonth));
  }

  private findIndexEventForCurrentTime(eventId: string): number {
    return this.selectedDay().events.findIndex((ev) => ev.id === eventId);
  }

  private createDayInstance(
    date: Date,
    events: IScheduledEvent[],
    isCurrentMonth: boolean,
    markedAsImportant?: boolean
  ): IDay {
    return DayFactory(date, events, isCurrentMonth, markedAsImportant);
  }

  private showNotification(content: string): void {
    this.notificationService.openSnackBar(content);
  }

  private updateEventsInCurrentMonth(event: IScheduledEvent) {
    this._monthDays.update((monthDays) =>
      monthDays.map((day: IDay) => {
        if (day.date === event.currentDate) {
          const eventsList: IScheduledEvent[] = day.events.filter(
            (dayEvent: IScheduledEvent) => dayEvent.id !== event.id
          );
          return <Day>{ ...day, events: [...eventsList, event] };
        } else {
          return day;
        }
      })
    );
  }
}
