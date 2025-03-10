import { InjectionToken } from '@angular/core';

export const APP_CONSTATNTS = new InjectionToken<AppList>('app-list.constants');
export const APP_HOST_CONFIG = new InjectionToken<AppHostConfig>('app-host.config');

export interface AppList {
  label: string;
  value: string;
  description: string;
  imageSrc: string;
}

export const AppList = [
  {
    label: 'ATM',
    value: 'atm',
    description: 'App for withdrawing & payment',
    imageSrc: 'assets/images/atm_preview.png',
  },
  {
    label: 'Calendar',
    value: 'calendar',
    description: 'App for schedule an appointment',
    imageSrc: 'assets/images/calendar_preview.png',
  },
];

export interface AppHostConfig {
  appName: string;
  apiUrl: string;
}

export const AppLocalhostConfig: AppHostConfig[] = [
  {
    appName: 'atm',
    apiUrl: 'http://localhost:4201/atm',
  },
  {
    appName: 'calendar',
    apiUrl: 'http://localhost:4202/calendar',
  },
];
