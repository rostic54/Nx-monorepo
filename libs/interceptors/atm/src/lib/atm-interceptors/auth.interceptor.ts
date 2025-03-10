import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {TokenStorageService} from "@angular-monorepo/services-atm";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
    const authToken = inject(TokenStorageService).getToken();

    if(authToken) {
      const authReq: HttpRequest<unknown> = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next(authReq);
    }
    return next(req);
};
