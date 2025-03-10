import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {BehaviorSubject, catchError, map, Observable, tap} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {NotificationService} from "./notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

interface TokenDetails {
  id: number,
  message: string,
  token: string,
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private PUBLIC_TOKEN_URL = 'https://randomuser.me/api/';
  private sessionStatus = false;
  private loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  set loadingStatus(status: boolean) {
    this.loading$.next(status)
  }

  isSessionActive(): boolean {
    return this.sessionStatus;
  }

  constructor(private api: ApiService,
              private notificationService: NotificationService,
              private tokenStorage: TokenStorageService,
              private router: Router) {
  }

  getToken(): Observable<boolean> {
    return this.api.get(this.PUBLIC_TOKEN_URL).pipe(
      map(({results}) => results[0]),
      map(({login, id}) => ({
        id: id.value,
        message: 'Token is gotten',
        token: login.uuid
      })),
      tap(( (tokenInfo: TokenDetails) => {
        if (tokenInfo) {
          this.setTokenAndStatus(tokenInfo.token)
        } else {
          this.removeTokenAndStatus();
        }
      })),
      map(token => !!token),
      catchError((err: HttpErrorResponse) => {
        this.notificationService.errorToast(err.message);

        throw new Error('Token is not available');
      })
    )
  }

  logout(): void {
    this.removeTokenAndStatus();
    this.router.navigate(['/']);
  }

  private setTokenAndStatus(token: string): void {
    this.tokenStorage.saveToken(token);
    this.sessionStatus = true;
  }

  private removeTokenAndStatus(): void {
    this.tokenStorage.removeToken();
    this.sessionStatus = false;
  }
}
