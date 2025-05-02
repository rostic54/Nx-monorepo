import { Injectable } from '@angular/core';
import { ScheduledEvent } from '@angular-monorepo/models-calendar';
import { BehaviorSubject, Observable } from 'rxjs';
import { scheduledEventFactory } from '@angular-monorepo/factories-calendar';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import {
  INewScheduledEvent,
  IScheduledEvent,
  RequestScheduledEvent,
} from '@angular-monorepo/types-calendar';

@Injectable({
  providedIn: 'root',
})
export class ScheduledEventAPIService {
  
  constructor(private httpService: HttpService) {}

  getEventsFromPeriod(
    fromDate: string,
    toDate: string
  ): Observable<IScheduledEvent[]> {
    const params = new HttpParams({ fromObject: { fromDate, toDate } });

    return this.httpService.get('/appointments/byDate', true, params);
  }

  addEvent(event: INewScheduledEvent): Observable<IScheduledEvent> {
    return this.httpService.post<INewScheduledEvent, IScheduledEvent>(
      '/appointments',
      event
    );
  }

  getEventDetails(id: string): Observable<IScheduledEvent> {
    return this.httpService.get<IScheduledEvent>(`/appointments/${id}`);
  }

  updateEventById(
    id: string,
    event: IScheduledEvent
  ): Observable<IScheduledEvent> {
    return this.httpService.put<RequestScheduledEvent, IScheduledEvent>(
      `/appointments/${id}`,
      event.requestDate
    );
  }

  deleteEventById(id: string): Observable<boolean> {
    return this.httpService.delete(`/appointments/${id}`);
  }
}
