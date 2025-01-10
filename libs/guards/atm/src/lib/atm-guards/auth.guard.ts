import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SessionService} from "@angular-monorepo/services-atm";

export const authGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if(!sessionService.isSessionActive()) {
    return router.createUrlTree(['/pin'])
  }
  return true;
};
