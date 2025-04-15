import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { SessionService } from './session.service';
import { IUserInfo } from '@angular-monorepo/types-calendar';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAPIService {
  constructor(
    private httpService: HttpService,
    private sessionService: SessionService
  ) {}

  getUser(): Observable<IUserInfo> {
    return this.httpService.get<IUserInfo>('/users/profile', true).pipe(
      map((response: IUserInfo) => {
        this.sessionService.setLoggedUser(response);
        return response;
      })
    );
  }
}
