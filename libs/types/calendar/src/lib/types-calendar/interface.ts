export interface Information {
  info: string;
}

export interface IDay {
  events: IScheduledEvent[];
  isCurrentMonth: boolean;
  markedAsImportant: boolean;
  get date(): Date;
  get currentDate(): number;
}

export interface IEventDialogData {
  appointment: IScheduledEvent;
  permissionDelete: IDeletePermissions;
}

export interface IDeletePermissions {
  isAllowed: boolean;
}

export interface IScheduledEvent {
  id: string;
  currentDate: Date;
  content: string;
  editable: boolean;
  preciseTime?: string;
  get requestDate(): RequestScheduledEvent;
  get dateMinutes(): number;
}

export type INewScheduledEvent = Omit<IScheduledEvent, 'id'>; 

export type RequestScheduledEvent = Omit<
  IScheduledEvent,
  'id' | 'requestDate' | 'dateMinutes'
>;

export interface IDragAndDropEventDetails {
  fromDay: IDay;
  toDay: IDay;
  eventDetails: IScheduledEvent;
}
