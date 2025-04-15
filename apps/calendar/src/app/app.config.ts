import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { DatePipe } from '@angular/common';
import { AuthCalendarInterceptor } from '@angular-monorepo/atm-interceptors';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    DatePipe,
    provideHttpClient(),
    provideHttpClient(withInterceptors([AuthCalendarInterceptor])),
  ],
};
