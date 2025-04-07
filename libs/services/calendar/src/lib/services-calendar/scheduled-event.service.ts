import {Injectable} from '@angular/core';
import {ScheduledEvent} from "@angular-monorepo/models-calendar";
import {BehaviorSubject, Observable} from "rxjs";
import {scheduledEventFactory} from "@angular-monorepo/factories-calendar";
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { INewScheduledEvent, IScheduledEvent, RequestScheduledEvent } from '@angular-monorepo/types-calendar';

@Injectable({
  providedIn: 'root'
})
export class ScheduledEventAPIService {
  private _selectedEventForEdit: BehaviorSubject<ScheduledEvent | null> = new BehaviorSubject<ScheduledEvent | null>(null)

  get selectedEvent(): Observable<ScheduledEvent | null> {
    return this._selectedEventForEdit.asObservable();
  }

  constructor(private httpService: HttpService){
  }

  setEventForEdit({currentDate, content, editable, id}: ScheduledEvent): void {
    this._selectedEventForEdit.next(scheduledEventFactory(currentDate, content, editable, id));
  }

  getEventsFromPeriod(fromDate: string, toDate: string): Observable<IScheduledEvent[]> {
    const params = new HttpParams({ fromObject: { fromDate, toDate } });

    return this.httpService
      .get('/appointments/byDate', params);
  }

  addEvent(event: INewScheduledEvent): Observable<IScheduledEvent> {
    return this.httpService
      .post<INewScheduledEvent, IScheduledEvent>('/appointments', event);
  }

  updateEventById(id: string, event: IScheduledEvent): Observable<IScheduledEvent> {
    return this.httpService
      .put<RequestScheduledEvent, IScheduledEvent>(`/appointments/${id}`, event.requestDate);
  }
}
