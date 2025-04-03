import { IScheduledEvent } from "@angular-monorepo/types-calendar";

export class HoursModel {
  timeNumber: number;
  events: IScheduledEvent[]

  constructor(hour: number, event: IScheduledEvent[]) {
    this.timeNumber = hour;
    this.events = event;
  }
}
