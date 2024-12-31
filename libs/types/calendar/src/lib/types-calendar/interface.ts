

export interface Information {
  info: string;
}

export interface IEventDialogData {
  appointment: IScheduledEvent,
  permissionDelete: IDeletePermissions
}

export interface IDeletePermissions {
  isAllowed: boolean
}

export interface IScheduledEvent {
  id: number,
  currentDate: Date;
  content: string;
  editable: boolean;
  preciseTime?: string
}