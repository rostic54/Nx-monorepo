import { DayDetailsCalendarComponent, GeneralDayInfoComponent, SpecificHourComponent } from '@angular-monorepo/day-details-calendar';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'calendar',
         pathMatch: 'full',
    },
    {
        path: 'calendar',
        pathMatch: 'full',
        loadComponent: () => import('@angular-monorepo/agenda').then(m => m.AgendaComponent)
    },
    {
        path: 'day',
        component: DayDetailsCalendarComponent,
        children: [
            {path: 'edit', component: GeneralDayInfoComponent },
            {path: 'create/:id', component: SpecificHourComponent },
            {path: '', pathMatch: 'full', redirectTo: 'edit'},
        ]
      },
    // {
    //     path: 'day',
    //     pathMatch: 'full',
    //     loadChildren: () => import('@angular-monorepo/day-details-calendar').then(m => m.DAY_DETAILS_ROUTES)
    // }
];
