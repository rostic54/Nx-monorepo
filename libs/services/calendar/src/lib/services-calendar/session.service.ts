import { IUserInfo } from "@angular-monorepo/types-calendar";
import { computed, Injectable, signal } from "@angular/core";


@Injectable({
  providedIn: 'root'
    })
    export class SessionService {
        private sessionActive = false;
        private _loggedUser = signal<IUserInfo | null>(null);
        isUserLoggedIn = computed(() => this._loggedUser() !== null);
    
        setLoggedUser(user: IUserInfo): void {
            this._loggedUser.set(user);
        }

        getUserId(): string{
            return this._loggedUser()?.id ?? "";
        }
    
        clearSession(): void {
            this._loggedUser.set(null);
        }
    }