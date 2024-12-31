import {ScheduledEvent} from "./scheduledEvent";

export class HoursModel {
  timeNumber: number;
  events: ScheduledEvent[]

  constructor(hour: number, event: ScheduledEvent[]) {
    this.timeNumber = hour;
    this.events = event;
  }
}
