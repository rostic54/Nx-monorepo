import {HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TokenStorageService} from "@angular-monorepo/services-atm";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private tokenService: TokenStorageService) {
//   }

//   intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const authToken = this.tokenService.getToken();

//     if(authToken) {
//       const authReq: HttpRequest<unknown> = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${authToken}`
//         }
//       });
//       return next.handle(authReq);
//     }
//     return next.handle(req);
//   }
// }

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
