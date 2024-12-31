import {ScheduledEvent} from "./scheduledEvent";

export class Day {
  date: Date;
  events: ScheduledEvent[];
  isCurrentMonth: boolean;
  markedAsImportant: boolean;

  constructor(date: Date, events: ScheduledEvent[], currentMonth = true, markedAsImportant = false) {
    this.date = date;
    this.events = events;
    this.isCurrentMonth = currentMonth;
    this.markedAsImportant = markedAsImportant;
  }

  get currentDate(): number {
    return this.date.getDate();
  }

}
