import {
  ActivatedRouteSnapshot,
  MaybeAsync,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { DateManagerService } from '@angular-monorepo/services-calendar';
import { Observable, of } from 'rxjs';
import { DayFactory } from '@angular-monorepo/factories-calendar';
import { IScheduledEvent } from '@angular-monorepo/types-calendar';

export const currentDateInitResolver: ResolveFn<
  Promise<UrlTree | Observable<boolean> | Observable<IScheduledEvent[]>>
> = async (route: ActivatedRouteSnapshot) => {
  const dateManagerService = inject(DateManagerService);
  const router = inject(Router);
  const dateStr = route.paramMap.get('date');
  console.log('dateStr', dateStr);
  if (!dateStr) {
    return router.parseUrl('');
  }

  if (
    dateManagerService.selectedDay().date.getTime() ===
    new Date(dateStr).getTime()
  ) {
    return of(true);
  } else {
    const date = new Date(dateStr);
    const eventsFromLocalStorage = dateManagerService.getEventsByDate(
      date.getTime()
    );

    if (eventsFromLocalStorage) {
      const dayTemplate = DayFactory(date, eventsFromLocalStorage);
      dateManagerService.setSelectedDayFromTemplate(dayTemplate);
      return of(true);
    }
    const endOfDay = new Date(date).setHours(23, 59);
    return dateManagerService.getEventsForSelectedDay(date, new Date(endOfDay));
  }
};
