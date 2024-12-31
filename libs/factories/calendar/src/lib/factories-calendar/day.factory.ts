import {Day} from "@angular-monorepo/models-calendar";
import {ScheduledEvent} from "@angular-monorepo/models-calendar";


export function DayFactory(date: Date, scheduledEvents: ScheduledEvent[], currentMonth = true, markedAsImportant = false): Day {
  return new Day(date, scheduledEvents, currentMonth, markedAsImportant)
}
