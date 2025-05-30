import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private darkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.darkTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.darkTheme.next(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.darkTheme.next(prefersDark);
    }
  }

  toggleTheme(): void {
    const newValue = !this.darkTheme.value;
    localStorage.setItem(this.THEME_KEY, newValue ? 'dark' : 'light');
    this.darkTheme.next(newValue);
  }
}
