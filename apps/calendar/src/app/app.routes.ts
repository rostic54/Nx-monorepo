
import {
  DayDetailsCalendarComponent,
  GeneralDayInfoComponent,
  SpecificHourComponent
} from '@angular-monorepo/day-details-calendar';
import { Routes } from '@angular/router';
import { AgendaComponent } from '@angular-monorepo/agenda';
import { currentDateInitResolver } from './current-date-init.resolver';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    pathMatch: 'full',
    component: AgendaComponent

  },
  {
    path: 'day/:date',
    component: DayDetailsCalendarComponent,
    resolve: {
      currentDateInitResolver
    },
    children: [
      { path: 'edit', component: GeneralDayInfoComponent },
      { path: 'create/:id', component: SpecificHourComponent },
      { path: '', pathMatch: 'full', redirectTo: 'edit' },
    ],
  },
  // {
  //     path: 'day',
  //     pathMatch: 'full',
  //     loadChildren: () => import('@angular-monorepo/day-details-calendar').then(m => m.DAY_DETAILS_ROUTES)
  // }
];
