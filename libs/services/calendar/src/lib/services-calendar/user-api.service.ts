import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { SessionService } from './session.service';
import { IUserInfo } from '@angular-monorepo/types-calendar';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAPIService {
  private user: any = null;

  constructor(
    private httpService: HttpService,
    private sessionService: SessionService
  ) {}

  setUser(user: any): void {}

  getUser(): Observable<IUserInfo> {
    return this.httpService.get<IUserInfo>('/users/profile', true).pipe(
      map((response: IUserInfo) => {
        this.sessionService.setLoggedUser(response);
        return response;
      })
    );
  }

  clearUser(): void {
    this.user = null;
  }
}
