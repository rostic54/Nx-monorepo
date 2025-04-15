import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  ILoginResponse,
  ILoginUser,
  IRegisterUser,
  IUserInfo,
} from '@angular-monorepo/types-calendar';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { UserAPIService } from './user-api.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private userAPIService: UserAPIService,
    private sessionService: SessionService
  ) {}

  login(userCredentials: ILoginUser): Observable<ILoginResponse> {
    return this.httpService
      .post<ILoginUser, ILoginResponse>('/auth/login', userCredentials, true)
      .pipe(
        switchMap((response: ILoginResponse) =>
          this.userAPIService.getUser().pipe(map(() => response))
        )
      );
  }

  signup(userCredentials: IRegisterUser): Observable<boolean> {
    return this.httpService.post('/auth/register', userCredentials);
  }
}
