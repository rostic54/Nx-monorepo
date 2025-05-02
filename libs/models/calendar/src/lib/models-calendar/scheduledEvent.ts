import {createDateInstance} from "@angular-monorepo/utils-calendar";
import {IScheduledEvent, RequestScheduledEvent} from "@angular-monorepo/types-calendar";

export class ScheduledEvent implements IScheduledEvent {
  id: string;
  currentDate: Date;
  content: string;
  otherAttendees: number;
  ownerId: string;
  attendees: string[];
  editable: boolean;

  constructor(config: {
    date: Date, 
    content: string,
    editable?: boolean, 
    id: string, 
    attendees: string[],
    ownerId: string
  }) {
    this.id = config.id;
    this.currentDate = config.date;
    this.content = config.content;
    this.editable = config.editable || false;
    this.ownerId = config.ownerId;
    this.attendees = config.attendees || [];
    this.otherAttendees = config.attendees.length;
  }

  get year(): number {
    return this.currentDate.getFullYear();
  }

  get month(): number {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    return this.currentDate.getMonth();
  }

  get dateHour(): number {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    return this.currentDate.getHours();
  }

  get dateMinutes(): number {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    return this.currentDate.getMinutes();
  }

  get preciseTime(): string {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    const hours = String(this.dateHour).padStart(2, '0');
    const minutes = String(this.dateMinutes).padStart(2, '0');
    return `${hours}:${minutes}`
  }

  get requestDate(): RequestScheduledEvent {
    return {
      currentDate: this.currentDate,
      content: this.content,
      editable: this.editable,
      ownerId: this.ownerId,
      otherAttendees: this.otherAttendees,
      attendees: this.attendees,
    }
  }

  private convertStringToDate(date: string) {
    this.currentDate = createDateInstance(date);
  }

}
