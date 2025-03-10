import { Injectable } from '@angular/core';

import {
  catchError,
  concatMap,
  delay,
  from,
  Observable,
  of,
  sequenceEqual,
} from "rxjs";
import {SessionService} from "./session.service";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class PinCodeService {
  private CODE = [...new Date().getFullYear().toString()];
  private readonly RESPONSE_TIME_IMITATION = 2000;


  constructor(private sessionService: SessionService, private notificationService: NotificationService) { }

  sendPinCodeForAudit(code: string[]): Observable<boolean>  {
    return from(code)
      .pipe(
        // RESPONSE IMITATION
        delay(this.RESPONSE_TIME_IMITATION),
        sequenceEqual(from(this.CODE)),
        concatMap( (isPinCorrect: boolean): Observable<boolean> => {
          if (isPinCorrect) {
            return this.sessionService.getToken();
          }
          throw new Error('Wrong pin')
        }),
        catchError(err => {
          this.notificationService.errorToast(err);
          return of(false)
        })

      )
  }
}
