import { DashboardComponent } from '@angular-monorepo/dashboard';
import { authGuard } from '@angular-monorepo/atm-guards';
import { Route } from '@angular/router';
import { PincodeComponent } from '@angular-monorepo/pincode';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'pincode',
         pathMatch: 'full',
    },
    {
        path: 'pincode',
        pathMatch: 'full',
        component: PincodeComponent
        // loadComponent: () => import('@angular-monorepo/pincode').then(m => m.PincodeComponent)
    },
    {
        path: 'dashboard',
        // pathMatch: 'full',
        // canActivate: [authGuard],
        component: DashboardComponent
        // loadComponent: () => import('@angular-monorepo/dashboard').then(m => m.DashboardComponent)
    },
];
