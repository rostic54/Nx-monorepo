import {Injectable} from '@angular/core';
import {Day} from "@angular-monorepo/models-calendar";
import {BehaviorSubject} from "rxjs";
import {scheduledEventFactory} from "@angular-monorepo/factories-calendar";
import {ScheduledEvent} from "@angular-monorepo/models-calendar";
import {DayFactory} from "@angular-monorepo/factories-calendar";
import {createDateInstance, getBeginningOfDayInMilliseconds} from "@angular-monorepo/utils-calendar";

export interface ICalendar {
  [key: string]: Day
}

const calendar: ICalendar = {};

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private calendarStoredData$: BehaviorSubject<ICalendar> = new BehaviorSubject(calendar);
  private readonly STORE_NAME_V2 = 'calendarEvents_2'
  private readonly STORE_NAME = 'calendarEvents'

  constructor() {
    this.migration(this.STORE_NAME);
    const calendarDataInStorage = this.getItemFromLocalStorage(this.STORE_NAME_V2);
    this.calendarStoredData$
      .subscribe(calendarData => this.setItemToLocalStorage(this.STORE_NAME_V2, JSON.stringify(calendarData)))
    if (calendarDataInStorage?.length) {
      // It's just an imitation of store, that's why need to make all manipulations above.
      const storedCalendarValue: ICalendar = JSON.parse(calendarDataInStorage);
      const convertedCalendarData: ICalendar = this.convertStringsToModels(storedCalendarValue);

      this.calendarStoredData$.next(convertedCalendarData);
    }
  }

  setItemToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItemFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  getCalendarEvents() {
    return this.calendarStoredData$.value;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  updateStore(days: Day[]): void {
    const calendarStore = this.calendarStoredData$.value;
    days.forEach((day: Day) => {
      console.log('DAY IN STORE SAVER:', day);
      day.date.setHours(0, 0, 0, 0);
      // const searchableEvent = calendarStore[day.date.getTime()];
      // if (searchableEvent) {
      // //   if (day.events.length) {
      // //     searchableEvent.events = [...day.events];
      // //   } else {
      // //     delete calendarStore[day.date.getTime()];
      // //   }
      // // } else {
      // }
        calendarStore[day.date.getTime()] = day;
    })
    console.log('COLLECTED STORE: ', calendarStore);
    this.calendarStoredData$.next(calendarStore);
  }



  private convertStringsToModels(storedCalendarValue: ICalendar): ICalendar {
    for (const dayInfo in storedCalendarValue) {
      const regeneratedEvents = storedCalendarValue[dayInfo]
        .events.map(({
                       currentDate,
                       content,
                       editable,
                       id
                     }: ScheduledEvent) => scheduledEventFactory(createDateInstance(currentDate), content, editable, id))
      storedCalendarValue[dayInfo] = DayFactory(createDateInstance(storedCalendarValue[dayInfo].date), regeneratedEvents, storedCalendarValue[dayInfo].isCurrentMonth)
    }

    return storedCalendarValue;
  }

  private migration(keyForDelete: string) {
    if (localStorage.getItem(keyForDelete)) {
      localStorage.removeItem(keyForDelete)
    }
  }
}
