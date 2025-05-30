import { Component } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { ThemeService } from '@angular-monorepo/config';

@Component({
  selector: 'lib-theme-toggle',
  standalone: true,
  imports: [MatIconButton, MatIcon, AsyncPipe],
  styleUrls: ['./theme-toggle.component.scss'],
  template: `
    <button
      mat-icon-button
      class="theme-toggle-button flex align-center"
      (click)="toggleTheme()"
      [attr.aria-label]="'Toggle theme'"
    >
      <mat-icon>{{
        (isDarkTheme$ | async) ? 'light_mode' : 'dark_mode'
      }}</mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  isDarkTheme$;

  constructor(private themeService: ThemeService) {
    this.isDarkTheme$ = themeService.darkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
