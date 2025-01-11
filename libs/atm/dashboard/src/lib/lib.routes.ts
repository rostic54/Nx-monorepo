import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionService } from '@angular-monorepo/services-atm';
import { inject } from '@angular/core';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    canActivate: [() => inject(SessionService).isSessionActive],
    component: DashboardComponent,
  },
];
