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
  ownerId: string;
  currentDate: Date;
  content: string;
  editable: boolean;
  attendees: string[];
  otherAttendees: number;
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

export interface IUserInfo {
  id: string;
  userName: string;
  email: string;
  avatarUrl: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser extends ILoginUser {
  userName: string;
}

export interface ILoginResponse {
  message: string;
}
