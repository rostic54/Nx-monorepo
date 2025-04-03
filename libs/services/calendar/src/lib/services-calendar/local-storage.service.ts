import { Injectable } from '@angular/core';
import { Day } from '@angular-monorepo/models-calendar';
import { BehaviorSubject } from 'rxjs';
import { scheduledEventFactory } from '@angular-monorepo/factories-calendar';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { DayFactory } from '@angular-monorepo/factories-calendar';
import { createDateInstance } from '@angular-monorepo/utils-calendar';
import { IDay } from '@angular-monorepo/types-calendar';

export interface ICalendar {
  [key: string]: IDay
}
export interface IStorageCalendar {
  [key: string]: {
    dateValue: string;
    events: ScheduledEvent[];
    isCurrentMonth: boolean;
    markedAsImportant: boolean;
  };
}

const calendar: ICalendar = {};

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private calendarStoredData$: BehaviorSubject<ICalendar> = new BehaviorSubject(
    calendar
  );
  private readonly STORE_NAME_V2 = 'calendarEvents_2';

  constructor() {
    const calendarDataInStorage = this.getItemFromLocalStorage(
      this.STORE_NAME_V2
    );
    this.calendarStoredData$.subscribe((calendarData) =>
      this.setItemToLocalStorage(
        this.STORE_NAME_V2,
        JSON.stringify(calendarData)
      )
    );
    if (calendarDataInStorage?.length) {
      // It's just an imitation of store, that's why need to make all manipulations above.
      const storedCalendarValue: IStorageCalendar = JSON.parse(calendarDataInStorage);
      const convertedCalendarData: ICalendar =
        this.convertStringsToModels(storedCalendarValue);

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

  updateStore(days: IDay[]): void {
    const calendarStore = this.calendarStoredData$.value;
    console.log('DAYS IN UPDATE STORE', days);
    console.log('CALENDAR STORE', calendarStore);
    days.forEach((day: IDay) => {
      if(!day.events.length) {
        return;
      }
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
    });
    this.calendarStoredData$.next(calendarStore);
  }

  private convertStringsToModels(storedCalendarValue: IStorageCalendar): ICalendar {
    const calendarValues: ICalendar = {};
    for (const dayInfo in storedCalendarValue) {
      const regeneratedEvents = storedCalendarValue[dayInfo].events.map(
        ({ currentDate, content, editable, id }: ScheduledEvent) =>
          scheduledEventFactory(
            createDateInstance(currentDate),
            content,
            editable,
            id
          )
      );
      calendarValues[dayInfo] = DayFactory(
        createDateInstance(storedCalendarValue[dayInfo].dateValue),
        regeneratedEvents,
        storedCalendarValue[dayInfo].isCurrentMonth
      );
    }

    return calendarValues;
  }
}
