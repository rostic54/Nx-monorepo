import {
  DayDetailsCalendarComponent,
  GeneralDayInfoComponent,
  SpecificHourComponent,
} from '@angular-monorepo/day-details-calendar';
import { Routes } from '@angular/router';
import { AgendaComponent } from '@angular-monorepo/agenda';
import { AuthComponent, SignInComponent, SignUpComponent } from '@angular-monorepo/auth';
import { currentDateInitResolver } from './current-date-init.resolver';
import { AuthGuard } from '@angular-monorepo/auth-guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: AgendaComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {path: 'login', component: SignInComponent },
      {path: 'register', component: SignUpComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ]
  },
  {
    path: 'day/:date',
    component: DayDetailsCalendarComponent,
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    resolve: {
      currentDateInitResolver,
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
