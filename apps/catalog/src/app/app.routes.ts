
import { Route } from '@angular/router';
import { AppComponent } from './app.component';
// import { loadRemoteModule } from '@angular-architects/module-federation';
import { loadRemoteModule } from '@nx/angular/mf';

// export const appRoutes: Route[] = [
//   {
//     path: '',
//     component: AppComponent,
//   },
//   {
//     path: 'atm',
//     loadComponent: () => import('atm/Component').then(m => m.AppComponent),
//   },
//   {
//     path: 'calendar',
//     loadComponent: () => import('calendar/Component').then(m => m.AppComponent),
//   },
// ];


export const appRoutes: Route[] = [
  {
    path: '',
    component: AppComponent,
  },
  // {
  //   path: 'calendar',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       remoteName: 'calendar',
  //       remoteEntry: 'http://localhost:4202/remoteEntry.mjs',
  //       exposedModule: './Routes',
  //     }).then((m) => m.appRoutes), // Assuming remote exposes `remoteRoutes`
  // },
  {
    path: 'calendar',
    loadChildren: () =>
      loadRemoteModule('calendar','./Routes').then((m) => m.appRoutes), // Assuming remote exposes `remoteRoutes`
  },
  // {
  //   path: 'atm',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       remoteName: 'atm',
  //       remoteEntry: 'http://localhost:4201/remoteEntry.mjs',
  //       exposedModule: './Routes',
  //     }).then((m) => m.appRoutes), // Assuming remote exposes `remoteRoutes`
  // },
  {
    path: 'atm',
    loadChildren: () =>
      loadRemoteModule( 'atm', './Routes').then((m) => m.appRoutes), // Assuming remote exposes `remoteRoutes`
  },
  
  {
    path: '**',
    redirectTo: '',
  },
];