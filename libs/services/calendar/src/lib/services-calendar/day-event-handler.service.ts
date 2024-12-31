import {Injectable} from '@angular/core';
import {ScheduledEvent} from "@angular-monorepo/models-calendar";
import {BehaviorSubject, Observable} from "rxjs";
import {scheduledEventFactory} from "@angular-monorepo/factories-calendar";

@Injectable()
export class DayEventHandlerService {
  private _selectedEventForEdit: BehaviorSubject<ScheduledEvent | null> = new BehaviorSubject<ScheduledEvent | null>(null)

  get selectedEvent(): Observable<ScheduledEvent | null> {
    return this._selectedEventForEdit.asObservable();
  }

  setEventForEdit({currentDate, content, editable, id}: ScheduledEvent): void {
    this._selectedEventForEdit.next(scheduledEventFactory(currentDate, content, editable, id));
  }

}
