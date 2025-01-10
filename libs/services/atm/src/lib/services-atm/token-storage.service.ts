import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private TOKEN = 'token-storage';

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(this.TOKEN);
    window.sessionStorage.setItem(this.TOKEN, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN);
  }

  public removeToken(): void {
    window.sessionStorage.removeItem(this.TOKEN);
  }

  constructor() { }
}
