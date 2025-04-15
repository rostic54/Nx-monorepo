import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  SessionService,
  UserAPIService,
} from '@angular-monorepo/services-calendar';
import { IUserInfo } from '@angular-monorepo/types-calendar';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const userService = inject(UserAPIService);

  if (!sessionService.isUserLoggedIn()) {
    return userService.getUser().pipe(
      map((user: IUserInfo) => {
        sessionService.setLoggedUser(user);
        router.createUrlTree(['/auth/login']);

        return !!user;
      })
    );
  }
  return true;
};
