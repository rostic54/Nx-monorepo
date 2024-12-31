import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {ScheduledEvent} from "@angular-monorepo/models-calendar";
import {Day} from "@angular-monorepo/models-calendar";
import {createDateInstance, createDateWithSpecifiedMonthDay, daysInMonth} from "@angular-monorepo/utils-calendar";
import {DAYS_IN_MONTH_VIEW} from "@angular-monorepo/constants";
import {Month} from "@angular-monorepo/models-calendar";
import {BehaviorSubject, Observable} from "rxjs";
import {DayFactory} from "@angular-monorepo/factories-calendar";

@Injectable({
  providedIn: 'root'
})
export class DateManagerService {
  private readonly LAST_VIEWED_DATE = 'lastViewedDate'
  private _currentDate = signal(new Date());
  private _monthDays: WritableSignal<Day[]> = signal([]);
  private _activeMonth: WritableSignal<Month> = signal(new Month(this._currentDate()));
  private _selectedDay: WritableSignal<Day> = signal(new Day(new Date(), []));
  private _daySelectionMode: WritableSignal<boolean> = signal(false);
  getSelectedDay$: BehaviorSubject<Day> = new BehaviorSubject(new Day(new Date(), []));
  selectedDayIndex!: number;

  constructor(private httpService: LocalStorageService) {
    const storedDate = this.httpService.getItemFromLocalStorage(this.LAST_VIEWED_DATE);
    if (storedDate.length) {
      const date = new Date(JSON.parse(storedDate));
      this._currentDate.set(date);
      this.setAppropriateMonth(date);
    }
    effect(() => {
      if (this._currentDate()) {
        this.saveViewedDate(this._currentDate())
        return this._currentDate();
      } else {
        return new Date();
      }
    })
  }

  get currentDate(): Signal<Date> {
    return this._currentDate.asReadonly()
  }

  get days(): Signal<Day[]> {
    return this._monthDays.asReadonly()
  }

  get activeMonth(): Signal<Month> {
    return this._activeMonth.asReadonly();
  }

  get selectedDay(): Signal<Day> {
    return this._selectedDay.asReadonly();
  }

  get isSelectionModeActive(): Signal<boolean> {
    return this._daySelectionMode.asReadonly();
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
  }

  toggleSelectionMode(): void {
    this._daySelectionMode.set(!this._daySelectionMode());
    console.log(this._daySelectionMode());
  }

  saveViewedDate(currentDate: Date): void {
    this.httpService.setItemToLocalStorage(this.LAST_VIEWED_DATE, JSON.stringify(currentDate))
  }

  isNotEqualToCurrentDate(date: Date): boolean {
    return date.getFullYear() !== this._currentDate().getFullYear() || date.getMonth() !== this._currentDate().getMonth()
  }

  buildDaysOfMonth(): Day[] {
    const startsFrom = this._activeMonth().firstDay;
    const lastDayOfPreviousMonth = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 0);
    const daysInCurrentMonth = daysInMonth(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1);
    const takeDaysFromNextMonth = DAYS_IN_MONTH_VIEW - (startsFrom - 1 + daysInCurrentMonth);
    const displayMonth: Day[] = [];
    if (startsFrom !== 0) {
      for (let i = startsFrom - 1; i > 0; i--) {
        const day = createDateInstance(lastDayOfPreviousMonth);
        day.setDate(lastDayOfPreviousMonth.getDate() - (i - 1));
        this.pushDayToMonth(day, displayMonth, false);
      }
    }

    for (let i = 0; i < daysInCurrentMonth; i++) {
      const day = createDateWithSpecifiedMonthDay(this.currentDate().getFullYear(), this.currentDate().getMonth(), i + 1);
      this.pushDayToMonth(day, displayMonth);
    }

    if (takeDaysFromNextMonth > 0) {
      const firstDayOfNextMonth = createDateWithSpecifiedMonthDay(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1, 1);
      for (let i = 0; i <= takeDaysFromNextMonth % 7; i++) {
        const day = createDateInstance(firstDayOfNextMonth);
        day.setDate(firstDayOfNextMonth.getDate() + i);
        this.pushDayToMonth(day, displayMonth, false);
      }
    }
    return displayMonth;
  }

  getEventsByDate(dateInMilliseconds: number): ScheduledEvent[] {
    const resetDateHours = createDateInstance(dateInMilliseconds).setHours(0, 0, 0, 0);
    const storedEventsStr = this.httpService.getCalendarEvents() || null;
    if (storedEventsStr) {
      const storedEvents = storedEventsStr;
      const eventsForDay = storedEvents[resetDateHours] || [];
      return eventsForDay.events || []
    }
    return []
  }

  updateDaysInStore(days: Day[]) {
    this.httpService.updateStore(days);
  }

  setAppropriateMonth(date: Date): void {
    this._activeMonth.set(new Month(date));
    this._monthDays.set(this.buildDaysOfMonth());
  }

  createEventForParticularDate(event: ScheduledEvent): void {
    const indexOfExistedEvent = this.findIndexEventForCurrentTime(event.id);
    if (indexOfExistedEvent > -1) {
      this.selectedDay().events.splice(indexOfExistedEvent, 1, event);
    } else {
      this.selectedDay().events = [...this.selectedDay().events, ...[event]];
    }
    this.updateStore()
    this.getSelectedDay$.next(this._selectedDay());
  }

  deleteEventFromStore(eventId: number): Observable<boolean> {
    const indexOfExistedEvent = this.findIndexEventForCurrentTime(eventId);
    return new Observable(subscriber => {
      if (indexOfExistedEvent > -1) {
        this.selectedDay().events.splice(indexOfExistedEvent, 1);
        this.updateStore()
        this.getSelectedDay$.next(this._selectedDay());
        subscriber.next(true);
      }
      subscriber.next(false);
      subscriber.complete();
    })
  }

  getDetailsForImportantDate(): Date {
    return createDateInstance(this._selectedDay().date);
  }

  setDayAsImportant(): void {
    // Sending updated data to server
    this.selectedDay().markedAsImportant = true;
    this.updateStore();
  }

  private getSelectedDayByIndex(index: number): Day {
    this.selectedDayIndex = index;
    return this._monthDays()[this.selectedDayIndex || 1];
  }

  private pushDayToMonth(day: Date, monthContainer: Day[], isCurrentMonth = true): void {
    const events = this.getEventsByDate(day.getTime());
    monthContainer.push(this.createDayInstance(day, events, isCurrentMonth));
  }

  private updateStore() {
    const {date, events, isCurrentMonth, markedAsImportant} = this.selectedDay();
    const dayModel: Day = this.createDayInstance(date, events, isCurrentMonth, markedAsImportant);
    this.updateDaysInStore([dayModel]);
  }

  private findIndexEventForCurrentTime(eventId: number): number {
    return this.selectedDay().events.findIndex(ev => ev.id === eventId);
  }

  private createDayInstance(date: Date, events: ScheduledEvent[], isCurrentMonth: boolean, markedAsImportant?: boolean): Day {
    return DayFactory(date, events, isCurrentMonth, markedAsImportant)
  }

}
