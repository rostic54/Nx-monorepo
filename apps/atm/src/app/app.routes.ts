import { DashboardComponent } from '@angular-monorepo/dashboard';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'pincode',
         pathMatch: 'full',
    },
    {
        path: 'pincode',
        pathMatch: 'full',
        loadComponent: () => import('@angular-monorepo/pincode').then(m => m.PincodeComponent)
    },
    {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent
        // loadComponent: () => import('@angular-monorepo/dashboard').then(m => m.DashboardComponent)
    },
];
