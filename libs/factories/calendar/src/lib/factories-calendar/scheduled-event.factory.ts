import {ScheduledEvent} from "@angular-monorepo/models-calendar";


export function scheduledEventFactory(config: {date: Date, content: string, editable: boolean, id: string, attendees: string[], ownerId: string }): ScheduledEvent {
  return new ScheduledEvent(config);
}
