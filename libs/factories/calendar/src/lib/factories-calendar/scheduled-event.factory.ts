import {ScheduledEvent} from "@angular-monorepo/models-calendar";


export function scheduledEventFactory(date: Date, content?: string, isEditable?: boolean, id = ''): ScheduledEvent {
  return new ScheduledEvent(date, content || '', isEditable, id);
}
