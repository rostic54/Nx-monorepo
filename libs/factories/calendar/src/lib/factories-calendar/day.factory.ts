import {Day} from "@angular-monorepo/models-calendar";
import {ScheduledEvent} from "@angular-monorepo/models-calendar";
import { IDay, IScheduledEvent } from "@angular-monorepo/types-calendar";


export function DayFactory(date: Date, scheduledEvents: IScheduledEvent[], currentMonth = true, markedAsImportant = false): IDay {
  return new Day(date, scheduledEvents, currentMonth, markedAsImportant)
}
