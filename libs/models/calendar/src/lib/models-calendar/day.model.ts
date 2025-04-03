import { IDay, IScheduledEvent } from '@angular-monorepo/types-calendar';
import { ScheduledEvent } from './scheduledEvent';

export class Day implements IDay {
  private dateValue: Date;
  events: IScheduledEvent[];
  isCurrentMonth: boolean;
  markedAsImportant: boolean;

  constructor(
    date: Date,
    events: IScheduledEvent[],
    currentMonth = true,
    markedAsImportant = false
  ) {
    this.dateValue = date;
    this.events = events;
    this.isCurrentMonth = currentMonth;
    this.markedAsImportant = markedAsImportant;
  }

  get currentDate(): number {
    return this.date.getDate();
  }

  get date(): Date {
    return new Date(this.dateValue);
  }
}
