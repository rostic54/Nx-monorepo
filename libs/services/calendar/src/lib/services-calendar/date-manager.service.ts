import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { Day } from '@angular-monorepo/models-calendar';
import {
  createDateInstance,
  createDateWithSpecifiedMonthDay,
  daysInMonth,
  mergeDateAndTime,
} from '@angular-monorepo/utils-calendar';
import { DAYS_IN_MONTH_VIEW } from '@angular-monorepo/constants';
import { Month } from '@angular-monorepo/models-calendar';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { DayFactory } from '@angular-monorepo/factories-calendar';
import { DatePipe } from '@angular/common';
import { ScheduledEventAPIService } from './scheduled-event.service';
import {
  IDay,
  IDragAndDropEventDetails,
  INewScheduledEvent,
  IScheduledEvent,
} from '@angular-monorepo/types-calendar';
import { NotificationService } from './notification.service';

// TODO: Next Steps:
// - Add User Authorization page (SignIn, SignUp) - DONE
// - Add User Profile page (Show/edit User info, Change password)
// - Add list of users for group events - DONE
// - Make optimization by using available events from local storage
// - Add refresh local storage (Maybe add refresh button and keep version for user)

// BUGS:
// - Update event in local storage when deleting attendees from event


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
    private scheduledEventAPIService: ScheduledEventAPIService,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {
    const storedDate = this.storageService.getItemFromLocalStorage(
      this.LAST_VIEWED_DATE
    );
    if (storedDate.length) {
      this.initCurrentDate(storedDate);
    }
    this.setAppropriateMonth(this._currentDate());
    effect(() => {
      if (this._currentDate()) {
        this.setActiveDateToStorage(this._currentDate());
      }
    });
  }

  changeDate(date: Date, init = false): void {
    console.log('CHANGE DAY INIT:', init);
    if (this.isNotEqualToCurrentDate(date) || init) {
      this._currentDate.set(date);
      this.setAppropriateMonth(date);
    }
  }

  setSelectedDay(index: number): void {
    const selectedDay = this.getSelectedDayByIndex(index);
    this._selectedDay.set(selectedDay);
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
  // *  ACTIONS
  //////////////////////////////////////////////////////////////////////////////////
  setSelectedDayFromTemplate(day: IDay): void {
    this._selectedDay.set(day);
  }

  createOrUpdateScheduledEvent(eventDetails: IScheduledEvent): void {
    if (eventDetails.id.length > 0) {
      this.updateScheduledEvent(eventDetails);
    } else {
      const { id, ...rest } = eventDetails;
      const newEvent: INewScheduledEvent = { ...rest };
      this.createEventForParticularDate(newEvent);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  // *  REQUESTS
  //////////////////////////////////////////////////////////////////////////////////

  updateStoragesAfterDroppingEvent(
    dropDetails: IDragAndDropEventDetails
  ): void {
    // TODO: Update date in DB
    const { fromDay, toDay } = dropDetails;
    const { id, content, editable, currentDate, attendees, ownerId } =
      dropDetails.eventDetails;

    const scheduledEvent = new ScheduledEvent({
      date: mergeDateAndTime(toDay.date, currentDate),
      content,
      editable,
      id,
      attendees,
      ownerId
    });
    this.scheduledEventAPIService
      .updateEventById(dropDetails.eventDetails.id, scheduledEvent)
      .subscribe((event) => {
        this.updateEventListForSelectedDay(event);
        this.updateEventsInCurrentMonth(event);
        this.updateDaysInLocalStore([fromDay, toDay]);
      });
  }

  createEventForParticularDate(event: INewScheduledEvent): void {
    this.scheduledEventAPIService.addEvent(event).subscribe((event) => {
      this.updateEventListForSelectedDay(event);
      this.updateEventsInCurrentMonth(event);
      this.updateStoreWithDayCreation();
    });
  }

  getEventsForSelectedDay(
    fromDate: Date,
    toDate: Date
  ): Observable<IScheduledEvent[]> {
    return this.scheduledEventAPIService
      .getEventsFromPeriod(fromDate.toISOString(), toDate.toISOString())
      .pipe(
        tap((events: IScheduledEvent[]) => {
          this._currentDate.set(fromDate);
          const dayTemplate = DayFactory(fromDate, events);
          this._selectedDay.set(dayTemplate);
          // this.initCurrentDate(date);
        })
      );
  }

  updateScheduledEvent(event: IScheduledEvent): void {
    this.scheduledEventAPIService
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
        this.updateStoreWithDayCreation();
        this.showNotification('The appointment was rescheduled successfully');
      });
  }

  deleteEventFromStore(eventId: string): Observable<boolean> {
    const deletedEvent = this.selectedDay().events.find(
      (ev) => ev.id === eventId
    );
    return this.scheduledEventAPIService.deleteEventById(eventId).pipe(
      tap((isDeleted: boolean) => {
        if (deletedEvent && isDeleted) {
          this.updateEventListForSelectedDay(deletedEvent, true);
          this.updateEventsInCurrentMonth(deletedEvent, true);
          this.updateStoreWithDayCreation();
        }
      })
    );
  }

  getDetailsForImportantDate(): Date {
    return createDateInstance(this._selectedDay().date);
  }

  setDayAsImportant(): void {
    // Sending updated data to server
    this.selectedDay().markedAsImportant = true;
    this.updateStoreWithDayCreation();
  }

  private getAppointmentsForPeriod(periods: Day[]): void {
    const fromDate = periods[0].date.toISOString();
    const toDate = periods[periods.length - 1].date.toISOString();

    this.scheduledEventAPIService
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

  //////////////////////////////////////////////////////////////////////////////////
  // *  LOCAL STORAGE
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

  private updateStoreWithDayCreation() {
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
      return storedEventsStr[resetDateHours]?.events || [];
    }
    return [];
  }

  //////////////////////////////////////////////////////////////////////////////////
  // *  HELPERS
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

  initCurrentDate(currentDate: string): void {
    const date = new Date(JSON.parse(currentDate));
    this._currentDate.set(date);
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

  private updateEventListForSelectedDay(
    event: IScheduledEvent,
    isDeleted = false
  ): void {
    const eventsList = this.selectedDay().events.filter(
      (ev: IScheduledEvent) => ev.id !== event.id
    );
    const updatedEventsList = isDeleted
      ? [...eventsList]
      : [...eventsList, event];

    this._selectedDay.set(
      this.createDayInstance(
        this._selectedDay().date,
        updatedEventsList,
        this._selectedDay().isCurrentMonth,
        this._selectedDay().markedAsImportant
      )
    );
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

  private updateEventsInCurrentMonth(
    event: IScheduledEvent,
    isDeleted = false
  ): void {
    this._monthDays.update((monthDays) => {
      const res = monthDays.map((day: IDay) => {
        if (this.compareDates(day.date, event.currentDate)) {
          const eventsList: IScheduledEvent[] = day.events.filter(
            (dayEvent: IScheduledEvent) => dayEvent.id !== event.id
          );
          const updatedEventsList = isDeleted
            ? [...eventsList]
            : [...eventsList, event];

          return DayFactory(
            day.date,
            updatedEventsList,
            day.isCurrentMonth,
            day.markedAsImportant
          );
        } else {
          return day;
        }
      });
      return res;
    });
  }
}
