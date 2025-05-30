import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'preferred-theme';
  private darkMode = new BehaviorSubject<boolean>(this.isDarkMode());

  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem(this.themeKey);
    const systemPrefers = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.setDarkMode(savedTheme ? savedTheme === 'dark' : systemPrefers);
  }

  private isDarkMode(): boolean {
    const saved = localStorage.getItem(this.themeKey);
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
    localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
  }

  toggleTheme(): void {
    this.setDarkMode(!this.darkMode.value);
  }
}
